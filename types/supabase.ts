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
      comment_children: {
        Row: {
          children: number[]
          created_at: string
          id: number
        }
        Insert: {
          children: number[]
          created_at?: string
          id?: number
        }
        Update: {
          children?: number[]
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_comment_children_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reports: {
        Row: {
          comment: number
          created_at: string
          id: number
          reason: string | null
          reporting_user: string
        }
        Insert: {
          comment: number
          created_at?: string
          id?: number
          reason?: string | null
          reporting_user?: string
        }
        Update: {
          comment?: number
          created_at?: string
          id?: number
          reason?: string | null
          reporting_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_comment_reports_comment_fkey"
            columns: ["comment"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_comment_reports_reporting_user_fkey"
            columns: ["reporting_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          anonymous: boolean
          content: string
          created_at: string
          id: number
          owner: string | null
        }
        Insert: {
          anonymous?: boolean
          content: string
          created_at?: string
          id?: number
          owner?: string | null
        }
        Update: {
          anonymous?: boolean
          content?: string
          created_at?: string
          id?: number
          owner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_comments_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          id: number
          placement: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: number
          placement?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: number
          placement?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          optional: boolean
          tags: string[] | null
          year: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          optional?: boolean
          tags?: string[] | null
          year?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          optional?: boolean
          tags?: string[] | null
          year?: number | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          anonymous: boolean
          content: string
          created_at: string
          header_picture: string | null
          heading: string
          id: number
          marked_comment: number | null
          owner: string | null
          tags: string[]
          target: string | null
          target_type: string | null
          tl_comments: number[]
          type: string
        }
        Insert: {
          anonymous?: boolean
          content: string
          created_at?: string
          header_picture?: string | null
          heading: string
          id?: number
          marked_comment?: number | null
          owner?: string | null
          tags?: string[]
          target?: string | null
          target_type?: string | null
          tl_comments?: number[]
          type?: string
        }
        Update: {
          anonymous?: boolean
          content?: string
          created_at?: string
          header_picture?: string | null
          heading?: string
          id?: number
          marked_comment?: number | null
          owner?: string | null
          tags?: string[]
          target?: string | null
          target_type?: string | null
          tl_comments?: number[]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_posts_marked_comment_fkey"
            columns: ["marked_comment"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_posts_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          course: number | null
          first_name: string
          id: string
          last_name: string
          profile_picture: string | null
          year: number
        }
        Insert: {
          course?: number | null
          first_name: string
          id: string
          last_name: string
          profile_picture?: string | null
          year: number
        }
        Update: {
          course?: number | null
          first_name?: string
          id?: string
          last_name?: string
          profile_picture?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          title?: string
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
