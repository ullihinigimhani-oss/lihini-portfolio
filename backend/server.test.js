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
