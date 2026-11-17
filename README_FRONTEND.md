# NovaWorks Project Manager CRM

A modern, responsive, role-based project management CRM frontend built for **NovaWorks Technologies** (Lahore, Pakistan). 

In this CRM, an administrator pastes meeting transcripts or sprint debriefs, and an AI backend extracts structured projects, assigns project managers, generates work breakdown tasks, assigns engineering specialists, and establishes deadlines.

---

## 🚀 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **React Router v6**
- **Lucide React** (icons)
- Fully responsive design: mobile (360px viewport), tablet, and desktop
- Light, clean, accessible design with neutral backgrounds and an indigo accent (`#4f46e5`)

---

## 👥 Roles & Authorization

The CRM enforces three primary roles directly fed by `GET /api/auth/me`:

| Role | Permissions & Visible Routes | Post-Login Redirect |
| :--- | :--- | :--- |
| **`ADMIN`** | Full access: Executive Dashboard (`/admin`), Projects (`/projects`), Transcript AI Importer (`/admin/transcript`), Team Directory (`/team`), Project Details (`/projects/:id`) | `/admin` |
| **`MANAGER`** | Projects under management (`/projects`), Team Directory (`/team`), Project Details for managed projects (`/projects/:id`) | `/projects` |
| **`AGENT`** | Assigned Tasks (`/my-tasks`), Team Directory (`/team`), Project Details (filtered to own tasks) (`/projects/:id`) | `/my-tasks` |

- **Security & Global Interceptors**: Unauthorized access (401) immediately redirects to `/login`. Forbidden access (403) and 404 display dedicated accessible denial/error pages.
- **Data Filtering**: The frontend renders data provided by the API; mock mode replicates strict backend data isolation for all three roles.

---

## 🔑 Demo Accounts (Mock Mode)

In development and demo mode (`VITE_USE_MOCK=true`), 10 realistic NovaWorks Lahore employee accounts are pre-configured.

**Default Password for all accounts:** `Demo123!`

### 1. Administrator
- `admin@novaworks.example` — **Zeeshan Arshad** (Head of Engineering & Delivery)

### 2. Project Managers
- `ayesha@novaworks.example` — **Ayesha Khan** (Lead PM: HealthTech & Cloud)
- `bilal@novaworks.example` — **Bilal Ahmed** (Senior Technical PM: FinTech & Banking)
- `hina@novaworks.example` — **Hina Malik** (Enterprise Delivery PM: Retail & Logistics)

### 3. Engineering Agents (Specialists)
- `ali@novaworks.example` — **Ali Raza** (Senior Full Stack Engineer)
- `hamza@novaworks.example` — **Hamza Shah** (Backend Architect)
- `sara@novaworks.example` — **Sara Noor** (Frontend Specialist)
- `usman@novaworks.example` — **Usman Tariq** (Cloud & DevOps Engineer)
- `zain@novaworks.example` — **Zain Abbas** (Mobile & React Native Engineer)
- `maryam@novaworks.example` — **Maryam Asif** (QA & Automation Specialist)

*(The login screen includes a collapsible demo accounts tray with 1-click auto-fill buttons).*

---

## 📱 Key Screens & Features

1. **Login (`/login`)**:
   - Clean centered card with show/hide password toggle.
   - Comprehensive error handling for invalid credentials.
   - Collapsible Demo Accounts selector with 1-click credential filling.
   - Immediate role-based routing upon successful authentication.

2. **Admin Executive Home (`/admin`)**:
   - Summary statistics (Active Projects, Allocated Tasks, Lahore Team count).
   - Prominent "Create from Transcript" button.
   - Responsive project card grid with client, manager, deadline formatted as "20 Oct 2026", and task counts.

3. **Create from Transcript (`/admin/transcript`)**:
   - 15+ row transcript textarea with real-time character counter and clear button.
   - Loading indicator ("AI is reading the meeting and creating projects…") with double-submit prevention.
   - Success panel displaying project summary list and "View projects" action.
   - Generic error alert with retry button.
   - **HTTP 422 Unprocessable Entity Handling**:
     - Triggered automatically in mock mode when transcript contains `"ERROR"`.
     - Displays "Needs your attention" panel with clear plain-language issue descriptions.
     - Interactive correction form allowing edits to project name, client, manager dropdown, deadline picker, and per-task fields (assignee, positive estimated hours, task deadline).
     - Task deadline client-side validation hint (ensuring task deadline does not exceed project deadline).
     - "Revalidate and Save" button calling `POST /api/transcript/correct`.

4. **Projects Directory (`/projects`)**:
   - Dynamic heading based on role ("All Projects" for Admin, "My Projects" for Manager).
   - Real-time search filter (searches across project name, client, manager, description).
   - Sorting by earliest deadline, furthest deadline, or project name.

