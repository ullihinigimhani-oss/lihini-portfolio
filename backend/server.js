import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { createDatabase, initializeDatabase } from './database.js';

export function createApp({ database, env = process.env, createTransport = nodemailer.createTransport } = {}) {
 const app = express();
 app.disable('x-powered-by');
 app.use((_req, res, next) => {
  res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
  next();
 });
 // Configure only after verifying the deployment proxy topology.
 if (env.TRUST_PROXY_HOPS !== undefined && env.TRUST_PROXY_HOPS !== '') {
  if (!/^\d+$/.test(String(env.TRUST_PROXY_HOPS)) || !Number.isSafeInteger(Number(env.TRUST_PROXY_HOPS))) {
   throw new Error('TRUST_PROXY_HOPS must be a non-negative integer');
  }
  app.set('trust proxy', Number(env.TRUST_PROXY_HOPS));
 }
 const origins = (env.FRONTEND_URL || 'http://localhost:5173').split(',').map(v => v.trim()).filter(Boolean);
 app.use(cors({ origin: (origin, cb) => !origin || origins.includes(origin) ? cb(null, true) : cb(new Error('CORS blocked')) }));
 app.use(express.json({ limit: '12kb' }));
 app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'lihini-portfolio-api' }));
 app.get('/api/health/db', async (_req, res) => {
  try { await database.query('SELECT 1'); res.json({ database: 'connected' }); }
  catch { res.status(503).json({ database: 'unavailable' }); }
 });
 const limit = rateLimit({ windowMs: 15*60*1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'Too many messages. Please try again later.' } });
 app.post('/api/contact', limit, async (req, res) => {
  const body = req.body || {};
  if (body.website) return res.json({ success: true });
  const field = (key, min, max) => typeof body[key] === 'string' && body[key].trim().length >= min && body[key].trim().length <= max && !body[key].includes('\0') ? body[key].trim() : null;
  const name = field('name',2,100), email = field('email',3,150), message = field('message',10,3000);
  // Keep compatibility with existing clients without a subject.
  const subject = body.subject === undefined ? 'Portfolio enquiry' : field('subject',2,200);
  if (!name || !email || !subject || !message || /[\r\n]/.test(name+email+subject) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
   return res.status(400).json({ error: 'Enter a valid name (2-100), email (up to 150), subject (2-200), and message (10-3000 characters).' });
  try {
   await database.query('INSERT INTO contact_messages (id, name, email, subject, message) VALUES ($1, $2, $3, $4, $5)', [randomUUID(),name,email,subject,message]);
  } catch {
   console.error('Contact message could not be saved');
   return res.status(503).json({ error: 'Your message could not be saved. Please try again or email me directly.' });
  }
  const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS,CONTACT_EMAIL} = env;
  let notification = 'not_configured';
  if (SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_EMAIL) {
   try {
    const transporter = createTransport({host:SMTP_HOST,port:Number(SMTP_PORT||587),secure:Number(SMTP_PORT||587)===465,requireTLS:true,
     auth:{user:SMTP_USER,pass:SMTP_PASS},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});
    const result = await transporter.sendMail({from:SMTP_USER,to:CONTACT_EMAIL,replyTo:email,subject:`Portfolio enquiry: ${subject}`,text:`Name: ${name}\nEmail: ${email}\n\n${message}`});
    notification = result.accepted?.length ? 'accepted' : 'failed';
   } catch { notification = 'failed'; console.error('Contact email notification failed'); }
  }
  return res.status(201).json({success:true,saved:true,notification,message:'Thank you! Your message has been saved.'});
 });
 app.use((err,_req,res,_next) => res.status(err.message === 'CORS blocked' ? 403 : err.status === 413 ? 413 : 400)
  .json({error:err.message === 'CORS blocked' ? 'Origin not allowed' : 'Invalid request'}));
 return app;
}
async function start() {
 let database;
 try {
  database = createDatabase();
  await initializeDatabase(database);
  console.log('Database connected; contact table ready');
  const server = createApp({database}).listen(Number(process.env.PORT||5000),'0.0.0.0',()=>console.log('Portfolio API started'));
  for (const signal of ['SIGINT','SIGTERM']) process.once(signal,()=>server.close(()=>database.end().finally(()=>process.exit(0))));
 } catch {
  console.error('Backend startup failed. Check database configuration and connectivity.');
  if (database) await database.end();
  process.exitCode = 1;
 }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await start();
