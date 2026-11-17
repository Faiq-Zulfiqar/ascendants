/**
 * NovaWorks Project Manager CRM - API Client Layer
 * 
 * INTEGRATION MODE (Supabase + Gemini LLM vs. Local Mock):
 * - When VITE_USE_MOCK=false (or when connecting live to Supabase):
 *   This client directly invokes Supabase RPCs:
 *   - verify_login: authenticates with PostgreSQL password hashing
 *   - get_projects_for_user: role-filtered projects (ADMIN, MANAGER, AGENT)
 *   - get_tasks_for_user: role-filtered tasks (Agents see ONLY own tasks)
 *   - insert_transcript_data: atomic database transaction committing AI projects/tasks
 *   - clear_demo_data: resets database for live demos
 *   - aiService.js / parseAndSaveTranscript: direct Gemini 3.1 Flash Lite API call
 * 
 * - When VITE_USE_MOCK=true:
 *   Simulates the exact same contracts in-browser with 1-second realistic latency.
 */

import { supabase, geminiApiKey } from '../supabaseClient.js';
import { parseAndSaveTranscript } from '../aiService.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Global error navigation listener (handles 401 redirect & 403 forbidden)
let onUnauthorizedCallback = null;
let onForbiddenCallback = null;

export function setApiErrorHandlers({ onUnauthorized, onForbidden }) {
  onUnauthorizedCallback = onUnauthorized;
  onForbiddenCallback = onForbidden;
}

// ============================================================================
// DEMO ACCOUNTS (Matches live Supabase seed data 1-to-1)
// ============================================================================
export const DEMO_USERS = [
  // 1 ADMIN
  {
    id: 'b6da09d4-76d7-42ca-9a8d-d8f5f6a23e43',
    email: 'admin@novaworks.example',
    name: 'Admin User',
    role: 'ADMIN',
    specialization: 'System Administrator',
    skills: ['Administration', 'System Management', 'Architecture', 'AI Integration'],
  },
  // 3 MANAGERS
  {
    id: 'f87e6fa3-37cb-4b24-9b5a-4b95349e5d44',
    email: 'ayesha@novaworks.example',
    name: 'Ayesha Khan',
    role: 'MANAGER',
    specialization: 'Web Project Manager (UrbanCart)',
    skills: ['Web PM', 'Scrum', 'Client Delivery', 'React Architecture'],
  },
  {
    id: 'a12c45d6-78e9-40f1-b2a3-c4d5e6f7a8b9',
    email: 'bilal@novaworks.example',
    name: 'Bilal Ahmed',
    role: 'MANAGER',
    specialization: 'Mobile Project Manager (QuickServe)',
    skills: ['Mobile PM', 'Flutter', 'iOS & Android', 'Sprint Management'],
  },
  {
    id: 'c34e56f7-89a0-41b2-c3d4-e5f6a7b8c9d0',
    email: 'hina@novaworks.example',
    name: 'Hina Tariq',
    role: 'MANAGER',
    specialization: 'AI Project Manager (HelpDeskPro)',
    skills: ['AI PM', 'RAG Systems', 'LLM Workflows', 'Testing Strategy'],
  },
  // 6 AGENTS (Specialist Developers)
  {
    id: 'fd4107f6-d518-4e2b-8ad0-2ef82404d387',
    email: 'ali@novaworks.example',
    name: 'Ali Raza',
    role: 'AGENT',
    specialization: 'Full-Stack (React)',
    skills: ['React', 'Frontend UI', 'State Management', 'Tailwind CSS'],
  },
  {
    id: 'e56f78a9-01b2-42c3-d4e5-f6a7b8c9d0e1',
    email: 'hamza@novaworks.example',
    name: 'Hamza Sheikh',
    role: 'AGENT',
    specialization: 'Full-Stack (Node.js APIs)',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'RESTful APIs'],
  },
  {
    id: 'b78a90b1-23c4-43d5-e6f7-a8b9c0d1e2f3',
    email: 'sara@novaworks.example',
    name: 'Sara Malik',
    role: 'AGENT',
    specialization: 'App Developer (Flutter UI)',
    skills: ['Flutter', 'Dart', 'Mobile UI', 'Responsive Design'],
  },
  {
    id: 'd90b12c3-45d6-44e7-f8a9-b0c1d2e3f4a5',
    email: 'usman@novaworks.example',
    name: 'Usman Ghani',
    role: 'AGENT',
    specialization: 'App Developer (Integration)',
    skills: ['Integration Testing', 'Mobile APIs', 'CI/CD Pipelines'],
  },
  {
    id: 'f12c34d5-67e8-45f9-a0b1-c2d3e4f5a6b7',
    email: 'zain@novaworks.example',
    name: 'Zain Abbas',
    role: 'AGENT',
    specialization: 'AI Developer (LLMs)',
    skills: ['Gemini API', 'Prompt Engineering', 'LangChain', 'Python'],
  },
  {
    id: 'a34d56e7-89f0-46a1-b2c3-d4e5f6a7b8c9',
    email: 'maryam@novaworks.example',
    name: 'Maryam Nawaz',
    role: 'AGENT',
    specialization: 'AI Developer (RAG & Testing)',
    skills: ['RAG Pipeline', 'Vector DB', 'QA Automation', 'Playwright'],
  },
];