5. **Project Detail (`/projects/:id`)**:
   - Project overview, client badge, assigned manager, deadline, and full description.
   - Interactive task table (Title, Description, Assigned Agent, Deadline, Estimated Hours).
   - Responsive design: automatically transforms into stacked mobile cards on small screens (`< 768px`).
   - Role-scoped task visibility for agents.

6. **My Tasks (`/my-tasks`)**:
   - Reserved for Agent users.
   - Work items grouped by project with project details and direct links.
   - Workload calculator showing total committed sprint hours.

7. **Team Directory (`/team`)**:
   - Read-only directory fetching from `GET /api/users`.
   - Displays avatar initials, role badge, specialization, and skill chips.
   - Search filter and role filter tabs (All / Admin / Manager / Agent).
   - Fully sanitizes user records (passwords/hashes are never exposed).

8. **Security & Error Pages**:
   - Dedicated 403 Forbidden page (`/forbidden`) and 404 Not Found page (`*`).

---

## 🛠️ Project Structure

```
novaworks-crm/
├── public/
│   └── favicon.svg
├── src/
│   ├── api.js                   # Unified API client (real HTTP fetch + full mock mode)
│   ├── App.jsx                  # Main router and role route guards
│   ├── main.jsx                 # Entry point with BrowserRouter
│   ├── index.css                # Tailwind CSS base and utility directives
│   ├── context/
│   │   ├── AuthContext.jsx      # Backend-driven auth state & role helpers
│   │   └── ToastContext.jsx     # Toast notification system
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky responsive navbar + mobile hamburger drawer
│   │   ├── ProtectedRoute.jsx   # Role-based route guard
│   │   ├── ProjectCard.jsx      # Reusable project card with formatted deadlines
│   │   ├── TaskTable.jsx        # Desktop table with responsive mobile card fallback
│   │   ├── TaskCard.jsx         # Mobile stacked task card
│   │   ├── RoleBadge.jsx        # Badges for ADMIN, MANAGER, AGENT
│   │   ├── ConfirmationPanel.jsx# AI creation & validation summary panel
│   │   ├── EmptyState.jsx       # Empty states with illustrations and CTA
│   │   ├── ErrorAlert.jsx       # Alert banner with retry support
│   │   ├── FormField.jsx        # Accessible input container with error states
│   │   ├── Skeleton.jsx         # Loading skeleton placeholders
│   │   └── Spinner.jsx          # Accessible SVG loading spinners
│   ├── pages/
│   │   ├── Login.jsx            # Sign in with collapsible demo accounts
│   │   ├── AdminHome.jsx        # Admin executive dashboard
│   │   ├── TranscriptCreate.jsx # AI transcript importer & 422 correction form
│   │   ├── ProjectsList.jsx     # Searchable & sortable project list
│   │   ├── ProjectDetail.jsx    # Project overview + task breakdown
│   │   ├── MyTasks.jsx          # Agent tasks grouped by project
│   │   ├── TeamDirectory.jsx    # Read-only searchable team directory
│   │   ├── Forbidden.jsx        # Access Denied (403) page
│   │   └── NotFound.jsx         # 404 page
│   └── utils/
│       └── date.js              # Date formatters (e.g. "20 Oct 2026")
├── .env.example
├── .env
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or yarn

### Quick Start

1. **Clone or navigate into the project directory:**
   ```bash
   cd novaworks-crm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(By default, `VITE_USE_MOCK=true` is enabled for demo and testing without an external backend).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔌 Connecting to a Real Backend

To switch from Mock Mode to your live AI backend:

1. Update `.env`:
   ```ini
   VITE_API_URL=https://api.novaworks.example
   VITE_USE_MOCK=false
   ```
2. The frontend uses standard fetch wrappers configured with `credentials: "include"` and `Content-Type: application/json`.
3. Backend contracts supported:
   - `POST /api/auth/login` `{ email, password }`
   - `POST /api/auth/logout`
   - `GET /api/auth/me` -> `{ user: { id, email, name, role } }`
   - `GET /api/users` -> `{ users: [...] }`
   - `GET /api/projects` -> `{ projects: [...] }`
   - `GET /api/projects/:id` -> `{ project: { ..., tasks: [...] } }`
   - `GET /api/my-tasks` -> `{ tasks: [...] }`
   - `POST /api/transcript/create` `{ transcript }` -> `200 { projects, taskCount }` or `422 { errors, draft }`
   - `POST /api/transcript/correct` `{ draft }` -> `200 { projects, taskCount }` or `422 { errors, draft }`
