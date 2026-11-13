import assert from 'node:assert/strict';
import { createDatabase, initializeDatabase } from './database.js';
import { createApp } from './server.js';
let pool,client,server;
try {
 pool=createDatabase();await initializeDatabase(pool);
 client=await pool.connect();await client.query('BEGIN');
 server=createApp({database:client,env:{NODE_ENV:'development',FRONTEND_URL:'http://localhost:5173'}}).listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(base+'/api/health/db')).status,200);
 for(const origin of ['http://localhost:5173','http://localhost:5174']) {
 const preflight=await fetch(base+'/api/contact',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});
 assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),origin);
 const email=`integration-${Date.now()}-${origin.endsWith('5174')?'5174':'5173'}@example.com`;
 const result=await fetch(base+'/api/contact',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({name:'Integration Test',email,subject:'Automated database check',message:'Temporary integration test; transaction will be rolled back.'})});
 assert.equal(result.status,201);assert.equal((await result.json()).saved,true);
 assert.equal(result.headers.get('access-control-allow-origin'),origin);
 const saved=await client.query('SELECT id, status, created_at FROM contact_messages WHERE email=$1',[email]);
 assert.equal(saved.rowCount,1);assert.equal(saved.rows[0].status,'received');assert.ok(saved.rows[0].created_at);
 console.log(`PASS: preflight, contact API and Neon storage for ${origin}. SMTP disabled.`);
 }
} catch { console.error('FAIL: live database integration check could not complete; no credentials or error details printed.');process.exitCode=1; }
finally {
 if(server)await new Promise(resolve=>server.close(resolve));
 if(client){try{await client.query('ROLLBACK');console.log('Test transaction rolled back; temporary submissions removed.');}finally{client.release();}}
 if(pool)await pool.end();
}
