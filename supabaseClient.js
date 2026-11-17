import { createClient } from '@supabase/supabase-js';

// Detect environment variables across Vite, Next.js, and Create React App
const getEnv = (key) => {
  // Check Vite (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Check Node / Webpack / CRA / Next.js (process.env)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const supabaseUrl = 
  getEnv('VITE_SUPABASE_URL') || 
  getEnv('NEXT_PUBLIC_SUPABASE_URL') || 
  getEnv('REACT_APP_SUPABASE_URL') || 
  getEnv('SUPABASE_URL') ||
  'https://zdbahnaoedddseazlcsn.supabase.co';

const supabaseAnonKey = 
  getEnv('VITE_SUPABASE_ANON_KEY') || 
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  getEnv('REACT_APP_SUPABASE_ANON_KEY') || 
  getEnv('SUPABASE_ANON_KEY') ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYmFobmFvZWRkZHNlYXpsY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4NTIxNjUsImV4cCI6MjExMDQyODE2NX0.aK1gRaLfYAmPV5-EJQ5bEBU7rBn3XCZdHRbWwmi3--w';

// Protect Node.js test runs where WebSocket is not defined globally
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class DummyWebSocket {};
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true },
});

export const geminiApiKey = 
  getEnv('VITE_GEMINI_API_KEY') || 
  getEnv('NEXT_PUBLIC_GEMINI_API_KEY') || 
  getEnv('REACT_APP_GEMINI_API_KEY') || 
  getEnv('GEMINI_API_KEY') ||
  '';
