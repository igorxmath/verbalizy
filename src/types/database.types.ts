export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      document_sections: {
        Row: {
          content: string | null
          document_id: number
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          document_id: number
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          document_id?: number
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'document_sections_document_id_fkey'
            columns: ['document_id']
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
        ]
      }
      documents: {
        Row: {
          content: string
          id: number
          inserted_at: string
          name: string
          project_id: string
          status: Database['public']['Enums']['status_type']
          updated_at: string
        }
        Insert: {
          content: string
          id?: number
          inserted_at?: string
          name: string
          project_id: string
          status: Database['public']['Enums']['status_type']
          updated_at: string
        }
        Update: {
          content?: string
          id?: number
          inserted_at?: string
          name?: string
          project_id?: string
          status?: Database['public']['Enums']['status_type']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'documents_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      invites: {
        Row: {
          email: string
          expires: string
          id: number
          team_id: string
          token: string
          user_id: string
        }
        Insert: {
          email: string
          expires: string
          id?: number
          team_id: string
          token: string
          user_id: string
        }
        Update: {
          email?: string
          expires?: string
          id?: number
          team_id?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'invites_team_id_fkey'
            columns: ['team_id']
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invites_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      memberships: {
        Row: {
          id: string
          inserted_at: string
          team_id: string
          type: Database['public']['Enums']['membership_type']
          user_id: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          team_id: string
          type: Database['public']['Enums']['membership_type']
          user_id: string
        }
        Update: {
          id?: string
          inserted_at?: string
          team_id?: string
          type?: Database['public']['Enums']['membership_type']
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'memberships_team_id_fkey'
            columns: ['team_id']
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'memberships_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          created_by: string
          id: string
          inserted_at: string
          name: string
          slug: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_by: string
          id?: string
          inserted_at?: string
          name: string
          slug: string
          team_id: string
          updated_at: string
        }
        Update: {
          created_by?: string
          id?: string
          inserted_at?: string
          name?: string
          slug?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_team_id_fkey'
            columns: ['team_id']
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
        ]
      }
      teams: {
        Row: {
          billing_cycle_start: string | null
          created_by: string
          id: string
          inserted_at: string
          is_enterprise_plan: boolean | null
          is_personal: boolean | null
          name: string
          slug: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          billing_cycle_start?: string | null
          created_by: string
          id?: string
          inserted_at?: string
          is_enterprise_plan?: boolean | null
          is_personal?: boolean | null
          name: string
          slug: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          billing_cycle_start?: string | null
          created_by?: string
          id?: string
          inserted_at?: string
          is_enterprise_plan?: boolean | null
          is_personal?: boolean | null
          name?: string
          slug?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'teams_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          email: string
          full_name: string | null
          has_completed_onboarding: boolean
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          full_name?: string | null
          has_completed_onboarding?: boolean
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          full_name?: string | null
          has_completed_onboarding?: boolean
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ivfflathandler: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      kw_match_documents: {
        Args: {
          query_text: string
          match_count: number
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          '': number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          '': string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          '': string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          '': string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          '': string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      membership_type: 'viewer' | 'admin'
      status_type: 'ready' | 'trained' | 'error'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
