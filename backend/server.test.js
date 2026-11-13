import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './server.js';
const valid = {name:'Integration Test',email:'test@example.com',subject:'Database integration test',message:"A valid test message with SQL text: '; DROP TABLE contact_messages; --"};
async function serve(options, run) {
 const server = createApp(options).listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 const base = `http://127.0.0.1:${server.address().port}`;
 const post = body=>fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 try { await run({base,post}); } finally { await new Promise(resolve=>server.close(resolve)); }
}
test('validation, honeypot, parameterized storage, optional SMTP and rate limiting',async()=>{
 const calls=[];
 await serve({database:{query:async(...args)=>{calls.push(args);return {rows:[]};}},env:{}},async({base,post})=>{
  assert.equal((await post({...valid,email:'bad'})).status,400);
  assert.equal((await post({...valid,subject:'x'.repeat(201)})).status,400);
  assert.equal((await post({...valid,website:'spam'})).status,200);
  assert.equal(calls.length,0);
  const r=await post(valid); assert.equal(r.status,201);
  assert.equal((await r.json()).notification,'not_configured');
  assert.match(calls[0][0],/VALUES \(\$1, \$2, \$3, \$4, \$5\)/);
  assert.equal(calls[0][1][4],valid.message);
  assert.match(calls[0][1][0],/^[a-f0-9-]{36}$/);
  assert.equal((await post({...valid,subject:undefined})).status,201);
  assert.equal((await post(valid)).status,429);
  assert.equal((await fetch(base+'/api/contact')).status,404);
  assert.equal((await fetch(base+'/api/health/db')).status,200);
  assert.equal((await fetch(base+'/api/health',{headers:{Origin:'https://untrusted.example'}})).status,403);
  assert.equal((await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400);
 });
});
test('database outage never reports saved',async()=>{
 await serve({database:{query:async()=>{throw Error('private connection details');}},env:{}},async({base,post})=>{
  const r=await post(valid);assert.equal(r.status,503);assert.ok(!(await r.text()).includes('private'));
  assert.equal((await fetch(base+'/api/health/db')).status,503);
 });
});
for (const fails of [false,true]) test(`SMTP ${fails?'failure preserves saved message':'acceptance'}`,async()=>{
 await serve({database:{query:async()=>({rows:[]})},env:{SMTP_HOST:'test',SMTP_USER:'test',SMTP_PASS:'test',CONTACT_EMAIL:'test@example.com'},
 createTransport:()=>({sendMail:async()=>{if(fails)throw Error('secret');return {accepted:['test@example.com']};}})},async({post})=>{
 const r=await post(valid);assert.equal(r.status,201);const body=await r.json();assert.equal(body.saved,true);assert.equal(body.notification,fails?'failed':'accepted');
 });
});

test('upgraded Nodemailer composes the contact notification without network delivery', async () => {
 const { default: nodemailer } = await import('nodemailer');
 let composed;
 await serve({
  database: { query: async () => ({ rows: [] }) },
  env: { SMTP_HOST: 'unused.example', SMTP_USER: 'sender@example.com', SMTP_PASS: 'test-only', CONTACT_EMAIL: 'owner@example.com' },
  createTransport: () => ({ sendMail: async options => {
   const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
   composed = await transport.sendMail(options);
   // Simulate SMTP acceptance only after real local message composition succeeds.
   return { accepted: ['owner@example.com'] };
  } }),
 }, async ({ post }) => {
  const response = await post(valid);
  assert.equal(response.status, 201);
  assert.equal((await response.json()).notification, 'accepted');
  assert.equal(composed.envelope.from, 'sender@example.com');
  assert.deepEqual(composed.envelope.to, ['owner@example.com']);
  const text = composed.message.toString();
  assert.match(text, /Reply-To: test@example.com/);
  assert.match(text, /Subject: Portfolio enquiry: Database integration test/);
  assert.match(text, /Integration Test/);
 });
});

test('invalid payloads, oversized requests and public reads do not persist messages', async () => {
 let writes = 0;
 await serve({database:{query:async()=>{writes++;return {rows:[]};}},env:{}},async({base,post})=>{
  for (const invalid of [{...valid,name:' '},{...valid,subject:'Bad\r\nHeader'}, {...valid,message:'x\0'.repeat(10)}, {...valid,email:{value:'test@example.com'}}]) {
   assert.equal((await post(invalid)).status,400);
  }
  assert.equal((await post({...valid,website:'bot.example'})).status,200);
  assert.equal((await post({...valid,message:'x'.repeat(14000)})).status,413);
  for (const path of ['/api/contact','/api/contact_messages','/api/messages','/api/contact/123']) {
   const response=await fetch(base+path);
   assert.equal(response.status,404);
   assert.ok(!(await response.text()).includes(valid.email));
  }
  const health=await fetch(base+'/api/health');
  assert.equal(health.status,200);
  assert.equal(health.headers.get('cache-control'),'no-store');
  assert.equal(health.headers.get('x-content-type-options'),'nosniff');
  assert.equal(writes,0);
 });
});

test('SMTP requires TLS and database persistence precedes notification',async()=>{
 let saved=false;
 await serve({database:{query:async()=>{saved=true;return {rows:[]};}},
  env:{SMTP_HOST:'unused',SMTP_USER:'sender@example.com',SMTP_PASS:'test-only',CONTACT_EMAIL:'owner@example.com'},
  createTransport:options=>{assert.equal(saved,true);assert.equal(options.requireTLS,true);return {sendMail:async()=>({accepted:['owner@example.com']})};}
 },async({post})=>{assert.equal((await post(valid)).status,201);});
});

test('proxy hop configuration is explicit and rejects unsafe values',()=>{
 for(const value of ['true','-1','1.5','wrong']) assert.throws(()=>createApp({env:{TRUST_PROXY_HOPS:value}}),/non-negative integer/);
 assert.equal(createApp({env:{TRUST_PROXY_HOPS:'1'}}).get('trust proxy'),1);
 assert.equal(createApp({env:{}}).get('trust proxy'),false);
});

test('development CORS accepts both Vite ports while production stays explicit',async()=>{
 const preflight=(base,origin)=>fetch(base+'/api/contact',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});
 for(const NODE_ENV of [undefined,'development']) {
  await serve({env:{NODE_ENV,FRONTEND_URL:'http://localhost:5173'}},async({base})=>{
   for(const origin of ['http://localhost:5173','http://localhost:5174']) {
    const response=await preflight(base,origin);
    assert.equal(response.status,204);
    assert.equal(response.headers.get('access-control-allow-origin'),origin);
    assert.match(response.headers.get('access-control-allow-methods'),/POST/);
    assert.match(response.headers.get('access-control-allow-headers'),/content-type/i);
   }
   assert.equal((await preflight(base,'http://localhost:5175')).status,403);
  });
 }
 for(const NODE_ENV of ['production','test']) {
  await serve({env:{NODE_ENV,FRONTEND_URL:'https://portfolio.example'}},async({base})=>{
   const response=await preflight(base,'https://portfolio.example');
   assert.equal(response.status,204);
   assert.equal(response.headers.get('access-control-allow-origin'),'https://portfolio.example');
   for(const origin of ['http://localhost:5173','http://localhost:5174','https://untrusted.example']) {
    const blocked=await preflight(base,origin);
    assert.equal(blocked.status,403);
    assert.equal(blocked.headers.get('access-control-allow-origin'),null);
   }
  });
 }
 await serve({env:{NODE_ENV:'production'}},async({base})=>{
  assert.equal((await preflight(base,'http://localhost:5173')).status,403);
 });
});
