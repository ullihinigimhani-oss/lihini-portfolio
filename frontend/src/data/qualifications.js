export const skillCategories = [
  { title:'Programming Languages', icon:'code', groups:[
    {level:'Internship',items:['JavaScript','SQL']},
    {level:'Academic / project',items:['Java']},
    {level:'Foundational / familiarity',items:['Python','C#','Kotlin','PHP']},
  ]},
  { title:'Frontend Development', icon:'web', groups:[
    {level:'Internship',items:['React.js','HTML5','CSS3','Bootstrap','Responsive UI','Vite']},
    {level:'Academic / project',items:['JSP']},
    {level:'Foundational / familiarity',items:['Next.js']},
  ]},
  { title:'Backend Development', icon:'server', groups:[
    {level:'Internship',items:['Node.js','Express.js','REST APIs']},
    {level:'Foundational / familiarity',items:['Spring Boot','ASP.NET Core','Java Servlets']},
  ]},
  { title:'Mobile Development', icon:'mobile', groups:[
    {level:'Academic / project',items:['React Native','Expo']},
    {level:'Foundational / familiarity',items:['Flutter','Android (Kotlin)']},
  ]},
  { title:'Databases', icon:'database', groups:[
    {level:'Internship',items:['MySQL','PostgreSQL','Relational database operations']},
    {level:'Academic / project',items:['MongoDB']},
    {level:'Foundational / familiarity',items:['Firebase','Supabase']},
  ]},
  { title:'Cloud & DevOps', icon:'cloud', groups:[
    {level:'Internship',items:['Git','GitHub']},
    {level:'Academic / project configuration',items:['Docker','Kubernetes']},
    {level:'Foundational / training',items:['AWS','CI/CD']},
  ]},
  { title:'Development Tools', icon:'tools', groups:[
    {level:'Internship',items:['Postman','Browser developer tools']},
    {level:'Foundational / familiarity',items:['VS Code','Visual Studio','Figma']},
  ]},
];

const aws = 'AWS Training & Certification';
const uom = 'University of Moratuwa · CODL';
export const certificateIssuers = [aws,uom];
export const certificates = [
  {title:'AWS Cloud Practitioner Essentials',file:'AWS_cloud.pdf',issuer:aws,date:'2025-12-11',dateKind:'Completed'},
  {title:'AWS Lambda Foundations',file:'AWS_lambda_foundations.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'Amazon API Gateway for Serverless Applications',file:'Amazon_API_Gateway_for_serverless_application.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'Designing Event-Driven Architectures',file:'designing_event_driven.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'AWS Cloud Development Kit (CDK) Getting Started',file:'AWS_CDK.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'Amazon EventBridge Getting Started',file:'Amazon_EventBridge.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'Amazon Simple Notification Service (SNS) Getting Started',file:'Amazon_Simple_Notification.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'AWS AppSync Getting Started',file:'AWS_AppSync_Getting.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'Amazon Q Developer Getting Started',file:'AWS_Q_developer.pdf',issuer:aws,date:'2025-12-12',dateKind:'Completed'},
  {title:'Python for Beginners',file:'Python_for_Beginners_E-Certificate.pdf',issuer:uom,date:'2023-02-28',dateKind:'Issued'},
  {title:'Web Design for Beginners',file:'Web_Design_for_Beginners_E-Certificate.pdf',issuer:uom,date:null,dateKind:null},
];
export const visibleCertificates = expanded => expanded ? certificates : certificates.filter((_,index)=>index<4 || index>=9);
export const formatCertificateDate = date => new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${date}T00:00:00Z`));
export const experience = {
  company:'Ceylon X Corporation',role:'Full Stack Developer Intern',start:'2026-01',end:'2026-07',arrangement:'Remote',
  contributions:[
    'Developed and maintained reusable React components and integrated REST APIs for enterprise HRM and CRM workflows.',
    'Supported Node.js/Express functionality and relational database operations; debugged UI, API, and application issues.',
    'Collaborated with the development team through Agile workflows, Git, and GitHub.',
  ],
};
export const education = {
  institution:'Sri Lanka Institute of Information Technology (SLIIT)',
  degree:'BSc (Hons) in Information Technology',specialization:'Specializing in Software Engineering',
  start:'2023-10',end:'2027-12',status:'Undergraduate',
};
