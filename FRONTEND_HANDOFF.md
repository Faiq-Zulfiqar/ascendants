# Frontend Developer Guide & Backend Handoff

Welcome to the team! This document contains everything you need to know about what has been built, how to connect to the backend, and the exact screens you need to build for **The Infinity Hack '26**.

---

## 1. Quick Project Summary

We are building a lightweight **Project Management CRM** for **NovaWorks Technologies**.
* **Core Flow:** Admin logs in $\rightarrow$ pastes a 60-minute client meeting transcript $\rightarrow$ clicks **"Create from Transcript"** $\rightarrow$ AI extracts projects, tasks, assignees, deadlines, and estimated hours $\rightarrow$ records are automatically saved to Supabase $\rightarrow$ users view their work filtered by their role.
* **Database & AI Status:** **100% COMPLETE & TESTED**. The Supabase database is live, seeded with 10 demo accounts, and the Gemini AI extraction engine matches the organizers' grading key with a 100% score.

---

## 2. Supabase Connection Credentials

We've already created two drop-in files in the root folder that your React app can import directly:
1. `supabaseClient.js` — Auto-detects environment variables across Vite (`import.meta.env`), Next.js, and Create React App (`process.env`), with fallback defaults.
2. `aiService.js` — Provides `parseAndSaveTranscript(transcript)` which calls Gemini and atomically saves to Supabase in one call!

You can also initialize Supabase manually:
```env
# Supported Prefixes in .env:
VITE_SUPABASE_URL=https://zdbahnaoedddseazlcsn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYmFobmFvZWRkZHNlYXpsY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4NTIxNjUsImV4cCI6MjExMDQyODE2NX0.aK1gRaLfYAmPV5-EJQ5bEBU7rBn3XCZdHRbWwmi3--w
```

---

## 3. The 10 Seeded Demo Accounts (Password: `Demo123!`)

No registration/signup is needed. All 10 users already exist in the database with password `Demo123!`.

| Role | Name | Email | Focus / Specialization |
|:---|:---|:---|:---|
| **ADMIN** | Admin User | `admin@novaworks.example` | Can view all projects, all tasks, and paste transcripts |
| **MANAGER** | Ayesha Khan | `ayesha@novaworks.example` | Web Project Manager (UrbanCart) |
| **MANAGER** | Bilal Ahmed | `bilal@novaworks.example` | Mobile Project Manager (QuickServe) |
| **MANAGER** | Hina Tariq | `hina@novaworks.example` | AI Project Manager (HelpDeskPro) |
| **AGENT** | Ali Raza | `ali@novaworks.example` | Full-Stack (React) |
| **AGENT** | Hamza Sheikh | `hamza@novaworks.example` | Full-Stack (Node.js APIs) |
| **AGENT** | Sara Malik | `sara@novaworks.example` | App Developer (Flutter) |
| **AGENT** | Usman Ghani | `usman@novaworks.example` | App Developer (Integration) |
| **AGENT** | Zain Abbas | `zain@novaworks.example` | AI Developer (LLMs) |
| **AGENT** | Maryam Nawaz | `maryam@novaworks.example` | AI Developer (RAG & Testing) |

---

## 4. Screens & Features to Build

### Screen 1: Login Screen (`/login` or `/`)
* **Email & Password form** (calls `verify_login` RPC).
* **⭐ Hackathon Winning Feature — "1-Click Demo Login" Bar:**
  Add quick buttons above or below the form so judges can test roles in 2 seconds:
  * `[Login as Admin]` $\rightarrow$ logs in as `admin@novaworks.example`
  * `[Login as Ayesha (Web PM)]` $\rightarrow$ logs in as `ayesha@novaworks.example`
  * `[Login as Ali (Agent)]` $\rightarrow$ logs in as `ali@novaworks.example`
  * `[Login as Hamza (Agent)]` $\rightarrow$ logs in as `hamza@novaworks.example`
* Store the returned user object (id, name, email, role) in React state / localStorage.

---

