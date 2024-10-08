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
          parent: number | null
        }
        Insert: {
          anonymous?: boolean
          content: string
          created_at?: string
          id?: number
          owner?: string | null
          parent?: number | null
        }
        Update: {
          anonymous?: boolean
          content?: string
          created_at?: string
          id?: number
          owner?: string | null
          parent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_comments_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_comments_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      course_years: {
        Row: {
          course_id: number | null
          course_year_id: number
          year_number: number | null
        }
        Insert: {
          course_id?: number | null
          course_year_id?: number
          year_number?: number | null
        }
        Update: {
          course_id?: number | null
          course_year_id?: number
          year_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_years_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
      drafts: {
        Row: {
          anonymous: boolean | null
          content: string | null
          created_at: string
          header_picture: string | null
          heading: string | null
          id: number
          owner: string
          tags: string[] | null
          target: string | null
          target_type: string | null
          type: string | null
        }
        Insert: {
          anonymous?: boolean | null
          content?: string | null
          created_at?: string
          header_picture?: string | null
          heading?: string | null
          id?: number
          owner?: string
          tags?: string[] | null
          target?: string | null
          target_type?: string | null
          type?: string | null
        }
        Update: {
          anonymous?: boolean | null
          content?: string | null
          created_at?: string
          header_picture?: string | null
          heading?: string | null
          id?: number
          owner?: string
          tags?: string[] | null
          target?: string | null
          target_type?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drafts_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_assignments: {
        Row: {
          assignment_id: number
          course_year_id: number
          is_required: boolean
          module_id: string
        }
        Insert: {
          assignment_id?: number
          course_year_id: number
          is_required: boolean
          module_id: string
        }
        Update: {
          assignment_id?: number
          course_year_id?: number
          is_required?: boolean
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_assignments_course_year_id_fkey"
            columns: ["course_year_id"]
            isOneToOne: false
            referencedRelation: "course_years"
            referencedColumns: ["course_year_id"]
          },
          {
            foreignKeyName: "module_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_resources: {
        Row: {
          module: string
          resource: string
        }
        Insert: {
          module: string
          resource: string
        }
        Update: {
          module?: string
          resource?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_resources_module_fkey"
            columns: ["module"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_resources_resource_fkey"
            columns: ["resource"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          tags: string[]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          tags: string[]
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          anonymous: boolean
          attached_comments: number[]
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
          type: string
        }
        Insert: {
          anonymous?: boolean
          attached_comments?: number[]
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
          type?: string
        }
        Update: {
          anonymous?: boolean
          attached_comments?: number[]
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
          admin: boolean
          first_name: string
          id: string
          last_name: string
          profile_picture: string | null
        }
        Insert: {
          admin?: boolean
          first_name: string
          id: string
          last_name: string
          profile_picture?: string | null
        }
        Update: {
          admin?: boolean
          first_name?: string
          id?: string
          last_name?: string
          profile_picture?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_commendations: {
        Row: {
          commender: string
          resource: string
        }
        Insert: {
          commender: string
          resource: string
        }
        Update: {
          commender?: string
          resource?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_commendations_commender_fkey"
            columns: ["commender"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_commendations_resource_fkey"
            columns: ["resource"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          owner: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          owner: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          owner?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          assigned_modules: string[]
          email: string
          linked_profile: string | null
        }
        Insert: {
          assigned_modules: string[]
          email: string
          linked_profile?: string | null
        }
        Update: {
          assigned_modules?: string[]
          email?: string
          linked_profile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_linked_profile_fkey"
            columns: ["linked_profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      users_courses: {
        Row: {
          course_year_id: number | null
          last_modified: string
          user_id: string
        }
        Insert: {
          course_year_id?: number | null
          last_modified: string
          user_id: string
        }
        Update: {
          course_year_id?: number | null
          last_modified?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_courses_course_year_id_fkey"
            columns: ["course_year_id"]
            isOneToOne: false
            referencedRelation: "course_years"
            referencedColumns: ["course_year_id"]
          },
          {
            foreignKeyName: "users_courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_module_assignments:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              course_years_id: number
              module_id: string
              module_title: string
              module_description: string
              is_required: boolean
            }[]
          }
        | {
            Args: {
              p_user_id: string
            }
            Returns: {
              course_years_id: number
              module_id: string
              module_title: string
              module_description: string
              is_required: boolean
            }[]
          }
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
