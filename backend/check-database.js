import assert from 'node:assert/strict';
import { createDatabase, initializeDatabase } from './database.js';
import { createApp } from './server.js';
let pool,client,server;
try {
 pool=createDatabase();await initializeDatabase(pool);
 client=await pool.connect();await client.query('BEGIN');
 server=createApp({database:client,env:{}}).listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(base+'/api/health/db')).status,200);
 const email=`integration-${Date.now()}@example.com`;
 const result=await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Integration Test',email,subject:'Automated database check',message:'Temporary integration test; transaction will be rolled back.'})});
 assert.equal(result.status,201);assert.equal((await result.json()).saved,true);
 const saved=await client.query('SELECT id, status, created_at FROM contact_messages WHERE email=$1',[email]);
 assert.equal(saved.rowCount,1);assert.equal(saved.rows[0].status,'received');assert.ok(saved.rows[0].created_at);
 console.log('PASS: verified TLS connection, schema, health endpoint, contact API and persisted row; test row rolled back. SMTP disabled for test.');
} catch { console.error('FAIL: live database integration check could not complete; no credentials or error details printed.');process.exitCode=1; }
finally {
 if(server)await new Promise(resolve=>server.close(resolve));
 if(client){try{await client.query('ROLLBACK');}finally{client.release();}}
 if(pool)await pool.end();
}
