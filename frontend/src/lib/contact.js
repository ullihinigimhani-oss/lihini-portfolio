export const CONTACT_EMAIL = 'ul.lihinigimhani@gmail.com';

export function contactApiBase(apiUrl, isDevelopment = false) {
  const configured = typeof apiUrl === 'string' ? apiUrl.trim() : '';
  if (!configured) return isDevelopment ? 'http://localhost:5000' : '';
  try {
    const url = new URL(configured);
    const local = url.hostname === 'localhost' || url.hostname.endsWith('.localhost')
      || /^127\./.test(url.hostname) || ['[::1]', '0.0.0.0'].includes(url.hostname);
    if (url.username || url.password || !['http:', 'https:'].includes(url.protocol)) return '';
    // A stale localhost setting must never send a deployed visitor to their own machine.
    if (!isDevelopment && (local || url.protocol !== 'https:')) return '';
    return configured.replace(/\/+$/, '');
  } catch { return ''; }
}

export function validateContact(form) {
  const valid = (key, min, max) => typeof form[key] === 'string'
    && form[key].trim().length >= min && form[key].trim().length <= max && !form[key].includes('\0');
  if (!valid('name',2,100) || !valid('email',3,150) || !valid('subject',2,200) || !valid('message',10,3000)
    || /[\r\n]/.test(form.name + form.email + form.subject)
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Please enter a valid name, email address, subject, and a message of at least 10 characters.';
  }
  return '';
}

export function contactMailto(form) {
  const body = [`Name: ${form.name.trim()}`, `Email: ${form.email.trim()}`, `Subject: ${form.subject.trim()}`, '', 'Message:', form.message.trim()].join('\r\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(body)}`;
}
