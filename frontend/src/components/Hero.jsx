import React from 'react';
import { ArrowDown, ArrowUpRight, Code2, Download, Github, Linkedin } from 'lucide-react';
import { ButtonLink } from './UI';
import Reveal from './Reveal';

export default function Hero({ github, linkedin }) {
  return <section className="hero container" id="home" tabIndex={-1} aria-labelledby="hero-title">
    <div className="hero-copy">
      <span className="eyebrow"><span className="pulse" aria-hidden="true"/> OPEN TO OPPORTUNITIES</span>
      <p className="hero-greeting">Hello, I'm</p>
      <Reveal as="h1" immediate id="hero-title">Lihini<br/><span className="gradient-text">Gimhani<span className="hero-period">.</span></span></Reveal>
      <Reveal as="p" immediate delay={60} className="hero-title">Junior Software Engineer <span aria-hidden="true">|</span> Full-Stack Developer <span aria-hidden="true">|</span> Mobile App Developer</Reveal>
      <Reveal as="p" immediate delay={120} className="intro">I'm a Software Engineering undergraduate at SLIIT with hands-on full-stack development experience, passionate about building modern web and mobile applications.</Reveal>
      <Reveal immediate delay={180} className="hero-buttons">
        <ButtonLink href="#projects">Explore Projects <ArrowUpRight size={18} aria-hidden="true"/></ButtonLink>
        <ButtonLink variant="outline" href="/Lihini_Gimhani_CV.pdf" download>Download CV <Download size={17} aria-hidden="true"/></ButtonLink>
      </Reveal>
      <div className="hero-socials">
        <span>CONNECT WITH ME</span>
        <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile (opens in a new tab)"><Github size={19} aria-hidden="true"/></a>
        <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile (opens in a new tab)"><Linkedin size={19} aria-hidden="true"/></a>
        <a href="#contact" className="hero-contact">Let's connect <ArrowUpRight size={15} aria-hidden="true"/></a>
      </div>
    </div>
    <div className="hero-visual">
      <div className="portrait-glow" aria-hidden="true"/>
      <div className="portrait-frame"><img className="portrait" src="/profile.png" width="520" height="600" fetchPriority="high" alt="Lihini Gimhani"/></div>
      <div className="portrait-caption"><span className="caption-icon"><Code2 size={22} aria-hidden="true"/></span><div><strong>Thoughtful code. Useful experiences.</strong><span>Web & mobile development</span></div></div>
      <span className="portrait-coordinate" aria-hidden="true">DESIGN · DEVELOP · KEEP LEARNING</span>
    </div>
    <a className="scroll-note" href="#about"><span className="scroll-icon"><ArrowDown size={15} aria-hidden="true"/></span> A LITTLE MORE ABOUT ME</a>
  </section>;
}
