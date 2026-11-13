const github = 'https://github.com/ullihinigimhani-oss';
const source = (repo, path) => ({ label: path, url: `${github}/${repo}/blob/HEAD/${path}` });
export const projects = [
  {
    id: 'resq1', title: 'ResQ1', type: 'Mobile · Disaster Management', context: 'Project work', categories: ['Mobile'], featured: true,
    desc: 'A mobile disaster-response application with location-based alerts, incident reporting, and shelter information, backed by a TypeScript REST API.',
    tech: ['React Native', 'Expo', 'TypeScript', 'Express', 'Neon PostgreSQL'], url: `${github}/ResQ1`,
    problem: 'Bring emergency updates, incident reports, and shelter information into one mobile experience.',
    features: ['Role-restricted alert publishing, alert history, and acknowledgements.', 'Incident submission, nearby reports, photo evidence, and authority review.', 'Shelter records and evacuation-route endpoints.'],
    architecture: 'Expo Router mobile client with TypeScript Express services and Neon PostgreSQL persistence.',
    limits: 'Source-reviewed functionality; live alert delivery and evacuation routing were not exercised. No operational emergency-service claims are made.',
    sources: [source('ResQ1','frontend/package.json'),source('ResQ1','backend/package.json'),source('ResQ1','backend/src/controllers/alertController.ts'),source('ResQ1','backend/src/services/incidentService.ts'),source('ResQ1','backend/src/services/shelterService.ts')],
  },
  {
    id: 'wildguard', title: 'WildGuard.lk', type: 'Mobile + Web · Conservation', context: 'Project work', categories: ['Mobile','Web'], featured: true,
    desc: 'A wildlife conservation platform with web and mobile clients for patrol workflows, community reporting, and incident management.',
    tech: ['React', 'React Native', 'Expo', 'Express', 'Prisma', 'PostgreSQL', 'Leaflet'], url: `${github}/wildguard-lk`,
    problem: 'Connect ranger field activity and community reports with conservation monitoring workflows.',
    features: ['Patrol assignment, ranger start/completion transitions, and live-location retrieval.', 'Community report submission, report status tracking, and staff review.', 'Evidence upload handling and role-aware access to reports.'],
    architecture: 'React web interface, Expo mobile client, and an Express API using Prisma with PostgreSQL. Leaflet is included for web maps.',
    limits: 'Source-reviewed workflows; field hardware, live monitoring accuracy, and deployment readiness were not tested.',
    sources: [source('wildguard-lk','web/package.json'),source('wildguard-lk','mobile/package.json'),source('wildguard-lk','backend/package.json'),source('wildguard-lk','backend/prisma/schema.prisma'),source('wildguard-lk','backend/src/services/patrol.service.js'),source('wildguard-lk','backend/src/services/communityReport.service.js')],
  },
  {
    id: 'arogya', title: 'Arogya', type: 'Healthcare · Distributed Systems', context: 'Academic project', categories: ['Web'], featured: true,
    desc: 'An academic healthcare platform with separate services for patient and doctor workflows, appointment booking, and preliminary symptom guidance.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs'], url: `${github}/DS_project`,
    problem: 'Coordinate healthcare service workflows through a client application and independently structured backend services.',
    features: ['Doctor schedule management and appointment-slot availability.', 'Patient appointment booking with existing-booking checks.', 'Symptom analysis and history endpoints, with a local data-driven model and optional Gemini fallback.'],
    architecture: 'React client and Express API gateway with separate auth, doctor, patient, appointment, notification, and other service directories. Appointment services use PostgreSQL. Docker Compose and Kubernetes configuration are present.',
    limits: 'Symptom guidance is preliminary, not a diagnosis. Source review does not establish clinical validity or model accuracy. Deployment files do not prove a deployed cluster.',
    sources: [source('DS_project','frontend/package.json'),source('DS_project','gateway/package.json'),source('DS_project','services/appointment-service/controllers/appointmentController.js'),source('DS_project','services/doctor-service/controllers/scheduleController.js'),source('DS_project','services/ai-symptom-service/controllers/aiSymptomController.js'),source('DS_project','services/ai-symptom-service/services/customSymptomModelService.js')],
  },
  {
    id: 'library', title: 'Personal Library Manager', type: 'Full-Stack · Library', context: 'Personal / academic work', categories: ['Web'],
    desc: 'A MERN book-collection application with Google Books search, authenticated personal libraries, reading-status tracking, ratings, and reviews.',
    tech: ['React', 'Tailwind CSS', 'Express', 'MongoDB', 'Mongoose', 'JWT'], url: `${github}/personal-library-manager`,
    problem: 'Help readers find books and organize their own collections and reading progress.',
    features: ['Google Books API search with server-side result normalization.', 'Authenticated, user-scoped book saving, listing, and deletion.', 'Reading status, rating, and review updates with library statistics.'],
    architecture: 'React client with React Router and an Express backend using Mongoose/MongoDB. The README identifies assignment requirements alongside the personal-library use case.',
    limits: 'The supplied deployment URL is not verified as available; no live-demo action is shown. Runtime Google Books access and authentication were not exercised.',
    sources: [source('personal-library-manager','README.md'),source('personal-library-manager','client/package.json'),source('personal-library-manager','package.json'),source('personal-library-manager','server/controllers/bookController.js'),source('personal-library-manager','server/controllers/authController.js')],
  },
  {
    id: 'textile', title: 'Textile Saree Management', type: 'Inventory · Academic Work', context: 'Academic project · repository unavailable', categories: ['Enterprise'],
    desc: 'An academic textile and saree business-records application described by the portfolio owner. Source access is currently unavailable.',
    tech: [], suppliedUrl: `${github}/Textile-Saree`, unavailable: true,
    limits: 'GitHub returned 404 during review. Implementation, dependencies, and technology claims could not be confirmed.',
  },
];
export const internshipProjects = [
  { id:'hrm', title:'3S HRM', type:'Professional · Enterprise HRM', desc:'Contributed to an enterprise human resource management application during the Full Stack Developer internship at Ceylon X Corporation.' },
  { id:'crm', title:'Celcius CRM', type:'Professional · Enterprise CRM', desc:'Contributed to an enterprise customer relationship management application during the Full Stack Developer internship at Ceylon X Corporation.' },
];
export const internshipContributions = [
  'Developed and maintained frontend features and reusable React components.',
  'Integrated REST APIs and supported Node.js/Express backend services and database operations.',
  'Debugged frontend, backend, and API issues while collaborating through Git/GitHub and Agile workflows.',
];
export const filterProjects = category => projects.filter(project => category === 'All' || (category === 'Featured' ? project.featured : project.categories.includes(category)));