### Screen 2: Admin Dashboard (Role: `ADMIN`)
* **Header / Navigation:** Shows current logged-in user name and role, with a `Logout` button and link to `Team Directory`.
* **Transcript Section:**
  * Large textarea with placeholder: `"Paste meeting transcript here..."`
  * Pre-fill button: `[Load Sample Transcript]` (so judges don't have to copy-paste manually!).
  * Action button: `[Create from Transcript]` with a clean spinner/loading state.
  * Reset button: `[Reset Demo Data]` (calls `clear_demo_data` to wipe projects & tasks before a new run).
* **Projects Overview Grid:**
  * Shows all project cards with name, client, manager, deadline, and total hours.
  * Clicking a project opens its task list.

---

### Screen 3: Project Manager View (Role: `MANAGER`)
* When logged in as a Manager (e.g., Ayesha, Bilal, or Hina):
  * **Strict Scope:** They see **only the projects assigned to them**.
  * Project detail card shows: Project Title, Client Name, Deadline, and all tasks assigned under that project.
  * *Note:* Managers do **not** have the transcript input box.

---

### Screen 4: Developer Agent "My Tasks" View (Role: `AGENT`)
* When logged in as an Agent (e.g., Ali, Hamza, Sara, Usman, Zain, Maryam):
  * **Strict Scope:** They see **ONLY their own assigned tasks**.
  * Task cards/table shows:
    * Task Title
    * Parent Project Name & Client
    * Deadline
    * Estimated Hours
  * **CRITICAL JUDGING REQUIREMENT:** Agents must **never** see tasks assigned to other agents.

---

### Screen 5: Read-Only Team Directory (`/team`)
* Simple table or card grid displaying all 10 members:
  * Name, Email, Role badge (`ADMIN`, `MANAGER`, `AGENT`), Specialization, and Skills tags.

---

## 5. Ready-To-Use RPC Queries (Copy-Paste)

All Role-Based Access Control (RBAC) logic is already built and enforced directly on PostgreSQL.

### 1. Authenticate User (Login)
```javascript
const { data, error } = await supabase.rpc('verify_login', {
  p_email: email,
  p_password: password
});

if (data?.success) {
  const currentUser = data.user; 
  // currentUser = { id, name, email, role: 'ADMIN'|'MANAGER'|'AGENT', specialization, skills }
  localStorage.setItem('user', JSON.stringify(currentUser));
} else {
  alert(data?.error || 'Invalid credentials');
}
```

### 2. Fetch Projects for Current User (Auto-filtered by Role)
```javascript
const { data: projects, error } = await supabase.rpc('get_projects_for_user', {
  p_user_id: currentUser.id
});
// If ADMIN   -> returns all 3 projects
// If MANAGER -> returns only projects where manager_id == currentUser.id
// If AGENT   -> returns only projects where they have assigned tasks
```

### 3. Fetch Tasks for Current User (Auto-filtered by Role)
```javascript
const { data: tasks, error } = await supabase.rpc('get_tasks_for_user', {
  p_user_id: currentUser.id,
  p_project_id: null // or pass specific project UUID
});
// If ADMIN   -> returns all tasks
// If MANAGER -> returns all tasks in projects they manage
// If AGENT   -> returns ONLY tasks assigned to this agent
```

### 4. Fetch Team Directory
```javascript
const { data: team, error } = await supabase
  .from('users')
  .select('id, name, email, role, specialization, skills')
  .order('role');
```

### 5. Clear Demo Data (Before Live Demo)
```javascript
const { data, error } = await supabase.rpc('clear_demo_data');
// Resets tasks and projects to 0 so you can demo fresh transcript creation!
```

---

## 6. Calling AI to Parse Transcript & Save to DB

You have an API endpoint or you can call Gemini directly using the already-configured Gemini key.

### Expected AI Output JSON Structure:
The database function `insert_transcript_data` expects this exact shape:
```json
[
  {
    "name": "UrbanCart Website",
    "client_name": "UrbanCart Clothing",
    "description": "Responsive e-commerce site with demo cart",
    "manager_email": "ayesha@novaworks.example",
    "deadline": "2026-10-20",
    "tasks": [
      {
        "title": "Product catalog UI",
        "description": "Product listing and detail view",
        "assignee_email": "ali@novaworks.example",
        "deadline": "2026-10-12",
        "estimated_hours": 12
      }
    ]
  }
]
```

### Saving the Extracted Data:
```javascript
const { data, error } = await supabase.rpc('insert_transcript_data', {
  p_data: extractedProjectsArray
});

// data = { success: true, projects_created: 3, tasks_created: 12 }
```
*Note: This is an **all-or-nothing database transaction**. If any task deadline exceeds the project deadline, or an invalid assignee email is passed, it rolls back automatically.*

---

## 7. What NOT to Build (Save Your Time!)

The rulebook explicitly says you do **NOT** need:
* ❌ No User Signup or Registration
* ❌ No Forgot Password or Email Verification
* ❌ No User Management / Edit User screens
* ❌ No Budget, Cost, or Hourly Billing calculation
* ❌ No Gantt charts, timesheets, or completion percentage bars

Keep the UI clean, modern, responsive, and focused on demonstrating the **Transcript $\rightarrow$ Projects $\rightarrow$ Role Access** flow! Good luck! 🚀
