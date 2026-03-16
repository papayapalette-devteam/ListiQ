const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// 1. supabaseAdmin — uses SERVICE_ROLE_KEY (for server-side admin operations only)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 2. supabasePublic — uses ANON_KEY (for verifying user JWTs)
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {
  supabaseAdmin,
  supabasePublic
};
