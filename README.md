## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

More details :

---

Important Clarification : we will write React using JavaScript and not TypeScript inside our Next.js project.

---

Folders description :

app/... → routing folder (Pages, layouts, route groups)
-favicon : website icon
-lobal.css : css of the whole website (tailwind css)
-page.js : main page of the project (landing page)
app/api/... → All backend API routes
db/ → MySQL connection + queries
lib/ → Auth, validation, utilities
components/ → Reusable UI components
public/ => for images, icons ...
.gitignore : file to be ignored by git (includes .env file)
eslint : file (extension) that help us find errors

project/
│
├── app/
│ ├── api/
│ │ ├── auth/
│ │ │ ├── register/route.js
│ │ │ ├── login/route.js
│ │ │
│ │ ├── users/
│ │ │ ├── route.js # GET all users (admin), POST create user
│ │ │ ├── [id]/route.js # GET/PUT/DELETE specific user
│ │ │
│ │ ├── applicants/
│ │ │ ├── route.js # Create applicant profile (POST), GET all profiles (admin)
│ │ │ ├── [id]/route.js # GET/PUT profile of a single applicant
│ │ │
│ │ ├── employers/
│ │ │ ├── route.js # Create employer profile, GET all companies
│ │ │ ├── [id]/route.js # GET/PUT employer profile
│ │ │
│ │ ├── jobs/
│ │ │ ├── route.js # GET jobs + filters, POST job (employer)
│ │ │ ├── [id]/route.js # GET job, PUT job, DELETE job
│ │ │
│ │ ├── applications/
│ │ │ ├── route.js # POST: apply to job
│ │ │ ├── [id]/route.js # GET: applications for job or applicant
│ │ │
│ │ ├── bookmarks/
│ │ │ ├── route.js # POST: save job
│ │ │ ├── [id]/route.js # GET bookmarks of user
│ │
│ ├── dashboard/
│ │ ├── page.js # Admin dashboard (optional)
│ │
│ ├── jobs/
│ │ ├── page.js # Public job listing UI
│ │
│ ├── profile/
│ │ ├── page.js # Applicant profile frontend
│ │
│ ├── companies/
│ │ ├── page.js # Employer profile frontend
│ │
│ ├── layout.js
│ └── page.js # Landing page
│
├── db/
│ ├── connection.js # MySQL connection pool
│ ├── queries/ # each file in this folder contains query helpers, CRUD operations according to the task
│ │ ├── userQueries.js
│ │ ├── authQueries.js  
│ │ ├── applicantQueries.js
│ │ ├── employerQueries.js
│ │ ├── jobQueries.js
│ │ ├── applicationQueries.js
│ │ └── bookmarkQueries.js
│
├── lib/
│ ├── auth.js # JWT helpers (sign/verify)
│ ├── middleware.js # Auth middleware for routes
│ ├── validators.js # Zod validation for all schemas
│ ├── upload.js # File upload helpers (CV, photos)
│ └── utils.js
│
├── components/
│ ├── Navbar.js
│ ├── JobCard.js
│ ├── CompanyCard.js
│ ├── ApplicationCard.js
│ ├── ProfileForm.js
│ ├── JobForm.js
│ ├── InputField.js
│ └── SelectField.js
│
├── public/
│ ├── uploads/ # User photos, CVs
│
├── package.json
├── next.config.mjs
└── README.md

---

Important Notes (according to your task)
!! => You STILL keep everything under /app, but you organize logically:

Pages under -> app/
API routes under -> app/api/...
Database client and helper functions under -> /lib
UI Components under -> /components

---

while coding :

naming :
Use descriptive variable and function names.
Prefer single responsibility per function.
File & Folder Naming
Folders: lowercase, plural (users, jobs, applications).
Files: lowercase, camelCase (ex: jobComponent)

database :
All date fields should use DATETIME DEFAULT CURRENT_TIMESTAMP.
Use foreign keys with ON DELETE CASCADE for relational integrity.
Error Handling
Always return a status code and JSON message: { "status": "error", "message": "Description here" }

Passwords & Security:
Hash passwords using bcryptjs before storing in DB.
Never return passwords in API responses.
Use JWT or sessions for authentication (optional for MVP).

Comments:
explain logic in non-obvious areas.

---
Database Tables 

users
id, name, email, password, role (applicant/employer/admin), created_at

applicants
id, user_id, photo_url, skills, education, experience, cv_url

employers
id, user_id, company_name, logo_url, website, industry, location, description

jobs
id, employer_id, title, description, requirements, salary, type, paid, location, created_at

applications
id, job_id, applicant_id, cv_url, cover_letter, status

bookmarks
id, user_id, job_id