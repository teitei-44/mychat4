// `supabase gen types typescript` 결과를 손으로 옮긴 타입.
// 스키마(supabase/migrations)를 바꾸면 함께 갱신할 것.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      mandalarts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          core_goal: string;
          sub_goals: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          core_goal: string;
          sub_goals?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          core_goal?: string;
          sub_goals?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type MandalartRow = Database["public"]["Tables"]["mandalarts"]["Row"];
