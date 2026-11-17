# NovaWorks Project Manager CRM
**The Infinity Hack '26 — AI Project Manager: Meeting to Execution**

> **Live Deployment:** [https://novaworks-crm-brown.vercel.app](https://novaworks-crm-brown.vercel.app)  
> **Alternate URL:** [https://novaworks-crm-faiq6.vercel.app](https://novaworks-crm-faiq6.vercel.app)  
> **Database:** Hosted PostgreSQL on [Supabase](https://supabase.com) (Region: ap-southeast-2)  
> **AI Engine:** Google Gemini 3.1 Flash Lite (Structured Outputs)

---

## 1. Project Overview

NovaWorks Technologies is a client services software house in Lahore, Pakistan. Instead of manually creating projects and assigning tasks from client planning meetings, NovaWorks CRM provides an automated **Meeting-to-Execution pipeline**:

1. **Transcript Ingestion:** Administrator pastes a client meeting transcript or clicks **"Load Sample Transcript"**.
2. **AI Extraction Engine:** Google Gemini analyzes discussion context, resolves conversational corrections (e.g. revised dates, corrected estimates, re-assigned owners), discards out-of-scope features, and maps tasks directly to the 6 internal developers.
3. **Atomic Database Transaction:** A PostgreSQL function (`insert_transcript_data`) validates and commits all projects and tasks in a single all-or-nothing transaction.
4. **Role-Based Access Control (RBAC):** Backend-enforced queries filter visible projects and tasks strictly based on the authenticated user's role (Admin, Manager, or Developer Agent).

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons | Responsive modern CRM interface with 1-click demo login |
| **Backend / DB** | PostgreSQL 17 on Supabase | Hosted relational database with RLS & PL/pgSQL RPC transactions |
| **Authentication** | Custom PostgreSQL `verify_login` RPC | Pre-seeded bcrypt credentials for 10 demo users (`Demo123!`) |
| **AI Extraction** | Google Gemini 3.1 Flash Lite | High-speed structured JSON output matching exact DB schema |
| **Hosting** | Vercel (Edge Network) | Global deployment with client-side SPA routing (`vercel.json`) |

---

## 3. Predefined Demo Accounts

All accounts use the standard password: **`Demo123!`**  
*(The login page features **1-Click Demo Login** buttons for instant role switching during judging).*

| Role | Name | Email | Permissions & Scope |
|:---|:---|:---|:---|
| **ADMIN** | Admin User | `admin@novaworks.example` | View all projects, all tasks, team directory, paste transcripts, reset demo data |
| **MANAGER** | Ayesha Khan | `ayesha@novaworks.example` | Manages **UrbanCart Website** (only sees her project & its tasks) |
| **MANAGER** | Bilal Ahmed | `bilal@novaworks.example` | Manages **QuickServe Mobile App** (only sees his project & its tasks) |
| **MANAGER** | Hina Tariq | `hina@novaworks.example` | Manages **HelpDeskPro AI Assistant** (only sees her project & its tasks) |
| **AGENT** | Ali Raza | `ali@novaworks.example` | Full-Stack (React) — sees only his 3 assigned tasks across UrbanCart |
| **AGENT** | Hamza Sheikh | `hamza@novaworks.example` | Full-Stack (Node.js) — sees his 2 tasks across UrbanCart & QuickServe |
| **AGENT** | Sara Malik | `sara@novaworks.example` | App Dev (Flutter) — sees only her 2 UI tasks in QuickServe |
| **AGENT** | Usman Ghani | `usman@novaworks.example` | App Dev (Integration) — sees only his integration task in QuickServe |
| **AGENT** | Zain Abbas | `zain@novaworks.example` | AI Developer (LLMs) — sees only his 2 tasks in HelpDeskPro |
| **AGENT** | Maryam Nawaz | `maryam@novaworks.example` | AI Developer (RAG) — sees only her 2 tasks in HelpDeskPro |

---

## 4. Live Judge Walkthrough & Demonstration Steps

### Step 1: Admin Flow & Transcript Processing
1. Navigate to [https://novaworks-crm-brown.vercel.app](https://novaworks-crm-brown.vercel.app).
2. Click **[Login as Admin]**.
3. In the sidebar/nav, click **Create from Transcript** (or **Transcript**).
4. Click **[Load Sample Transcript]** to populate the 60-minute planning meeting.
5. Click **[Create from Transcript]**.
6. The AI processes the text and creates **3 projects** and **12 tasks** atomically.

### Step 2: Role-Based Access Control (RBAC) Verification
1. Log out and click **[Login as Ayesha (Web PM)]**:
   * Navigate to **Projects**.
   * Notice that Ayesha sees **ONLY UrbanCart Website** (4 tasks). QuickServe and HelpDeskPro are inaccessible.
2. Log out and click **[Login as Ali (Agent)]**:
   * Navigate to **My Tasks**.
   * Ali sees **strictly his 3 tasks** (Product catalog UI, Demo cart UI, Website integration and testing).
   * **Crucial Security Check:** Tasks assigned to Hamza, Sara, Usman, Zain, or Maryam are **never visible**.
3. Log out and click **[Login as Hamza (Agent)]**:
   * Hamza sees his 2 backend tasks spanning across **UrbanCart Website** and **QuickServe Mobile App**.

### Step 3: Dynamic AI Proof (Testing Organizer's Surprise Modification)
1. Log back in as **Admin**.
2. Go to **Transcript** and click **[Load Sample Transcript]**.
3. Modify Usman's task in the text:
   * Change estimate to **12 hours** and deadline to **23 October**.
4. Click **[Create from Transcript]**.
5. Log in as **Usman** $\rightarrow$ his task reflects the updated 12 hours and 23 October, proving dynamic AI conversion without hardcoded shortcuts!

---

## 5. Technical Highlights & Organizer Key Compliance

The AI prompt is engineered to handle all conversational nuances tested in the verification key:
* ✅ **UrbanCart Website:** Project deadline set to **20 October** (correctly overwriting the initial 18 October proposal). Ali's integration task set to **19 October** (not 17 October). Total: 40 hours.
* ✅ **QuickServe Mobile App:** Mobile integration estimated at **10 hours** (correctly overwriting the initial 8 hours). Total: 46 hours.
* ✅ **HelpDeskPro AI Assistant:** Evaluation and testing assigned to **Maryam Nawaz** (correctly reassigning from Zain). Total: 38 hours.
* ✅ **Zero Hallucinations:** Ignored client mentions of "Kamran" (not an employee).
* ✅ **Scope Filtering:** Excluded rejected features (no payment gateways, no inventory APIs, no live maps, no ticketing systems).

---

## 6. Local Setup & Run Commands

```bash
# 1. Clone the repository
git clone https://github.com/Faiq-Zulfiqar/ascendants.git
cd ascendants

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env)
cp .env.example .env

# Fill in your keys in .env:
# VITE_SUPABASE_URL=https://zdbahnaoedddseazlcsn.supabase.co
# VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
# VITE_GEMINI_API_KEY=<your_gemini_api_key>

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

## 7. Submission Checklist Summary

- [x] Functional Minimum Viable Product (MVP) running within 3 hours.
- [x] Hosted Database deployed on Supabase (PostgreSQL).
- [x] Live Deployment running on Vercel with HTTPS.
- [x] 10 Pre-seeded demo users with role-based access control.
- [x] AI meeting-to-project automated pipeline.
- [x] Handles revisions, corrections, and non-employee filtering.
- [x] All 6 required screens implemented (Login, Admin, Manager, Agent My Tasks, Project Detail, Team Directory).
- [x] 1-Click Demo Login for judge evaluation.
