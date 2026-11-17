import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmationPanel from '../components/ConfirmationPanel';
import RoleBadge from '../components/RoleBadge';
import {
  Sparkles,
  RotateCcw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Building2,
  Plus,
  Trash,
  Info,
  FileText,
  AlertCircle,
  Database,
  RefreshCw,
} from 'lucide-react';

// Official 60-minute client meeting transcript from hackathon specification
const OFFICIAL_HACKATHON_TRANSCRIPT = `Meeting: NovaWorks Client Delivery Planning
Date: 7 October 2026 | Scheduled duration: 60 minutes
Participants: Ayesha, Bilal, Hina, Ali, Hamza, Sara, Usman, Zain, Maryam

09:00-09:04 | Opening and company workflow
Ayesha: Good morning. We have three client engagements to plan today: UrbanCart Clothing's website, QuickServe's customer mobile app, and HelpDeskPro's AI support assistant. Please keep these as three separate projects. A combined project would make client reporting confusing.
Bilal: We should finish with a project manager, deadline, task owner, and estimated hours for every piece of work. The estimate is effort, not the number of days between today and the delivery date.
Hina: Agreed. Please use our supplied team directory. Accounts can already be created with a setup script. We are not hiring anyone for this delivery cycle. Record developer work only in the estimated hours. We do not need management-hour estimates.
Ayesha: Keep this version simple. We need project details, assigned people, deadlines, and estimated hours. Cost calculation and progress monitoring are outside this challenge.

09:04-09:08 | UrbanCart project scope
Ayesha: First project is UrbanCart Website, for client UrbanCart Clothing. I'll manage it. They need a responsive website where customers can browse products, view product details, and add items to a demo cart. We initially discussed 18 October as the delivery date.
Ali: Do they need a real checkout, payment gateway, and stock integration?
Ayesha: No. For this phase the cart is a demo. Real payments and inventory integration are not included. The client wants to review the buying experience before funding those integrations.
Hamza: So the API scope is product data and a basic cart endpoint, without payment processing?
Ayesha: Correct. Don't add a payment task or an inventory task. The description should make the demo scope clear.

09:08-09:12 | UrbanCart frontend assignment
Ali: I can own the product catalog interface: product listing, a product detail screen, and responsive layout. Put that down as 12 estimated hours, due on 12 October.
Ayesha: Please call that task Product catalog UI. We also need the demo cart interface as a separate task so we can track it separately.
Ali: Yes. Demo cart UI will take 8 hours, due 15 October. That covers adding and removing items, quantities, and a visible total. I am the owner of both frontend tasks.
Bilal: Are these two separate tasks rather than a single 20-hour frontend task?
Ayesha: Exactly. Two tasks, same owner, with the deadlines we just agreed. We need that separation in the task list.

09:12-09:16 | UrbanCart backend and delivery correction
Hamza: For Product and cart APIs, I estimate 14 hours. I own it, and the deadline is 14 October. I will provide product responses and the demo cart endpoints Ali needs.
Ayesha: Good. After that, Ali owns Website integration and testing. Let's start with a six-hour estimate and a 17 October deadline.
Ali: Six hours is reasonable for connecting the screens and checking the demo flow. But please move that task to 19 October. I need a little more calendar space after the API work.
Ayesha: Accepted. Website integration and testing is 6 hours, due 19 October. Also, the client has just confirmed that final project delivery can be 20 October. That replaces the earlier 18 October date. The final UrbanCart project deadline is 20 October.
Hamza: So the final website plan has four tasks, and the new deadline is 20 October. No payment gateway in this phase.
Ayesha: Correct.

09:16-09:20 | QuickServe scope and manager
Bilal: The second project is QuickServe Mobile App, for client QuickServe Services. I am the project manager. The client needs a customer app for signing in, requesting a service, and seeing the request's current status.
Sara: Android only for the demonstration, or do we need separate native apps?
Bilal: A Flutter app demo is enough. We don't need separate Android and iOS development tasks. The project deadline is 24 October.
Usman: What about live maps, driver tracking, and payments?
Bilal: Exclude them. This version is customer login, service booking, and booking status. Those other features may be future work, but they must not appear as tasks in the current project.

09:20-09:24 | QuickServe screen work
Sara: I'll own Login and profile screens. That is 8 hours, due 12 October. It includes the customer login interface and a basic profile screen.
Bilal: Please keep that as one task. We don't need to split every field into its own task.
Sara: The second task is Service booking screens. I'll own that too. I estimate 12 hours, due 17 October. The customer selects a service, enters the request details, and sees a confirmation screen.
Hina: So Sara has two tasks, and both are mobile UI work. The API work is separate.
Bilal: Right. The transcript shouldn't turn these into generic web frontend tasks. This project is the mobile app.

09:24-09:28 | QuickServe API assignment
Hamza: I can build Booking and account APIs for the app. The endpoint scope is basic customer account handling, service requests, and request status. Put me as the owner.
Bilal: What's the effort estimate and delivery date?
Hamza: 16 hours, due 16 October. That's separate from the 14-hour UrbanCart API task. Please don't merge those just because I own both.
Usman: I need those responses for mobile integration, but we can use sample responses while Hamza works.
Bilal: Good. This is still one API task under QuickServe. There is no new shared platform project.

09:28-09:32 | QuickServe integration estimate correction
Usman: I will own Mobile integration and testing. Initially I would put it at 8 hours, due 22 October.
Sara: Can that cover the booking status screen, error states, and testing login through booking? Eight sounds a little tight.
Usman: You're right. Make the final estimate 10 hours. Keep the task deadline at 22 October. I will connect the mobile UI to the API, display request status, and test the whole customer flow.
Bilal: Final agreement: Mobile integration and testing, Usman, 10 hours, 22 October. QuickServe still delivers on 24 October. Don't keep the earlier eight-hour estimate.
Ayesha: That's four tasks for QuickServe as well. We are not adding maps or payment tasks.

09:32-09:36 | HelpDeskPro scope and manager
Hina: Third project is HelpDeskPro AI Assistant, for client HelpDeskPro Solutions. I am managing it. They want a support assistant that answers questions from a supplied FAQ document and passes unresolved questions to a human team.
Zain: Does the assistant need to send emails or connect to a real ticketing service?
Hina: No external message sending is required. Human escalation can be a saved record in the demo. We are building a support proof of concept, not integrating their full support system.
Maryam: We should keep an explicit boundary that the assistant uses the FAQ content instead of guessing unsupported answers.
Hina: Agreed. The project deadline is 22 October. We will test it with some questions that aren't in the document too.

09:36-09:40 | HelpDeskPro document work
Maryam: I'll own FAQ document processing. It should prepare the supplied FAQ so the assistant can retrieve relevant content. I estimate 10 hours, due 13 October.
Hina: Please make the task description clear: prepare and retrieve from the FAQ. Don't make a separate task for every FAQ topic.
Zain: I can then own Assistant answer generation. I'll use the prepared content, connect the model, and handle the response structure.
Hina: Give us the estimate and date for that task.
Zain: 14 hours, due 17 October. If the FAQ doesn't support an answer, the assistant should say it cannot resolve the question rather than inventing a response.

09:40-09:44 | HelpDeskPro escalation
Zain: The next task is Human escalation flow. I can own it as well: save unresolved questions so they can be reviewed by a person. The estimate is 6 hours, due 18 October.
Bilal: Are you assigning those escalated questions to another employee now?
Hina: No, not as new project tasks from this planning meeting. The feature is a saved escalation record in the client's demo. Keep our development task assigned to Zain.
Ayesha: The distinction matters. Discussion of end users should not create employees in our own company directory.
Hina: Exactly. Also, the client mentioned someone called Kamran who may supply a document later. Kamran is not a NovaWorks employee. Do not add him to our team or assign development work to him.

09:44-09:48 | HelpDeskPro testing owner correction
Hina: For Assistant evaluation and testing, I was initially considering Zain as the owner. We need to test FAQ answers, unsupported questions, and the escalation path.
Maryam: I can own that instead. It would be better if someone other than the answer-generation developer checks the results.
Hina: Agreed. Replace the earlier suggestion: Maryam is the final owner of Assistant evaluation and testing.
Maryam: Put the estimate at 8 hours, due 21 October. I'll include normal questions and missing-answer cases. That is separate from my ten-hour FAQ document task.
Hina: Confirmed: Maryam, 8 hours, 21 October. Final HelpDeskPro deadline stays 22 October.

09:48-09:52 | Simple accounts and team setup
Bilal: Please don't spend time building a registration flow. We can use one administrator account, our three manager accounts, and the six developer accounts.
Ayesha: The team names and specializations can be hardcoded or loaded from a setup script. The script may create those users with demo passwords. People should be able to log in using the supplied credentials.
Hina: Agreed. We do not need signup, forgot password, email verification, or a screen for creating and editing users. This is a hackathon demonstration with fictional accounts.
Sara: We still need the existing people available to the AI so it assigns the right names.
Bilal: Exactly. The directory is input to the AI. Projects and tasks should come from the meeting rather than requiring someone to enter all twelve tasks manually.

09:52-09:56 | CRM creation flow
Ayesha: The administrator pastes this transcript inside the CRM and clicks Create from Transcript. A valid result should automatically save all three projects and their tasks.
Hina: If a required person or date cannot be resolved, show a clear message and let the administrator correct it. Do not invent an employee. For this meeting, the final recap supplies all the required information.
Bilal: After creation, show project cards and a project detail screen. Each task needs its owner, deadline, description, and estimated hours. A manager can open their projects; a developer can open their assigned task list.
Usman: Do we need charts, completion percentages, timesheets, or budgets?
Ayesha: No. No cost calculation or progress monitoring. Simple login, project lists, task lists, and transcript automation are enough. Saved projects and tasks should remain after a refresh.

09:56-10:00 | Final recap
Ayesha: Final recap: UrbanCart Website, client UrbanCart Clothing, manager Ayesha, deadline 20 October. Ali owns Product catalog UI: 12 hours, 12 October. Ali owns Demo cart UI: 8 hours, 15 October. Hamza owns Product and cart APIs: 14 hours, 14 October. Ali owns Website integration and testing: 6 hours, 19 October.
Bilal: QuickServe Mobile App, client QuickServe Services, manager Bilal, deadline 24 October. Sara owns Login and profile screens: 8 hours, 12 October. Sara owns Service booking screens: 12 hours, 17 October. Hamza owns Booking and account APIs: 16 hours, 16 October. Usman owns Mobile integration and testing: 10 hours, 22 October.
Hina: HelpDeskPro AI Assistant, client HelpDeskPro Solutions, manager Hina, deadline 22 October. Maryam owns FAQ document processing: 10 hours, 13 October. Zain owns Assistant answer generation: 14 hours, 17 October. Zain owns Human escalation flow: 6 hours, 18 October. Maryam owns Assistant evaluation and testing: 8 hours, 21 October.
Ayesha: Those are the final decisions. Keep the rejected features out. The company already has its nine employees. Create three projects with twelve tasks, then show them in the CRM. That's all for this meeting.`;

