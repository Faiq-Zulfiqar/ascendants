import { supabase, geminiApiKey } from './supabaseClient.js';

const TEAM_DIRECTORY = `
Available Managers (Only assign projects to these managers):
- Ayesha Khan (email: ayesha@novaworks.example) - Role: MANAGER / Web PM
- Bilal Ahmed (email: bilal@novaworks.example) - Role: MANAGER / Mobile PM
- Hina Tariq (email: hina@novaworks.example) - Role: MANAGER / AI PM

Available Developers / Agents (Only assign tasks to these agents):
- Ali Raza (email: ali@novaworks.example) - Role: AGENT / Full-Stack (React)
- Hamza Sheikh (email: hamza@novaworks.example) - Role: AGENT / Full-Stack (Node.js APIs)
- Sara Malik (email: sara@novaworks.example) - Role: AGENT / App Developer (Flutter UI)
- Usman Ghani (email: usman@novaworks.example) - Role: AGENT / App Developer (Integration & Testing)
- Zain Abbas (email: zain@novaworks.example) - Role: AGENT / AI Developer (LLMs & Generation)
- Maryam Nawaz (email: maryam@novaworks.example) - Role: AGENT / AI Developer (RAG, Docs & Testing)

IMPORTANT: Kamran or any other non-team members mentioned in discussion are NOT employees. Never assign anything to them or add them.
`;

const SYSTEM_PROMPT = `You are the Lead Technical Project Manager at NovaWorks Technologies.
Your job is to analyze meeting transcripts and extract agreed projects and tasks.

Rules:
1. Extract ONLY the final agreed projects and tasks.
2. Incorporate all corrections and revisions made during discussion (e.g. if an initial estimate or date was proposed but later revised or agreed to be different, use the FINAL agreed value).
3. Ignore rejected, out-of-scope, or future features (e.g. no payment gateways, no stock inventory, no live maps, no external ticketing, etc.).
4. Assign every project to one of the 3 available Managers by their exact email.
5. Assign every task to one of the 6 available Developer Agents by their exact email.
6. Deadlines must be in 'YYYY-MM-DD' format (assumed year is 2026).
7. Every task deadline MUST be less than or equal to its parent project deadline.
8. estimated_hours must be a positive numeric value representing effort.

${TEAM_DIRECTORY}

You MUST return a valid JSON array of projects matching this exact JSON schema:
[
  {
    "name": "Project Name",
    "client_name": "Client Name",
    "description": "Project scope description",
    "manager_email": "manager@novaworks.example",
    "deadline": "YYYY-MM-DD",
    "tasks": [
      {
        "title": "Task Title",
        "description": "Task scope description",
        "assignee_email": "agent@novaworks.example",
        "deadline": "YYYY-MM-DD",
        "estimated_hours": 12
      }
    ]
  }
]`;

/**
 * Parses a meeting transcript using Gemini and saves the result atomically into Supabase.
 * @param {string} transcript - The raw text transcript of the meeting.
 * @returns {Promise<{success: boolean, projects_created?: number, tasks_created?: number, error?: string}>}
 */
export async function parseAndSaveTranscript(transcript) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: `${SYSTEM_PROMPT}\n\nTRANSCRIPT TO PROCESS:\n${transcript}` }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      throw new Error('Gemini returned an empty response.');
    }

    const projectsArray = JSON.parse(rawJsonText);

    // Call Supabase atomic transaction RPC
    const { data: dbResult, error: dbError } = await supabase.rpc('insert_transcript_data', {
      p_data: projectsArray
    });

    if (dbError) {
      throw new Error(dbError.message);
    }

    return {
      success: true,
      projects_created: dbResult.projects_created,
      tasks_created: dbResult.tasks_created,
      data: projectsArray
    };
  } catch (error) {
    console.error('Failed to parse and save transcript:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred.'
    };
  }
}
