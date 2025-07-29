// Supabase database client configuration
// Initializes Supabase client with service role key for server-side operations
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env file
dotenv.config();

// Extract Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate Supabase URL configuration
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  console.error("Error: SUPABASE_URL is not configured properly");
  console.error("Please set a valid Supabase URL in your .env file");
  process.exit(1);
}

// Validate Supabase service role key configuration  
if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'your_supabase_service_role_key_here') {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY is not configured properly");
  console.error("Please set a valid Supabase service role key in your .env file");
  process.exit(1);
}

// Initialize Supabase client with error handling
let supabase;
try {
  // Create Supabase client using service role key (bypasses RLS for server operations)
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error initializing Supabase client:", error.message);
  process.exit(1);
}

// Export configured Supabase client for use in other modules
export default supabase;
