import json
from test_transcript_ai import call_gemini, FULL_TRANSCRIPT

# Modify the transcript as per the organizer's test case
modified_transcript = FULL_TRANSCRIPT.replace(
    "Make the final estimate 10 hours. Keep the task deadline at 22 October.",
    "Make the final estimate 12 hours. Keep the task deadline at 23 October."
).replace(
    "Mobile integration and testing, Usman, 10 hours, 22 October.",
    "Mobile integration and testing, Usman, 12 hours, 23 October."
).replace(
    "Usman owns Mobile integration and testing: 10 hours, 22 October.",
    "Usman owns Mobile integration and testing: 12 hours, 23 October."
)

print("Testing modified transcript (Organizers' Test)...")
projects = call_gemini(modified_transcript)

for p in projects:
    if "QuickServe" in p.get("name", ""):
        print(f"\nProject: {p.get('name')}")
        for t in p.get("tasks", []):
            if "integration" in t.get("title", "").lower():
                print(f"-> Found Integration Task: {t.get('title')}")
                print(f"   Hours: {t.get('estimated_hours')} (Expected: 12)")
                print(f"   Deadline: {t.get('deadline')} (Expected: 2026-10-23)")
                print(f"   Assignee: {t.get('assignee_email')} (Expected: usman@novaworks.example)")
