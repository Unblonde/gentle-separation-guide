
// This file extends the Supabase database types with our specific table definitions
import { Database as SupabaseDatabase } from '@/integrations/supabase/types';

// Extended Database type with our tables
export interface DatabaseExtended {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          updated_at?: string | null;
        };
      };
      family_units: {
        Row: {
          id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
        };
      };
      family_members: {
        Row: {
          id: string;
          user_id: string;
          family_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          family_id?: string;
          role?: string;
          created_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          family_id: string;
          invited_by: string;
          email: string;
          token: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          invited_by: string;
          email: string;
          token: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          invited_by?: string;
          email?: string;
          token?: string;
          status?: string;
          created_at?: string;
        };
      };
      financial_arrangements: {
        Row: {
          id: string;
          family_id: string;
          created_by: string;
          category: string;
          description: string;
          parent_a: string;
          parent_b: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          created_by: string;
          category: string;
          description: string;
          parent_a: string;
          parent_b: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          created_by?: string;
          category?: string;
          description?: string;
          parent_a?: string;
          parent_b?: string;
          status?: string;
          created_at?: string;
        };
      };
      holiday_arrangements: {
        Row: {
          id: string;
          family_id: string;
          created_by: string;
          name: string;
          start_date: string;
          end_date: string;
          with_parent: string;
          location: string;
          pickup_time: string;
          pickup_location: string;
          dropoff_time: string;
          dropoff_location: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          created_by: string;
          name: string;
          start_date: string;
          end_date: string;
          with_parent: string;
          location: string;
          pickup_time: string;
          pickup_location: string;
          dropoff_time: string;
          dropoff_location: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          created_by?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          with_parent?: string;
          location?: string;
          pickup_time?: string;
          pickup_location?: string;
          dropoff_time?: string;
          dropoff_location?: string;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          family_id: string;
          sender_id: string | null;
          is_assistant: boolean;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          sender_id?: string | null;
          is_assistant: boolean;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          sender_id?: string | null;
          is_assistant?: boolean;
          content?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

// Override the default Database type with our extended version
declare module '@supabase/supabase-js' {
  interface Database extends DatabaseExtended {}
}
