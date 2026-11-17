import json
import urllib.request
import urllib.error
from test_transcript_ai import call_gemini, FULL_TRANSCRIPT, SUPABASE_URL, SUPABASE_KEY

print("1. Parsing transcript with Gemini...")
projects = call_gemini(FULL_TRANSCRIPT)
print(f"Extracted {len(projects)} projects.")

print("\n2. Calling Supabase RPC 'insert_transcript_data'...")
rpc_url = f"{SUPABASE_URL}/rest/v1/rpc/insert_transcript_data"
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

payload = {"p_data": projects}

req = urllib.request.Request(
    rpc_url,
    data=json.dumps(payload).encode("utf-8"),
    headers=headers,
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode("utf-8"))
        print("\n--- SUPABASE INSERT SUCCESS ---")
        print("Result from DB:", json.dumps(result, indent=2))
except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8")
    print("\n--- SUPABASE INSERT ERROR ---")
    print(f"HTTP {e.code}: {err_body}")
