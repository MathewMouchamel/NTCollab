import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate Supabase configuration
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  console.error("Error: SUPABASE_URL is not configured properly");
  console.error("Please set a valid Supabase URL in your .env file");
  process.exit(1);
}

if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'your_supabase_service_role_key_here') {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY is not configured properly");
  console.error("Please set a valid Supabase service role key in your .env file");
  process.exit(1);
}

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error initializing Supabase client:", error.message);
  process.exit(1);
}

export default supabase;
