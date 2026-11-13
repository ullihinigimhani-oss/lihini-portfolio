# Phase 3 project verification — 13 November 2026

The public project overview was checked against GitHub default-branch trees, dependency manifests, controllers, services, and relevant frontend screens. This is source review, not end-to-end execution of the applications. No deployment, performance, model-accuracy, ownership, or sole-authorship claims are inferred from repository availability.

## Findings

- **ResQ1:** Expo/React Native and TypeScript frontend; TypeScript Express API with Neon dependency. Alert controller implements publisher role checks, history and acknowledgements. Incident service implements persisted reports, photo handling and nearby queries. Shelter service implements persisted shelter records and evacuation-route retrieval. Root README absent.
- **WildGuard.lk:** React/Leaflet web app, Expo/React Native mobile app, Express backend, Prisma schema with PostgreSQL provider. Patrol service has ranger transition and assignment workflows; community-report service supports submissions, staff review, evidence and owner/staff access. Root README is only the repository name, so detailed claims rely on source.
- **Arogya / DS_project:** Root README is only the repository name. React UI, Express gateway and individual service directories. Appointment and doctor controllers implement scheduling and booking workflows backed by PostgreSQL. Symptom controller uses local data-driven analysis, optional Gemini fallback and persisted history. This does not establish clinical validity or model accuracy. Compose and Kubernetes files exist, but no deployed cluster is claimed.
- **Personal Library Manager:** README describes MERN and assignment requirements. Client manifest confirms React, React Router and Tailwind. Backend confirms Express/Mongoose. Book controller implements user-scoped records, reading statuses, reviews, ratings and statistics; search route calls Google Books. Authentication controller supports registration/login. The supplied live URL could not be verified as available (it previously returned Vercel 404 and the current web check could not access it); live demo actions were removed.
- **Textile-Saree:** GitHub returned 404. Card is retained as owner-described academic work, clearly marked unavailable, with no verified-stack badges or fabricated detail view. The supplied URL is labeled unavailable.

## Reproducibility

Reviewed recursive Git tree SHAs (tree objects, not commit IDs):

- ResQ1: e9a4701941611d0169a696477d117ee9c4dea8e0
- wildguard-lk: ca20e90c5d921c4c0aaf950080a7090e4d172e22
- DS_project: 0d68227e9ec0d659bc043b2dc18431d89c1f2778
- personal-library-manager: bcd6e38aed01c2844c4a09d5095c368e349bfc10

The project data file contains the precise reviewed paths and public source links. These links follow HEAD and can change as the projects develop. No files named as screenshots were found in the inspected trees; the previous image-asset review found only artwork/logos. Existing local cover illustrations remain explicitly conceptual.

## Attribution and internship scope

Academic classification for Arogya/Textile comes from the owner's brief. Library Manager is described as personal/academic because its README identifies assignment requirements. Individual work allocation and team ownership for public repositories are not established by source review; no individual role is invented. Details distinguish repository scope from personal contribution.

3S HRM and Celcius CRM appear separately as internship work. The shared contributions come only from the owner's supplied Ceylon X Corporation responsibilities: frontend features, reusable React components, REST API integration, Node/Express support, database operations, debugging, Git/GitHub and Agile collaboration. No private systems were accessed. Previously unsupported per-project MySQL/PostgreSQL claims were removed.

## Separate source hygiene finding

The Library Manager search route contains a hardcoded external API key. Its value is intentionally not copied here. Rotate/restrict it and move configuration to environment variables in that separate project. That repository and the portfolio backend were not modified.
