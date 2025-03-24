export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anthropic_credentials: {
        Row: {
          api_key: string
          created_at: string
          id: number
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: never
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      conversation_feedback: {
        Row: {
          conversation_id: string
          created_at: string | null
          feedback_data: Json
          id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          feedback_data: Json
          id?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          feedback_data?: Json
          id?: string
        }
        Relationships: []
      }
      conversation_logs: {
        Row: {
          conversation_id: string | null
          elevenlabs_user_id: string | null
          id: number
          message: string
          scenario: string | null
          speaker: string
          timestamp: string | null
        }
        Insert: {
          conversation_id?: string | null
          elevenlabs_user_id?: string | null
          id?: number
          message: string
          scenario?: string | null
          speaker: string
          timestamp?: string | null
        }
        Update: {
          conversation_id?: string | null
          elevenlabs_user_id?: string | null
          id?: number
          message?: string
          scenario?: string | null
          speaker?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      conversations: {
        Row: {
          analysis_summary: string | null
          call_duration: number | null
          conversation_id: string
          created_at: string
          elevenlabs_user_id: string | null
          end_time: string | null
          feedback_id: string | null
          start_time: string | null
          transcript: string | null
          user_id: number | null
        }
        Insert: {
          analysis_summary?: string | null
          call_duration?: number | null
          conversation_id: string
          created_at?: string
          elevenlabs_user_id?: string | null
          end_time?: string | null
          feedback_id?: string | null
          start_time?: string | null
          transcript?: string | null
          user_id?: number | null
        }
        Update: {
          analysis_summary?: string | null
          call_duration?: number | null
          conversation_id?: string
          created_at?: string
          elevenlabs_user_id?: string | null
          end_time?: string | null
          feedback_id?: string | null
          start_time?: string | null
          transcript?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      elevenlabs_credentials: {
        Row: {
          agent_id: string
          api_key: string
          created_at: string
          id: number
        }
        Insert: {
          agent_id: string
          api_key: string
          created_at?: string
          id?: never
        }
        Update: {
          agent_id?: string
          api_key?: string
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      elevenlabs_webhook_data: {
        Row: {
          agent_id: string | null
          analysis: Json | null
          call_duration_secs: number | null
          call_successful: string | null
          conversation_id: string
          conversation_initiation_client_data: Json | null
          cost: number | null
          elevenlabs_user_id: string | null
          id: number
          metadata: Json | null
          raw_webhook_data: Json | null
          received_at: string | null
          start_time_unix_secs: number | null
          status: string | null
          termination_reason: string | null
          transcript: Json | null
          transcript_summary: string | null
          user_id: number | null
        }
        Insert: {
          agent_id?: string | null
          analysis?: Json | null
          call_duration_secs?: number | null
          call_successful?: string | null
          conversation_id: string
          conversation_initiation_client_data?: Json | null
          cost?: number | null
          elevenlabs_user_id?: string | null
          id?: number
          metadata?: Json | null
          raw_webhook_data?: Json | null
          received_at?: string | null
          start_time_unix_secs?: number | null
          status?: string | null
          termination_reason?: string | null
          transcript?: Json | null
          transcript_summary?: string | null
          user_id?: number | null
        }
        Update: {
          agent_id?: string | null
          analysis?: Json | null
          call_duration_secs?: number | null
          call_successful?: string | null
          conversation_id?: string
          conversation_initiation_client_data?: Json | null
          cost?: number | null
          elevenlabs_user_id?: string | null
          id?: number
          metadata?: Json | null
          raw_webhook_data?: Json | null
          received_at?: string | null
          start_time_unix_secs?: number | null
          status?: string | null
          termination_reason?: string | null
          transcript?: Json | null
          transcript_summary?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "elevenlabs_webhook_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_results: {
        Row: {
          addressed_cost_reduction: string | null
          conversation_id: string | null
          id: number
          prep_framework_adherence: string | null
          professionalism: string | null
          rationale: string | null
        }
        Insert: {
          addressed_cost_reduction?: string | null
          conversation_id?: string | null
          id: number
          prep_framework_adherence?: string | null
          professionalism?: string | null
          rationale?: string | null
        }
        Update: {
          addressed_cost_reduction?: string | null
          conversation_id?: string | null
          id?: number
          prep_framework_adherence?: string | null
          professionalism?: string | null
          rationale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_results_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      feedback_logs: {
        Row: {
          conversation_id: string | null
          feedback_notes: string | null
          id: number
          overall_score: number | null
          prep_score: number | null
          professionalism_score: number | null
          relevance_score: number | null
          scenario: string | null
          timestamp: string | null
        }
        Insert: {
          conversation_id?: string | null
          feedback_notes?: string | null
          id?: number
          overall_score?: number | null
          prep_score?: number | null
          professionalism_score?: number | null
          relevance_score?: number | null
          scenario?: string | null
          timestamp?: string | null
        }
        Update: {
          conversation_id?: string | null
          feedback_notes?: string | null
          id?: number
          overall_score?: number | null
          prep_score?: number | null
          professionalism_score?: number | null
          relevance_score?: number | null
          scenario?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      new_conversations: {
        Row: {
          agent_id: string | null
          analysis: Json | null
          call_duration: number | null
          call_successful: boolean | null
          conversation_id: string
          created_at: string | null
          feedback_id: string | null
          id: number
          metadata: Json | null
          score: number | null
          start_time: string | null
          status: string | null
          transcript: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          analysis?: Json | null
          call_duration?: number | null
          call_successful?: boolean | null
          conversation_id: string
          created_at?: string | null
          feedback_id?: string | null
          id?: number
          metadata?: Json | null
          score?: number | null
          start_time?: string | null
          status?: string | null
          transcript?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          analysis?: Json | null
          call_duration?: number | null
          call_successful?: boolean | null
          conversation_id?: string
          created_at?: string | null
          feedback_id?: string | null
          id?: number
          metadata?: Json | null
          score?: number | null
          start_time?: string | null
          status?: string | null
          transcript?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prep_components: {
        Row: {
          conversation_id: string | null
          id: number
          prep_examples: string | null
          prep_points: string | null
          prep_reasons: string | null
          timestamp: string
        }
        Insert: {
          conversation_id?: string | null
          id: number
          prep_examples?: string | null
          prep_points?: string | null
          prep_reasons?: string | null
          timestamp?: string
        }
        Update: {
          conversation_id?: string | null
          id?: number
          prep_examples?: string | null
          prep_points?: string | null
          prep_reasons?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "prep_components_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      prep_score_analysis: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          date: string
          duration_seconds: number
          feedback: Json | null
          feedback_id: string
          id: string
          metadata: Json | null
          prep_score: number
          status: string
          transcript: Json | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          date: string
          duration_seconds: number
          feedback?: Json | null
          feedback_id: string
          id?: string
          metadata?: Json | null
          prep_score: number
          status?: string
          transcript?: Json | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          date?: string
          duration_seconds?: number
          feedback?: Json | null
          feedback_id?: string
          id?: string
          metadata?: Json | null
          prep_score?: number
          status?: string
          transcript?: Json | null
        }
        Relationships: []
      }
      prep_scores: {
        Row: {
          conversation_id: string
          created_at: string | null
          feedback_id: string
          id: number
          prep_details: Json | null
          prep_score: number | null
          user_identifier: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          feedback_id: string
          id?: number
          prep_details?: Json | null
          prep_score?: number | null
          user_identifier?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          feedback_id?: string
          id?: number
          prep_details?: Json | null
          prep_score?: number | null
          user_identifier?: string | null
        }
        Relationships: []
      }
      user_credentials: {
        Row: {
          agent_id: string | null
          api_key: string
          created_at: string | null
          id: number
          service_name: string
          updated_at: string | null
          user_identifier: string | null
        }
        Insert: {
          agent_id?: string | null
          api_key: string
          created_at?: string | null
          id?: number
          service_name: string
          updated_at?: string | null
          user_identifier?: string | null
        }
        Update: {
          agent_id?: string | null
          api_key?: string
          created_at?: string | null
          id?: number
          service_name?: string
          updated_at?: string | null
          user_identifier?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
