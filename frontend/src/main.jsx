import React from 'react';import{createRoot}from'react-dom/client';import{Github,Linkedin,Mail,ArrowUpRight}from'lucide-react';import './style.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Reveal from './components/Reveal';
import Projects from './components/Projects';
import ContactForm from './components/ContactForm';
import { Skills, Experience, Certifications } from './components/Qualifications';
const GITHUB='https://github.com/ullihinigimhani-oss';const LINKEDIN='https://www.linkedin.com/in/lihini-gimhani/';
function App(){
return <><a className="skip-link" href="#main-content">Skip to content</a><Navigation/><main id="main-content" tabIndex={-1}><Hero github={GITHUB} linkedin={LINKEDIN}/>
<Reveal as="section" tabIndex={-1} id="about" className="section container"><div className="section-label">01 / ABOUT ME</div><div className="about-grid"><div><h2>Curiosity meets <span className="gradient-text">craft.</span></h2><p className="sublead">I love turning complex ideas into clean, intuitive, and useful software.</p></div><Reveal delay={100} className="about-copy"><p>I'm currently pursuing a BSc (Hons) in Information Technology, specializing in Software Engineering at SLIIT. Through hands-on academic projects and a full-stack development internship, I've developed experience building responsive interfaces and integrating backend systems.</p><p>My interests include full-stack web development, cross-platform mobile apps, cloud technologies and intelligent systems. I'm looking for opportunities where I can build, learn, and contribute to impactful products.</p><div className="mini-metrics"><div><b>5</b><span>Portfolio projects</span></div><div><b>6 mo</b><span>Full-stack internship</span></div><div><b>11</b><span>Learning certificates</span></div></div></Reveal></div></Reveal>
<Skills/>
<Projects/>
<Experience/>
<Certifications/>
<Reveal as="section" tabIndex={-1} id="contact" className="section contact-section"><div className="container contact-grid"><div><div className="section-label">06 / GET IN TOUCH</div><h2>Have an idea?<br/><span className="gradient-text">Let's build it.</span></h2><p>I'm open to junior software engineering opportunities, meaningful collaborations and interesting projects.</p><a href="mailto:ul.lihinigimhani@gmail.com" className="contact-mail"><Mail size={19}/> ul.lihinigimhani@gmail.com</a><div className="social"><a href={GITHUB} target="_blank" rel="noreferrer"><Github size={18}/> GitHub</a><a href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={18}/> LinkedIn</a></div></div><ContactForm/></div></Reveal></main><footer><div className="container foot"><span className="logo">LG<span>.</span></span><p>Designed & built with care · © {new Date().getFullYear()} Lihini Gimhani</p><a href="#home">Back to top ↑</a></div></footer></>}
createRoot(document.getElementById('root')).render(<App/>);
