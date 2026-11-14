import React, { useState } from 'react';
import { Award, ArrowUpRight, BriefcaseBusiness, ChevronDown, Cloud, Code2, Database, GraduationCap, Monitor, Server, Smartphone, Wrench } from 'lucide-react';
import Reveal from './Reveal';
import { skillCategories, certificates, certificateIssuers, visibleCertificates, formatCertificateDate, experience, education } from '../data/qualifications';

const icons = {code:Code2,web:Monitor,server:Server,mobile:Smartphone,database:Database,cloud:Cloud,tools:Wrench};

export function Skills() {
  return <Reveal as="section" id="skills" tabIndex={-1} className="section muted-section" aria-labelledby="skills-title"><div className="container">
    <div className="section-label">02 / TECHNICAL SKILLS</div>
    <div className="section-heading"><h2 id="skills-title">Tools I work <span className="gradient-text">with.</span></h2><p>Experience in context: internship use, academic and project work, and technologies studied or explored.</p></div>
    <p className="qualification-note">These labels describe where I have used or studied a technology, rather than a proficiency score. Project configuration experience does not imply production infrastructure ownership.</p>
    <div className="skills-grid">{skillCategories.map((category,index)=>{const Icon=icons[category.icon];return <Reveal as="article" className="skill-card" key={category.title} delay={(index%3)*70}>
      <div className="skill-icon"><Icon size={21} aria-hidden="true"/></div><h3>{category.title}</h3>
      {category.groups.map(group=><div className="skill-experience-group" key={group.level}><h4>{group.level}</h4><div className="tags">{group.items.map(item=><span key={item}>{item}</span>)}</div></div>)}
    </Reveal>;})}</div>
  </div></Reveal>;
}

export function Experience() {
  return <Reveal as="section" id="experience" tabIndex={-1} className="section muted-section" aria-labelledby="experience-title"><div className="container">
    <div className="section-label">04 / EXPERIENCE & EDUCATION</div><h2 id="experience-title">Practical experience.<br/><span className="gradient-text">A foundation to build on.</span></h2>
    <div className="timeline">
      <Reveal as="article" className="timeline-card" aria-labelledby="internship-title"><span className="timeline-icon"><BriefcaseBusiness size={20} aria-hidden="true"/></span><div>
        <span className="period"><time dateTime={experience.start}>January 2026</time> – <time dateTime={experience.end}>July 2026</time> · {experience.arrangement}</span>
        <h3 id="internship-title">{experience.role}</h3><strong>{experience.company}</strong>
        <p>Contributed to <strong>3S HRM</strong> and <strong>Celcius CRM</strong> as part of the development team.</p>
        <ul className="experience-contributions">{experience.contributions.map(item=><li key={item}>{item}</li>)}</ul>
        <a className="qualification-link" href="#projects">Explore the selected professional work <ArrowUpRight size={15} aria-hidden="true"/></a>
      </div></Reveal>
      <Reveal as="article" className="timeline-card" aria-labelledby="education-title"><span className="timeline-icon"><GraduationCap size={20} aria-hidden="true"/></span><div>
        <span className="period"><time dateTime={education.start}>October 2023</time> – <time dateTime={education.end}>December 2027</time> (Expected)</span>
        <h3 id="education-title">{education.degree}</h3><strong>{education.institution}</strong>
        <p>{education.specialization}</p><span className="education-status">{education.status} · Degree in progress</span>
      </div></Reveal>
    </div>
  </div></Reveal>;
}

export function Certifications() {
  const [expanded,setExpanded]=useState(false);
  const shown=visibleCertificates(expanded);
  return <Reveal as="section" id="certifications" tabIndex={-1} className="section container" aria-labelledby="certifications-title">
    <div className="section-label">05 / CONTINUOUS LEARNING</div>
    <div className="section-heading"><h2 id="certifications-title">Learning never <span className="gradient-text">stops.</span></h2><p>Training and learning certificates from AWS and the University of Moratuwa. AWS entries are course completions, not professional certification exams.</p></div>
    <p className="qualification-note" role="status">Showing {shown.length} of {certificates.length} certificates</p>
    <div id="certificate-gallery">{certificateIssuers.map((issuer,index)=><div className="certificate-group" key={issuer} aria-labelledby={`certificate-issuer-${index}`}>
      <h3 className="certificate-issuer" id={`certificate-issuer-${index}`}>{issuer}</h3>
      <div className="cert-grid">{shown.filter(certificate=>certificate.issuer===issuer).map((certificate,cardIndex)=><Reveal as="a" className="cert-card" delay={(cardIndex%2)*70} key={certificate.file} href={`/certificates/${certificate.file}`} target="_blank" rel="noreferrer">
        <span className="cert-icon"><Award size={20} aria-hidden="true"/></span><div>
          <small>{certificate.issuer}</small><h4 className="certificate-title">{certificate.title}</h4>
          <span className="certificate-date">{certificate.date ? <>{certificate.dateKind} <time dateTime={certificate.date}>{formatCertificateDate(certificate.date)}</time></> : 'Date not printed on certificate'}</span>
          <span className="certificate-action">View certificate <span className="sr-only">PDF (opens in a new tab)</span></span>
        </div><ArrowUpRight size={17} className="cert-arrow" aria-hidden="true"/>
      </Reveal>)}</div>
    </div>)}</div>
    <button type="button" className="show-more" aria-expanded={expanded} aria-controls="certificate-gallery" onClick={()=>setExpanded(!expanded)}>{expanded?'Show less':'Show more · View all 11 certificates'}<ChevronDown className={expanded?'up':''} size={17} aria-hidden="true"/></button>
  </Reveal>;
}
