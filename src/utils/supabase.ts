import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// export const createClient = () =>
//   createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );

// import { createClient } from '@supabase/supabase-js'

// // Create a single supabase client for interacting with your database
// const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
