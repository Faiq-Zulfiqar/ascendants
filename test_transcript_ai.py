import os
import json
import urllib.request
import urllib.error

# Read .env from C:\hackathon\.env
def load_env(env_path=r"C:\hackathon\.env"):
    config = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    config[k.strip()] = v.strip()
    return config

ENV = load_env()
GEMINI_KEY = ENV.get("GEMINI_API_KEY")
SUPABASE_URL = ENV.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = ENV.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

TEAM_DIRECTORY = """
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
"""

SYSTEM_PROMPT = f"""You are the Lead Technical Project Manager at NovaWorks Technologies.
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

{TEAM_DIRECTORY}

You MUST return a valid JSON array of projects matching this exact JSON schema:
[
  {{
    "name": "Project Name",
    "client_name": "Client Name",
    "description": "Project scope description",
    "manager_email": "manager@novaworks.example",
    "deadline": "YYYY-MM-DD",
    "tasks": [
      {{
        "title": "Task Title",
        "description": "Task scope description",
        "assignee_email": "agent@novaworks.example",
        "deadline": "YYYY-MM-DD",
        "estimated_hours": 12
      }}
    ]
  }}
]
"""

FULL_TRANSCRIPT = """Meeting: NovaWorks Client Delivery Planning
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
Ayesha: Those are the final decisions. Keep the rejected features out. The company already has its nine employees. Create three projects with twelve tasks, then show them in the CRM. That's all for this meeting.
"""

def call_gemini(transcript):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={GEMINI_KEY}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{SYSTEM_PROMPT}\n\nTRANSCRIPT TO PROCESS:\n{transcript}"}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.1
        }
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)

if __name__ == "__main__":
    print("Calling Gemini 3.1 Flash Lite with full transcript...")
    projects = call_gemini(FULL_TRANSCRIPT)
    
    print("\n--- EXTRACTED PROJECTS ---")
    print(f"Total projects extracted: {len(projects)}")
    total_tasks = 0
    for p in projects:
        tasks = p.get("tasks", [])
        total_tasks += len(tasks)
        total_hours = sum(t.get("estimated_hours", 0) for t in tasks)
        print(f"\nProject: {p.get('name')} | Client: {p.get('client_name')} | Manager: {p.get('manager_email')} | Deadline: {p.get('deadline')}")
        print(f"Tasks ({len(tasks)} tasks, {total_hours} hrs total):")
        for t in tasks:
            print(f"  - [{t.get('deadline')}] {t.get('title')} ({t.get('estimated_hours')}h) -> {t.get('assignee_email')}")
            
    print(f"\nTOTAL TASKS EXTRACTED: {total_tasks}")
