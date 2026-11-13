import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ExternalLink, Github, X } from 'lucide-react';
import Reveal from './Reveal';
import ProjectCover from './ProjectCover';
import { filterProjects, internshipProjects, internshipContributions } from '../data/projects';

function ProjectDetails({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    dialog.current.showModal();
    return () => { opener?.focus({ preventScroll: true }); };
  }, []);
  return <dialog className="project-dialog" ref={dialog} aria-labelledby="project-detail-title" onClose={onClose}>
    <div className="detail-header"><span className="project-type">{project.context}</span><button autoFocus type="button" className="icon-button" aria-label="Close project details" onClick={() => dialog.current.close()}><X size={20}/></button></div>
    <h2 id="project-detail-title">{project.title}</h2><p>{project.desc}</p>
    <ProjectCover title={project.title}/>
    <h3>The problem</h3><p>{project.problem}</p>
    <h3>Implemented in the repository</h3><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
    <h3>Technology &amp; architecture</h3><div className="tags">{project.tech.map(tech => <span key={tech}>{tech}</span>)}</div><p>{project.architecture}</p>
    <p className="verification-note">{project.limits}</p>
    <p className="verification-note">This overview describes repository functionality. Individual responsibilities and team ownership have not been attributed from source code alone.</p>
    <div className="project-links"><a href={project.url} target="_blank" rel="noreferrer"><Github size={17}/> Source repository <ArrowUpRight size={15}/></a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer"><ExternalLink size={17}/> Live demo</a>}</div>
    <details className="source-evidence"><summary>Source references · reviewed 13 November 2026</summary><ul>{project.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul></details>
  </dialog>;
}

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const filtered = filterProjects(filter);
  return <Reveal as="section" tabIndex={-1} id="projects" className="section container">
    <div className="section-label">03 / SELECTED WORK</div>
    <div className="section-heading"><h2>Projects with <span className="gradient-text">purpose.</span></h2><p>Explore the problem, implementation, and technology behind each project. Internship contributions are presented separately below.</p></div>
    <div className="filters" aria-label="Filter projects">{['All','Featured','Mobile','Web','Enterprise'].map(category => <button type="button" key={category} aria-pressed={filter === category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <p className="project-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'} · {filter}</p>
    <div className="projects-grid" key={filter}>{filtered.map((project,index) => <Reveal as="article" delay={(index%2)*80} className="project-card" key={project.id}>
      <ProjectCover title={project.title}/>
      <div className="project-info"><span className="project-type">{project.type}</span><h3>{project.title}</h3><span className="project-context">{project.context}</span><p>{project.desc}</p>
        {project.tech.length > 0 && <div className="tags">{project.tech.map(tech => <span key={tech}>{tech}</span>)}</div>}
        {project.unavailable && <p className="verification-note">{project.limits}</p>}
        <div className="project-links">{project.url && <a href={project.url} target="_blank" rel="noreferrer"><Github size={17}/> Source code <ArrowUpRight size={15}/></a>}
          {project.suppliedUrl && <a href={project.suppliedUrl} target="_blank" rel="noreferrer">Supplied GitHub link · unavailable <ArrowUpRight size={15}/></a>}
          {project.demo && <a href={project.demo} target="_blank" rel="noreferrer"><ExternalLink size={17}/> Live demo</a>}
          {project.features && <button type="button" className="project-detail-button" onClick={() => setSelected(project)}>View details <ArrowUpRight size={15}/></button>}
        </div>
      </div>
    </Reveal>)}</div>
    <div className="internship-heading"><span className="section-label">PROFESSIONAL CONTRIBUTIONS</span><h3>Enterprise work, as part of a team.</h3><p>Full Stack Developer Intern · Ceylon X Corporation · January–July 2026 · Remote</p><p>Across the HRM and CRM applications, my contributions included:</p><ul>{internshipContributions.map(contribution => <li key={contribution}>{contribution}</li>)}</ul></div>
    <div className="projects-grid">{internshipProjects.map((project,index) => <Reveal as="article" className="project-card" key={project.id} delay={index*80}><ProjectCover title={project.title}/><div className="project-info"><span className="project-type">{project.type}</span><h3>{project.title}</h3><p>{project.desc}</p><span className="private-note">Internship contribution · Company code and internal systems are private</span></div></Reveal>)}</div>
    {selected && <ProjectDetails key={selected.id} project={selected} onClose={() => setSelected(null)}/>}
  </Reveal>;
}
