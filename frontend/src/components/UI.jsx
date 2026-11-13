import React from 'react';

export function ButtonLink({ children, variant = 'primary', className = '', ...props }) {
  return <a className={`btn ${variant} ${className}`} {...props}>{children}</a>;
}

export function SocialLinks({ github, linkedin }) {
  return <div className="social" aria-label="Social profiles">
    <a href={github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
    <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
  </div>;
}
