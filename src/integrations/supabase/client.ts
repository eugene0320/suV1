// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wmwakhofllmymrgfwsnz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd2FraG9mbGxteW1yZ2Z3c256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODM4NjIsImV4cCI6MjA1NzA1OTg2Mn0.rw8uBO1R6sl3dpMqMSutD4Fb_snFkMwbhIqWHuCfffs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);