const SAMPLE_ERROR_TRANSCRIPT = `Meeting Transcript: Legacy Cloud Migration Planning [ERROR_TRIGGER]
Location: Lahore Tech Hub
Attendees: Unknown Caller, Engineering Reps

Speaker 1:
"We had an urgent discussion about migrating the Packages Mall retail database to AWS. The project deadline is October 20, 2026. However, we forgot to assign an official Project Manager from the directory today.
Ali Raza will generate the SQL schema conversion scripts by October 12 for 20 hours.
Someone needs to build the Kafka change data capture pipeline by October 15, but we haven't selected which developer will take this, and estimated hours were marked as zero in the rough notes.
Finally, Maryam Nawaz agreed to do latency benchmarking, but she tentatively asked for December 25, 2026, which is two months after the project deadline!"`;

export default function TranscriptCreate() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [emptyError, setEmptyError] = useState('');
  const [genericError, setGenericError] = useState(null);
  
  // Success state
  const [successData, setSuccessData] = useState(null);

  // 422 Validation state & editable draft
  const [validationErrors, setValidationErrors] = useState([]);
  const [draft, setDraft] = useState(null);

  // Team directory data for dropdowns (managers & agents)
  const [teamMembers, setTeamMembers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Load directory for draft dropdowns
    api.getUsers().then((res) => {
      const users = res.users || [];
      setTeamMembers(users);
      setManagers(users.filter((u) => u.role === 'MANAGER'));
      setAgents(users.filter((u) => u.role === 'AGENT'));
    }).catch((err) => {
      console.error('Failed to load team members for dropdowns', err);
    });
  }, []);

  // Textarea handlers
  const handleClear = () => {
    setTranscript('');
    setEmptyError('');
    setGenericError(null);
  };

  const handleCreate = async () => {
    setEmptyError('');
    setGenericError(null);
    setValidationErrors([]);
    setDraft(null);

    const cleanText = transcript.trim();
    if (!cleanText) {
      setEmptyError('Please paste or enter a meeting transcript before submitting.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.createFromTranscript(cleanText);
      setSuccessData(res);
    } catch (err) {
      if (err.status === 422 && err.draft) {
        setValidationErrors(err.errors || []);
        setDraft(err.draft);
      } else {
        setGenericError(err.message || 'An unexpected error occurred while processing the transcript.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Revalidate & Save draft handler
  const handleRevalidateAndSave = async () => {
    if (!draft) return;
    setGenericError(null);

    try {
      setRevalidating(true);
      const res = await api.correctDraft(draft);
      setDraft(null);
      setValidationErrors([]);
      setSuccessData(res);
    } catch (err) {
      if (err.status === 422) {
        setValidationErrors(err.errors || []);
        if (err.draft) setDraft(err.draft);
      } else {
        setGenericError(err.message || 'Failed to revalidate draft');
      }
    } finally {
      setRevalidating(false);
    }
  };

  // Reset form to process another transcript
  const handleReset = () => {
    setTranscript('');
    setSuccessData(null);
    setDraft(null);
    setValidationErrors([]);
    setGenericError(null);
    setEmptyError('');
  };

  // Clear demo data from Supabase
  const handleClearDemoData = async () => {
    if (!window.confirm('Reset all demo projects and tasks in Supabase? This will clear existing projects so you can demo fresh transcript ingestion.')) {
      return;
    }
    try {
      setResetting(true);
      await api.clearDemoData();
      alert('Database cleared! Existing projects and tasks have been reset.');
      handleReset();
    } catch (err) {
      alert(`Failed to clear database: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  // Draft update helpers
  const updateProjectField = (pIdx, field, value) => {
    setDraft((prev) => {
      const projects = [...prev.projects];
      projects[pIdx] = { ...projects[pIdx], [field]: value };
      return { ...prev, projects };
    });
  };

  const updateTaskField = (pIdx, tIdx, field, value) => {
    setDraft((prev) => {
      const projects = [...prev.projects];
      const tasks = [...projects[pIdx].tasks];
      tasks[tIdx] = { ...tasks[tIdx], [field]: value };
      projects[pIdx] = { ...projects[pIdx], tasks };
      return { ...prev, projects };
    });
  };

  const addTaskToDraft = (pIdx) => {
    setDraft((prev) => {
      const projects = [...prev.projects];
      const projectDeadline = projects[pIdx].deadline || '';
      const newTask = {
        id: `draft-task-${Date.now()}`,
        title: '',
        description: '',
        assignedAgentId: '',
        deadline: projectDeadline,
        estimatedHours: 8,
      };
      projects[pIdx] = {
        ...projects[pIdx],
        tasks: [...(projects[pIdx].tasks || []), newTask],
      };
      return { ...prev, projects };
    });
  };

  const removeTaskFromDraft = (pIdx, tIdx) => {
    setDraft((prev) => {
      const projects = [...prev.projects];
      const tasks = projects[pIdx].tasks.filter((_, i) => i !== tIdx);
      projects[pIdx] = { ...projects[pIdx], tasks };
      return { ...prev, projects };
    });
  };

  const getFieldError = (pIdx, tIdx, field) => {
    return validationErrors.find(
      (e) => e.projectIndex === pIdx && e.taskIndex === tIdx && e.field === field
    )?.message;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link to="/admin" className="hover:text-indigo-600">Admin</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Create from Transcript</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Create Projects from Transcript</span>
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-3xl leading-relaxed">
              Paste raw meeting notes, client briefing transcripts, or project kick-off records.
              NovaWorks AI backend uses <strong>Gemini 3.1 Flash Lite</strong> to parse agreed action items and saves them atomically into <strong>Supabase</strong>.
            </p>
          </div>

          {/* Quick sample fillers & Reset Database */}
          {!draft && !successData && (
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTranscript(OFFICIAL_HACKATHON_TRANSCRIPT);
                  setEmptyError('');
                  setGenericError(null);
                }}
                className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition font-bold flex items-center gap-1.5 shadow-xs"
                title="Loads the official 60-minute NovaWorks planning meeting transcript"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Load Official Transcript</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTranscript(SAMPLE_ERROR_TRANSCRIPT);
                  setEmptyError('');
                  setGenericError(null);
                }}
                className="text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 transition font-medium flex items-center gap-1"
                title="Inserts transcript with 'ERROR' to test HTTP 422 Needs Attention panel"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Test 422 Correction</span>
              </button>

              <button
                type="button"
                onClick={handleClearDemoData}
                disabled={resetting}
                className="text-xs px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition font-medium flex items-center gap-1"
                title="Clears all projects and tasks in Supabase for a clean demo"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>Reset Supabase Data</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Panel (if confirmed saved) */}
      {successData && (
        <ConfirmationPanel
          title={successData.message || 'Created Projects Successfully'}
          projects={successData.projects || []}
          taskCount={successData.taskCount || 0}
          onReset={handleReset}
        />
      )}

      {/* Generic Error Alert */}
      {genericError && (
        <ErrorAlert
          title="Transcript Processing Error"
          message={genericError}
          onRetry={draft ? handleRevalidateAndSave : handleCreate}
        />
      )}

      {/* ==================================================================== */}
      {/* 422 VALIDATION "NEEDS YOUR ATTENTION" PANEL & CORRECTION FORM */}
      {/* ==================================================================== */}
      {draft && (
        <div className="space-y-6 animate-fade-in" id="correction-form">
          {/* Needs your attention banner */}
          <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-amber-950">
                  Needs your attention ({validationErrors.length} {validationErrors.length === 1 ? 'issue' : 'issues'} found)
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed">
                  The AI extracted the draft below, but requires manual confirmation for ambiguous dates or unassigned team members.
                  Please resolve the highlighted fields and submit to confirm creation.
                </p>

                {/* Plain language issues list */}
                {validationErrors.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-xs text-amber-900 bg-white/70 p-3 rounded-xl border border-amber-200">
                    {validationErrors.map((err, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>
                          <strong>
                            Project {err.projectIndex + 1}
                            {err.taskIndex !== null && err.taskIndex !== undefined ? `, Task ${err.taskIndex + 1}` : ''}:
                          </strong>{' '}
                          {err.message}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Editable Draft Form */}
          <div className="space-y-6">
            {(draft.projects || []).map((project, pIdx) => {
              return (
                <div
                  key={project.id || pIdx}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                      Draft Project #{pIdx + 1}
                    </span>
                    <span className="text-xs text-slate-400">
                      {(project.tasks || []).length} tasks extracted
                    </span>
                  </div>

                  {/* Project Details Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                        Project Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={project.name || ''}
                        onChange={(e) => updateProjectField(pIdx, 'name', e.target.value)}
                        className={`w-full text-sm rounded-xl px-3.5 py-2.5 border focus:ring-2 focus:outline-none transition ${
                          getFieldError(pIdx, null, 'name')
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-indigo-600'
                        }`}
                        placeholder="e.g. UrbanCart Website"
                      />
                      {getFieldError(pIdx, null, 'name') && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{getFieldError(pIdx, null, 'name')}</span>
                        </p>
                      )}
                    </div>

                    {/* Client Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                        Client Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={project.client || ''}
                        onChange={(e) => updateProjectField(pIdx, 'client', e.target.value)}
                        className={`w-full text-sm rounded-xl px-3.5 py-2.5 border focus:ring-2 focus:outline-none transition ${
                          getFieldError(pIdx, null, 'client')
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-indigo-600'
                        }`}
                        placeholder="e.g. UrbanCart Clothing"
                      />
                      {getFieldError(pIdx, null, 'client') && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{getFieldError(pIdx, null, 'client')}</span>
                        </p>
                      )}
                    </div>

                    {/* Manager Dropdown */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                        Project Manager <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={project.managerId || ''}
                        onChange={(e) => updateProjectField(pIdx, 'managerId', e.target.value)}
                        className={`w-full text-sm rounded-xl px-3.5 py-2.5 border focus:ring-2 focus:outline-none transition bg-white ${
                          getFieldError(pIdx, null, 'managerId')
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-indigo-600'
                        }`}
                      >
                        <option value="">-- Select Project Manager --</option>
                        {managers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.email})
                          </option>
                        ))}
                      </select>
                      {getFieldError(pIdx, null, 'managerId') && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{getFieldError(pIdx, null, 'managerId')}</span>
                        </p>
                      )}
                    </div>

                    {/* Project Deadline Date Picker */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                        Project Target Deadline <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={project.deadline || ''}
                        onChange={(e) => updateProjectField(pIdx, 'deadline', e.target.value)}
                        className={`w-full text-sm rounded-xl px-3.5 py-2.5 border focus:ring-2 focus:outline-none transition ${
                          getFieldError(pIdx, null, 'deadline')
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-indigo-600'
                        }`}
                      />
                      {getFieldError(pIdx, null, 'deadline') && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{getFieldError(pIdx, null, 'deadline')}</span>
                        </p>
                      )}
                    </div>

                    {/* Project Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                        Project Overview
                      </label>
                      <textarea
                        rows={2}
                        value={project.description || ''}
                        onChange={(e) => updateProjectField(pIdx, 'description', e.target.value)}
                        className="w-full text-sm rounded-xl px-3.5 py-2 border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                        placeholder="Brief summary of client requirements..."
                      />
                    </div>
                  </div>

                  {/* Tasks Section for this Project */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Tasks for this Project ({project.tasks?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={() => addTaskToDraft(pIdx)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(project.tasks || []).map((task, tIdx) => {
                        const isTaskDeadlineAfterProject =
                          project.deadline && task.deadline && task.deadline > project.deadline;
                        const assigneeError = getFieldError(pIdx, tIdx, 'assignedAgentId');
                        const hoursError = getFieldError(pIdx, tIdx, 'estimatedHours');
                        const deadlineError = getFieldError(pIdx, tIdx, 'deadline');
                        const titleError = getFieldError(pIdx, tIdx, 'title');

                        return (
                          <div
                            key={task.id || tIdx}
                            className={`p-4 rounded-xl border transition ${
                              assigneeError || hoursError || deadlineError || titleError || isTaskDeadlineAfterProject
                                ? 'border-amber-300 bg-amber-50/30'
                                : 'border-slate-200 bg-slate-50/40'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold text-slate-700">
                                Task {tIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeTaskFromDraft(pIdx, tIdx)}
                                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 p-1 hover:bg-rose-50 rounded"
                                title="Remove task"
                              >
                                <Trash className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {/* Task Title */}
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                                  Task Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={task.title || ''}
                                  onChange={(e) => updateTaskField(pIdx, tIdx, 'title', e.target.value)}
                                  placeholder="e.g. Product catalog UI"
                                  className={`w-full text-xs rounded-lg px-3 py-2 border bg-white focus:outline-none focus:ring-2 ${
                                    titleError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:ring-indigo-600'
                                  }`}
                                />
                                {titleError && (
                                  <p className="text-[11px] text-rose-600 mt-1">{titleError}</p>
                                )}
                              </div>

                              {/* Assignee Dropdown (Agents Only) */}
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                                  Assignee (Agent) <span className="text-rose-500">*</span>
                                </label>
                                <select
                                  value={task.assignedAgentId || ''}
                                  onChange={(e) => updateTaskField(pIdx, tIdx, 'assignedAgentId', e.target.value)}
                                  className={`w-full text-xs rounded-lg px-2.5 py-2 border bg-white focus:outline-none focus:ring-2 ${
                                    assigneeError ? 'border-rose-400 bg-rose-50/50 ring-rose-200' : 'border-slate-300 focus:ring-indigo-600'
                                  }`}
                                >
                                  <option value="">-- Select Agent --</option>
                                  {agents.map((ag) => (
                                    <option key={ag.id} value={ag.id}>
                                      {ag.name} ({ag.specialization?.split(' ')?.[0] || 'Dev'})
                                    </option>
                                  ))}
                                </select>
                                {assigneeError && (
                                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{assigneeError}</p>
                                )}
                              </div>

                              {/* Estimated Hours */}
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                                  Est. Hours <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={task.estimatedHours ?? ''}
                                  onChange={(e) => updateTaskField(pIdx, tIdx, 'estimatedHours', e.target.value)}
                                  placeholder="Hours"
                                  className={`w-full text-xs rounded-lg px-3 py-2 border bg-white focus:outline-none focus:ring-2 ${
                                    hoursError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:ring-indigo-600'
                                  }`}
                                />
                                {hoursError && (
                                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{hoursError}</p>
                                )}
                              </div>

                              {/* Task Deadline */}
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                                  Deadline <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="date"
                                  value={task.deadline || ''}
                                  onChange={(e) => updateTaskField(pIdx, tIdx, 'deadline', e.target.value)}
                                  className={`w-full text-xs rounded-lg px-2.5 py-2 border bg-white focus:outline-none focus:ring-2 ${
                                    deadlineError || isTaskDeadlineAfterProject
                                      ? 'border-amber-400 bg-amber-50/50'
                                      : 'border-slate-300 focus:ring-indigo-600'
                                  }`}
                                />
                                {deadlineError && (
                                  <p className="text-[11px] text-rose-600 mt-1">{deadlineError}</p>
                                )}
                                {isTaskDeadlineAfterProject && !deadlineError && (
                                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                                    <Info className="w-3 h-3" />
                                    <span>Hint: Task deadline is after project deadline ({project.deadline})</span>
                                  </p>
                                )}
                              </div>

                              {/* Task Description */}
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                                  Description / Technical Brief
                                </label>
                                <input
                                  type="text"
                                  value={task.description || ''}
                                  onChange={(e) => updateTaskField(pIdx, tIdx, 'description', e.target.value)}
                                  placeholder="Specific requirements, endpoints, or acceptance criteria..."
                                  className="w-full text-xs rounded-lg px-3 py-2 border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <strong className="text-slate-800">Note:</strong> Nothing is committed or saved until the backend confirms validation.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                disabled={revalidating}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                Discard & Start Over
              </button>
              <button
                type="button"
                onClick={handleRevalidateAndSave}
                disabled={revalidating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {revalidating ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Revalidating & Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Revalidate and Save to Supabase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* INITIAL TRANSCRIPT TEXTAREA INPUT FORM */}
      {/* ==================================================================== */}
      {!draft && !successData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="transcript" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Meeting Transcript <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {transcript.length} characters • {transcript.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Large textarea: min 15 rows */}
            <div className="relative">
              <textarea
                id="transcript"
                name="transcript"
                rows={15}
                disabled={loading}
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  if (emptyError) setEmptyError('');
                }}
                placeholder="Paste the meeting discussion, audio transcription, or client sprint notes here...

Example:
Ayesha: 'Good morning. We have three client engagements to plan today: UrbanCart Clothing website...'"
                className={`w-full font-mono text-xs sm:text-sm p-4 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition leading-relaxed ${
                  emptyError
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-600 focus:border-indigo-600'
                } disabled:bg-slate-100 disabled:cursor-not-allowed`}
              />
            </div>

            {/* Inline message blocking empty input */}
            {emptyError && (
              <div className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5 animate-fade-in" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{emptyError}</span>
              </div>
            )}
          </div>

          {/* Form Action Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || transcript.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
              <span>Clear Textarea</span>
            </button>

            {/* Submit Button & Spinner with Loading Text */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3">
              {loading && (
                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-indigo-700 animate-pulse">
                  <span>AI is reading the meeting and creating projects…</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>AI is reading the meeting and creating projects…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Create from Transcript</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
