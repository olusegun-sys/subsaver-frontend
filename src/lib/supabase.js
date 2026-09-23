import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// TEMP DIAGNOSTIC — will be removed after we fix the env issue
console.log('[ENV CHECK]', {
  url: supabaseUrl ? `present (${supabaseUrl.slice(0, 30)}...)` : 'MISSING',
  anon: supabaseAnonKey ? 'present' : 'MISSING',
  mono: import.meta.env.VITE_MONO_PUBLIC_KEY ? 'present' : 'MISSING',
  paystack: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ? 'present' : 'MISSING',
  allViteKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
});

// Fail-fast guard: if missing, throw a clear error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ SUPABASE ENV VARS MISSING. Check Render Environment Variables section.');
  console.error('   Missing:', {
    VITE_SUPABASE_URL: !supabaseUrl,
    VITE_SUPABASE_ANON_KEY: !supabaseAnonKey,
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)