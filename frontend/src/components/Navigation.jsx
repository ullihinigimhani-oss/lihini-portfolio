import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';

const sections = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Certifications', 'Contact'];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const toggle = useRef(null);
  const header = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#090d1b' : '#f7f6fc');
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Storage can be unavailable in private contexts. */ }
  }, [theme]);

  useEffect(() => {
    const update = () => {
      const offset = (header.current?.offsetHeight || 80) + 100;
      let current = 'home';
      for (const title of sections) {
        const id = title.toLowerCase();
        if (document.getElementById(id)?.getBoundingClientRect().top <= offset) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
      setActive(current);
    };
    let frame;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1240px)');
    const close = () => setOpen(false);
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const escape = event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    const outside = event => { if (!header.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [open]);

  function navigate(event, id) {
    setActive(id);
    setOpen(false);
    // Put keyboard focus at the destination when the disclosure disappears.
    if (open) requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  }

  return <header className="nav" ref={header} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <div className="container nav-inner">
      <a href="#home" className="brand" aria-label="Lihini Gimhani, home" onClick={event => navigate(event, 'home')}>
        <span className="logo">LG<span>.</span></span><span className="brand-name">Lihini Gimhani</span>
      </a>
      <nav id="primary-navigation" aria-label="Main navigation" className={`links${open ? ' open' : ''}`}>
        {sections.map(title => { const id = title.toLowerCase(); return <a key={id} href={`#${id}`} className={id === 'contact' ? 'nav-contact' : ''}
          aria-current={active === id ? 'location' : undefined} onClick={event => navigate(event, id)}>{title}{id === 'contact' && <ArrowUpRight size={15} aria-hidden="true"/>}</a>; })}
      </nav>
      <div className="nav-actions">
        <button className="icon-button theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? <Sun size={19} aria-hidden="true"/> : <Moon size={19} aria-hidden="true"/>}
        </button>
        <button ref={toggle} className="icon-button menu" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={21} aria-hidden="true"/> : <Menu size={21} aria-hidden="true"/>}
        </button>
      </div>
    </div>
  </header>;
}
