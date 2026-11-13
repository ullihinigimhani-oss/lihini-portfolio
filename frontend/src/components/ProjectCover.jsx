import React from 'react';

const covers = {
  'ResQ1': ['resq1', 'Flood monitoring map with emergency advisory and community response panels'],
  'WildGuard.lk': ['wildguard', 'Conservation map with ranger reporting and wildlife monitoring panels'],
  'Arogya': ['arogya', 'Connected healthcare services, appointment cards, and a service architecture diagram'],
  'Personal Library Manager': ['library', 'Illustrated book collection with reading status categories'],
  'Textile Saree Management': ['textile', 'Textile swatches beside an illustrative inventory table'],
  '3S HRM': ['hrm', 'Human resources overview with fictional team records and a workforce chart'],
  'Celcius CRM': ['crm', 'Customer relationship pipeline containing fictional sample contacts'],
};

export default function ProjectCover({ title }) {
  const [file, description] = covers[title];
  return <figure className="project-cover">
    <div className="project-cover-frame">
      <img src={`/projects/${file}.svg`} alt={`${title} conceptual illustration: ${description}. Not an application screenshot.`}
        width="960" height="540" loading="lazy" decoding="async"/>
    </div>
    <figcaption>Concept illustration <span aria-hidden="true">·</span> Not an application screenshot</figcaption>
  </figure>;
}
