import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { CONTACT_EMAIL, contactApiBase, contactMailto, validateContact } from '../lib/contact';

const emptyForm = {name:'',email:'',subject:'',message:'',website:''};
const apiBase = contactApiBase(import.meta.env.VITE_API_URL, import.meta.env.DEV);

export default function ContactForm() {
  const [form,setForm] = useState(emptyForm);
  const [status,setStatus] = useState('');
  const [busy,setBusy] = useState(false);
  const [draft,setDraft] = useState('');
  const update = event => {
    setForm({...form,[event.target.name]:event.target.value});
    setDraft('');
    setStatus('');
  };
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setStatus('');
    if (form.website) return;
    const error = validateContact(form);
    if (error) { setStatus(error); return; }
    if (!apiBase) {
      setDraft(contactMailto(form));
      setStatus('Your email draft is ready. Open your email app, review the details, and press Send there. Nothing has been sent from this website.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`${apiBase}/api/contact`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your message could not be saved.');
      setStatus(result.saved ? 'Thank you! Your message has been saved.' : 'Your request was received.');
      setForm(emptyForm);
    } catch (error) {
      setStatus(`${error.message} — alternatively email me directly at ${CONTACT_EMAIL}.`);
    } finally { setBusy(false); }
  }
  return <form className="contact-form" aria-busy={busy} aria-describedby={!apiBase ? 'email-fallback-help' : undefined} onSubmit={submit}>
    <h3>Send a message</h3>
    <label>Your name<input required minLength="2" maxLength="100" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={update}/></label>
    <label>Email address<input required type="email" name="email" autoComplete="email" maxLength="150" placeholder="you@example.com" value={form.email} onChange={update}/></label>
    <label>Subject<input required name="subject" minLength="2" maxLength="200" placeholder="What is your message about?" value={form.subject} onChange={update}/></label>
    <label>Message<textarea required name="message" minLength="10" maxLength="3000" rows="5" placeholder="Tell me about your project or opportunity..." value={form.message} onChange={update}/></label>
    <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="honeypot" value={form.website} onChange={update}/>
    {!apiBase && <p id="email-fallback-help" className="form-status email-fallback-help">Send via your own email app. Prepare your draft below, then choose Open Email App. You will need to press Send in your email app to deliver it.</p>}
    <button className="btn primary" type="submit" disabled={busy}>{busy?'Sending...':apiBase?'Send message':'Prepare email'} <Send size={17} aria-hidden="true"/></button>
    {status && <p role="status" className="form-status">{status}</p>}
    {draft && <div className="email-draft-actions"><a className="btn outline" href={draft} aria-describedby="email-fallback-help"><Mail size={18} aria-hidden="true"/> Open Email App</a><p className="form-status">If no app opens, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> directly. Your form details will stay here until you leave or refresh.</p></div>}
  </form>;
}
