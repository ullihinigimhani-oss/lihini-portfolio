import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTACT_EMAIL, contactApiBase, contactMailto, validateContact} from './contact.js';
const form={name:'Visitor & Team',email:'visitor@example.com',subject:'Project enquiry & collaboration',message:'Hello Lihini!\nI would like to discuss a project.'};
test('production without a usable API uses email instead of local or invalid endpoints',()=>{
 for(const url of [undefined,'','  ','http://localhost:5000','https://localhost:5000','http://127.0.0.1:5000','https://127.1.2.3','https://[::1]:5000','https://0.0.0.0','not-a-url','mailto:someone@example.com']) assert.equal(contactApiBase(url,false),'');
 assert.equal(contactApiBase(' https://portfolio-api.example/ ',false),'https://portfolio-api.example');
 assert.equal(contactApiBase(undefined,true),'http://localhost:5000');
 assert.equal(contactApiBase('http://localhost:5001/',true),'http://localhost:5001');
});
test('draft preserves all visitor fields with safe URL encoding',()=>{
 const url=new URL(contactMailto(form));
 assert.equal(url.pathname,CONTACT_EMAIL);
 assert.equal(url.searchParams.get('subject'),form.subject);
 const body=url.searchParams.get('body');
 for(const value of Object.values(form)) assert.ok(body.includes(value));
 assert.ok(body.includes('Name: ') && body.includes('Email: ') && body.includes('Subject: ') && body.includes('Message:'));
});
test('validation rejects whitespace, short messages, header injection and invalid email',()=>{
 assert.equal(validateContact(form),'');
 for(const invalid of [{...form,name:' '},{...form,email:'invalid'},{...form,subject:'x\r\nInjected'},{...form,message:'short'}]) assert.ok(validateContact(invalid));
});