// Local storage session helpers
function getStoredCurrentUser() {
  try {
    const raw = localStorage.getItem('novaworks_current_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setStoredCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem('novaworks_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('novaworks_current_user');
    }
  } catch (e) {
    console.error('Failed to persist current user', e);
  }
}

// Delay helper for mock
const delay = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// API CLIENT
// ============================================================================
export const api = {
  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();

    // LIVE SUPABASE RPC LOGIN
    if (!USE_MOCK && supabase) {
      const { data, error } = await supabase.rpc('verify_login', {
        p_email: cleanEmail,
        p_password: password,
      });

      if (error) {
        throw new Error(error.message || 'Login verification failed');
      }

      if (!data?.success || !data?.user) {
        const err = new Error(data?.error || 'Invalid email or password');
        err.status = 401;
        throw err;
      }

      setStoredCurrentUser(data.user);
      return { user: data.user };
    }

    // MOCK MODE FALLBACK
    await delay(700);
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user || password !== 'Demo123!') {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }
    setStoredCurrentUser(user);
    return { user };
  },

  async logout() {
    setStoredCurrentUser(null);
    return { success: true };
  },

  async getMe() {
    const user = getStoredCurrentUser();
    if (!user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }
    return { user };
  },

  // --------------------------------------------------------------------------
  // TEAM DIRECTORY
  // --------------------------------------------------------------------------
  async getUsers() {
    if (!USE_MOCK && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, specialization, skills')
        .order('role');

      if (error) throw new Error(error.message);
      return { users: data || [] };
    }

    await delay(400);
    return { users: DEMO_USERS };
  },

  // --------------------------------------------------------------------------
  // PROJECTS (Auto-filtered by Role in Supabase PostgreSQL)
  // --------------------------------------------------------------------------
  async getProjects() {
    const user = getStoredCurrentUser();
    if (!user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }

    // LIVE SUPABASE RPC
    if (!USE_MOCK && supabase) {
      const { data, error } = await supabase.rpc('get_projects_for_user', {
        p_user_id: user.id,
      });

      if (error) throw new Error(error.message);

      const projects = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        client: p.client_name || p.client || 'Client',
        managerId: p.manager_id,
        managerName: p.manager_name || 'Assigned Manager',
        deadline: p.deadline,
        description: p.description || '',
        taskCount: p.task_count !== undefined ? Number(p.task_count) : 0,
        totalHours: p.total_hours !== undefined ? Number(p.total_hours) : 0,
      }));

      return { projects };
    }

    // MOCK MODE
    await delay(500);
    return {
      projects: [
        {
          id: 'proj-001',
          name: 'UrbanCart Website',
          client: 'UrbanCart Clothing',
          managerId: 'f87e6fa3-37cb-4b24-9b5a-4b95349e5d44',
          managerName: 'Ayesha Khan',
          deadline: '2026-10-20',
          description: 'Responsive e-commerce site with demo product catalog and cart.',
          taskCount: 4,
        },
        {
          id: 'proj-002',
          name: 'QuickServe Mobile App',
          client: 'QuickServe Services',
          managerId: 'a12c45d6-78e9-40f1-b2a3-c4d5e6f7a8b9',
          managerName: 'Bilal Ahmed',
          deadline: '2026-10-24',
          description: 'On-demand home services mobile booking app in Flutter.',
          taskCount: 4,
        },
        {
          id: 'proj-003',
          name: 'HelpDeskPro AI Assistant',
          client: 'HelpDeskPro Solutions',
          managerId: 'c34e56f7-89a0-41b2-c3d4-e5f6a7b8c9d0',
          managerName: 'Hina Tariq',
          deadline: '2026-10-22',
          description: 'Customer support AI bot with automated RAG document retrieval.',
          taskCount: 4,
        },
      ],
    };
  },

  async getProjectById(id) {
    const user = getStoredCurrentUser();
    if (!user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }

    // LIVE SUPABASE RPC
    if (!USE_MOCK && supabase) {
      // 1. Check if user has permission to see this project via get_projects_for_user
      const { data: userProjects, error: projErr } = await supabase.rpc('get_projects_for_user', {
        p_user_id: user.id,
      });

      if (projErr) throw new Error(projErr.message);

      const targetProj = (userProjects || []).find((p) => p.id === id);

      if (!targetProj) {
        // Check if project exists in database at all to differentiate 403 vs 404
        const { data: rawExists } = await supabase.from('projects').select('id').eq('id', id).maybeSingle();
        if (rawExists) {
          const err = new Error('Access denied: You do not have permission to view this project');
          err.status = 403;
          throw err;
        }
        const err = new Error('Project not found');
        err.status = 404;
        throw err;
      }

      // 2. Fetch tasks for this project (auto-filtered by role in Supabase)
      const { data: userTasks, error: taskErr } = await supabase.rpc('get_tasks_for_user', {
        p_user_id: user.id,
        p_project_id: id,
      });

      if (taskErr) throw new Error(taskErr.message);

      const mappedTasks = (userTasks || []).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        assignedAgentId: t.assigned_to,
        assignedAgentName: t.assignee_name || 'Assigned Agent',
        deadline: t.deadline,
        estimatedHours: t.estimated_hours,
      }));

      return {
        project: {
          id: targetProj.id,
          name: targetProj.name,
          client: targetProj.client_name || targetProj.client,
          managerId: targetProj.manager_id,
          managerName: targetProj.manager_name,
          deadline: targetProj.deadline,
          description: targetProj.description,
          tasks: mappedTasks,
        },
      };
    }

    // MOCK MODE
    await delay(500);
    const mockProjects = await this.getProjects();
    const proj = mockProjects.projects.find((p) => p.id === id);
    if (!proj) {
      const err = new Error('Project not found');
      err.status = 404;
      throw err;
    }

    return {
      project: {
        ...proj,
        tasks: [
          {
            id: 't-1',
            title: 'Core Architecture & Specification',
            description: 'Define models and REST interface contracts.',
            assignedAgentId: 'fd4107f6-d518-4e2b-8ad0-2ef82404d387',
            assignedAgentName: 'Ali Raza',
            deadline: proj.deadline,
            estimatedHours: 16,
          },
        ],
      },
    };
  },

  // --------------------------------------------------------------------------
  // AGENT MY-TASKS (Strictly Agent-only view in Supabase)
  // --------------------------------------------------------------------------
  async getMyTasks() {
    const user = getStoredCurrentUser();
    if (!user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }

    if (user.role !== 'AGENT') {
      const err = new Error('Forbidden: My Tasks is reserved for Agent users');
      err.status = 403;
      throw err;
    }

    // LIVE SUPABASE RPC
    if (!USE_MOCK && supabase) {
      const { data, error } = await supabase.rpc('get_tasks_for_user', {
        p_user_id: user.id,
        p_project_id: null,
      });

      if (error) throw new Error(error.message);

      const tasks = (data || []).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        assignedAgentId: t.assigned_to,
        assignedAgentName: t.assignee_name,
        deadline: t.deadline,
        estimatedHours: t.estimated_hours,
        projectId: t.project_id,
        projectName: t.project_name,
        projectClient: t.client_name,
        projectManagerName: t.manager_name,
      }));

      return { tasks };
    }

    // MOCK MODE
    await delay(500);
    return {
      tasks: [
        {
          id: 'task-101',
          title: 'Product catalog UI',
          description: 'Product listing and detail view with responsive grid.',
          deadline: '2026-10-12',
          estimatedHours: 12,
          projectId: 'proj-001',
          projectName: 'UrbanCart Website',
          projectClient: 'UrbanCart Clothing',
          projectManagerName: 'Ayesha Khan',
        },
        {
          id: 'task-102',
          title: 'Demo cart UI',
          description: 'Client-side cart calculation and item quantity management.',
          deadline: '2026-10-15',
          estimatedHours: 8,
          projectId: 'proj-001',
          projectName: 'UrbanCart Website',
          projectClient: 'UrbanCart Clothing',
          projectManagerName: 'Ayesha Khan',
        },
        {
          id: 'task-104',
          title: 'Website integration and testing',
          description: 'End-to-end integration and responsiveness audit across viewports.',
          deadline: '2026-10-19',
          estimatedHours: 6,
          projectId: 'proj-001',
          projectName: 'UrbanCart Website',
          projectClient: 'UrbanCart Clothing',
          projectManagerName: 'Ayesha Khan',
        },
      ],
    };
  },

  // --------------------------------------------------------------------------
  // TRANSCRIPT CREATION & VALIDATION CORRECTION (Gemini LLM + Supabase)
  // --------------------------------------------------------------------------
  async createFromTranscript(transcript) {
    const user = getStoredCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      const err = new Error('Forbidden: Only Administrators can create projects from transcripts');
      err.status = 403;
      throw err;
    }

    const text = (transcript || '').trim();
    if (!text) {
      const err = new Error('Transcript text cannot be empty');
      err.status = 400;
      throw err;
    }

    // Check if user entered "ERROR" to test the 422 correction form
    if (/ERROR|FAIL|INVALID/i.test(text)) {
      const err = new Error('AI extraction generated a draft with ambiguities requiring manual review');
      err.status = 422;
      err.errors = [
        {
          projectIndex: 0,
          taskIndex: null,
          field: 'managerId',
          message: 'Project manager was not identified in the transcript. Please assign a manager.',
        },
        {
          projectIndex: 0,
          taskIndex: 1,
          field: 'assignedAgentId',
          message: 'Task assignee could not be resolved from meeting notes. Please select an agent.',
        },
        {
          projectIndex: 0,
          taskIndex: 1,
          field: 'estimatedHours',
          message: 'Estimated hours must be a positive number greater than 0.',
        },
        {
          projectIndex: 0,
          taskIndex: 2,
          field: 'deadline',
          message: 'Task deadline (2026-12-25) cannot be after the project deadline (2026-10-20).',
        },
      ];
      err.draft = {
        projects: [
          {
            name: 'Enterprise Cloud Migration & Data Warehouse',
            client: 'Packages Mall Retail Consortium, Lahore',
            managerId: '', // Invalid empty manager
            deadline: '2026-10-20',
            description: 'Migrating legacy retail databases to cloud with real-time stream ingestion.',
            tasks: [
              {
                id: 'draft-task-1',
                title: 'Schema Migration Script Generation',
                description: 'Convert legacy SQL stored procedures to PL/pgSQL routines.',
                assignedAgentId: 'fd4107f6-d518-4e2b-8ad0-2ef82404d387', // Ali Raza
                deadline: '2026-10-12',
                estimatedHours: 20,
              },
              {
                id: 'draft-task-2',
                title: 'Data Ingestion Kafka Pipeline',
                description: 'Build change-data-capture pipeline streaming inventory updates.',
                assignedAgentId: '', // Invalid empty assignee
                deadline: '2026-10-15',
                estimatedHours: 0, // Invalid 0 hours
              },
              {
                id: 'draft-task-3',
                title: 'Performance & Latency Benchmark Tests',
                description: 'Execute stress testing under simulated concurrent checkout requests.',
                assignedAgentId: 'a34d56e7-89f0-46a1-b2c3-d4e5f6a7b8c9', // Maryam Nawaz
                deadline: '2026-12-25', // Invalid: after project deadline (2026-10-20)
                estimatedHours: 16,
              },
            ],
          },
        ],
      };
      throw err;
    }

    // LIVE GEMINI AI EXTRACTION + SUPABASE TRANSACTION
    if (!USE_MOCK && supabase) {
      const res = await parseAndSaveTranscript(text);
      if (!res.success) {
        throw new Error(res.error || 'Gemini LLM extraction failed');
      }

      const projects = (res.data || []).map((p) => ({
        name: p.name,
        client: p.client_name,
        managerName: p.manager_email,
        deadline: p.deadline,
        tasks: p.tasks,
      }));

      return {
        success: true,
        projects,
        taskCount: res.tasks_created || 0,
        message: `Created ${res.projects_created || projects.length} projects with ${res.tasks_created || 0} tasks`,
      };
    }

    // MOCK MODE
    await delay(1200);
    return {
      success: true,
      projects: [
        {
          name: 'UrbanCart Website',
          client: 'UrbanCart Clothing',
          managerName: 'Ayesha Khan',
          tasks: [{}, {}, {}, {}],
        },
        {
          name: 'QuickServe Mobile App',
          client: 'QuickServe Services',
          managerName: 'Bilal Ahmed',
          tasks: [{}, {}, {}, {}],
        },
        {
          name: 'HelpDeskPro AI Assistant',
          client: 'HelpDeskPro Solutions',
          managerName: 'Hina Tariq',
          tasks: [{}, {}, {}, {}],
        },
      ],
      taskCount: 12,
      message: 'Created 3 projects with 12 tasks',
    };
  },

  async correctDraft(draft) {
    const user = getStoredCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      const err = new Error('Forbidden: Only Administrators can save drafts');
      err.status = 403;
      throw err;
    }

    const errors = [];
    const projects = (draft && draft.projects) || [];

    projects.forEach((proj, pIdx) => {
      if (!proj.name?.trim()) errors.push({ projectIndex: pIdx, taskIndex: null, field: 'name', message: 'Project name is required' });
      if (!proj.client?.trim()) errors.push({ projectIndex: pIdx, taskIndex: null, field: 'client', message: 'Client name is required' });
      if (!proj.managerId) errors.push({ projectIndex: pIdx, taskIndex: null, field: 'managerId', message: 'Please select a Project Manager' });
      if (!proj.deadline) errors.push({ projectIndex: pIdx, taskIndex: null, field: 'deadline', message: 'Project deadline is required' });

      (proj.tasks || []).forEach((t, tIdx) => {
        if (!t.title?.trim()) errors.push({ projectIndex: pIdx, taskIndex: tIdx, field: 'title', message: 'Task title is required' });
        if (!t.assignedAgentId) errors.push({ projectIndex: pIdx, taskIndex: tIdx, field: 'assignedAgentId', message: 'Please select an assigned Agent' });
        if (!t.deadline) errors.push({ projectIndex: pIdx, taskIndex: tIdx, field: 'deadline', message: 'Task deadline is required' });
        else if (proj.deadline && t.deadline > proj.deadline) {
          errors.push({ projectIndex: pIdx, taskIndex: tIdx, field: 'deadline', message: `Task deadline (${t.deadline}) cannot be after project deadline (${proj.deadline})` });
        }
        if (!t.estimatedHours || Number(t.estimatedHours) <= 0) {
          errors.push({ projectIndex: pIdx, taskIndex: tIdx, field: 'estimatedHours', message: 'Estimated hours must be greater than zero' });
        }
      });
    });

    if (errors.length > 0) {
      const err = new Error('Draft contains validation errors');
      err.status = 422;
      err.errors = errors;
      err.draft = draft;
      throw err;
    }

    // LIVE SUPABASE ATOMIC TRANSACTION
    if (!USE_MOCK && supabase) {
      // Fetch directory to resolve IDs to emails for insert_transcript_data RPC
      const { data: allUsers } = await supabase.from('users').select('id, email, name');
      const userMap = new Map((allUsers || []).map((u) => [u.id, u]));

      const payload = projects.map((p) => {
        const mgr = userMap.get(p.managerId);
        return {
          name: p.name.trim(),
          client_name: p.client.trim(),
          description: p.description || '',
          manager_email: mgr ? mgr.email : 'ayesha@novaworks.example',
          deadline: p.deadline,
          tasks: (p.tasks || []).map((t) => {
            const ag = userMap.get(t.assignedAgentId);
            return {
              title: t.title.trim(),
              description: t.description || '',
              assignee_email: ag ? ag.email : 'ali@novaworks.example',
              deadline: t.deadline,
              estimated_hours: Number(t.estimatedHours),
            };
          }),
        };
      });

      const { data: dbResult, error: dbError } = await supabase.rpc('insert_transcript_data', {
        p_data: payload,
      });

      if (dbError) throw new Error(dbError.message);

      return {
        success: true,
        projects: projects.map((p) => ({ ...p, managerName: userMap.get(p.managerId)?.name || 'Manager' })),
        taskCount: dbResult?.tasks_created || 0,
        message: `Successfully validated and committed ${dbResult?.projects_created || projects.length} project(s) to Supabase`,
      };
    }

    // MOCK MODE
    await delay(800);
    const totalTasks = projects.reduce((acc, p) => acc + (p.tasks || []).length, 0);
    return {
      success: true,
      projects,
      taskCount: totalTasks,
      message: `Successfully validated and created ${projects.length} project(s) with ${totalTasks} task(s)`,
    };
  },

  // --------------------------------------------------------------------------
  // CLEAR DEMO DATA (Resets Supabase tasks & projects for a clean demo)
  // --------------------------------------------------------------------------
  async clearDemoData() {
    if (!USE_MOCK && supabase) {
      const { data, error } = await supabase.rpc('clear_demo_data');
      if (error) throw new Error(error.message);
      return data;
    }
    return { success: true, message: 'Demo data cleared' };
  },
};
