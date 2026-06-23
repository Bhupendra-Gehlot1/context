import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          user_name: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          content: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          user_name: string;
          last_seen: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          last_seen?: string;
        };
        Update: {
          last_seen?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          message_id: string;
          content: string;
          asked_by: string;
          status: 'open' | 'answered';
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          content: string;
          asked_by: string;
          status?: 'open' | 'answered';
          created_at?: string;
        };
        Update: {
          status?: 'open' | 'answered';
        };
      };
    };
  };
};