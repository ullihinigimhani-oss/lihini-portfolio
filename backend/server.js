import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const app=express();
const allowedOrigins=(process.env.FRONTEND_URL||'http://localhost:5173').split(',').map(v=>v.trim()).filter(Boolean);
app.use(cors({origin:(origin,cb)=>!origin||allowedOrigins.includes(origin)?cb(null,true):cb(new Error('CORS blocked'))}));
app.use(express.json({limit:'12kb'}));
app.get('/api/health',(_req,res)=>res.json({status:'ok',service:'lihini-portfolio-api'}));
const limit=rateLimit({windowMs:15*60*1000,limit:5,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many messages. Please try again later.'}});
const clean=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
app.post('/api/contact',limit,async(req,res)=>{
 const {name,email,message,website}=req.body||{};
 if(website)return res.json({success:true});
 const n=clean(name,100),e=clean(email,150),m=clean(message,3000);
 if(n.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||m.length<10)return res.status(400).json({error:'Please enter valid name, email and a message of at least 10 characters.'});
 const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS,CONTACT_EMAIL}=process.env;
 if(!SMTP_HOST||!SMTP_USER||!SMTP_PASS||!CONTACT_EMAIL)return res.status(503).json({error:'Contact email is not configured yet. Please email me directly.'});
 try{
  const transporter=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT||587),secure:Number(SMTP_PORT||587)===465,auth:{user:SMTP_USER,pass:SMTP_PASS}});
  await transporter.sendMail({from:SMTP_USER,to:CONTACT_EMAIL,replyTo:e,subject:`Portfolio enquiry from ${n.replace(/[\r\n]/g,' ')}`,text:`Name: ${n}\nEmail: ${e}\n\nMessage:\n${m}`});
  return res.json({success:true});
 }catch(err){console.error('Email delivery error:',err.message);return res.status(502).json({error:'Email delivery failed. Please contact me by email directly.'});}
});
app.use((err,_req,res,_next)=>res.status(400).json({error:err.message==='CORS blocked'?'Origin not allowed':'Invalid request'}));
const port=Number(process.env.PORT||10000);app.listen(port,'0.0.0.0',()=>console.log(`API running on port ${port}`));
