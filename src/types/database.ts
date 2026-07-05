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
      articles: {
        Row: {
          id: string
          user_id: string
          url: string
          canonical_url: string | null
          title: string | null
          domain: string | null
          snippet: string | null
          image_url: string | null
          html_content: string | null
          text_content: string | null
          estimated_read_time_minutes: number | null
          is_read: boolean
          metadata_status: 'pending' | 'fetching' | 'fetched' | 'failed'
          metadata_retry_count: number
          saved_at: string
          read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          canonical_url?: string | null
          title?: string | null
          domain?: string | null
          snippet?: string | null
          image_url?: string | null
          html_content?: string | null
          text_content?: string | null
          estimated_read_time_minutes?: number | null
          is_read?: boolean
          metadata_status?: 'pending' | 'fetching' | 'fetched' | 'failed'
          metadata_retry_count?: number
          saved_at?: string
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          canonical_url?: string | null
          title?: string | null
          domain?: string | null
          snippet?: string | null
          image_url?: string | null
          html_content?: string | null
          text_content?: string | null
          estimated_read_time_minutes?: number | null
          is_read?: boolean
          metadata_status?: 'pending' | 'fetching' | 'fetched' | 'failed'
          metadata_retry_count?: number
          saved_at?: string
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'articles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string | null
          color_hex: string | null
          is_system: boolean
          system_identifier: 'unsorted' | 'to_read' | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string | null
          color_hex?: string | null
          is_system?: boolean
          system_identifier?: 'unsorted' | 'to_read' | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string | null
          color_hex?: string | null
          is_system?: boolean
          system_identifier?: 'unsorted' | 'to_read' | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'folders_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      article_folders: {
        Row: {
          id: string
          user_id: string
          article_id: string
          folder_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          folder_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          folder_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'article_folders_article_id_fkey'
            columns: ['article_id']
            isOneToOne: false
            referencedRelation: 'articles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'article_folders_folder_id_fkey'
            columns: ['folder_id']
            isOneToOne: false
            referencedRelation: 'folders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'article_folders_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      highlights: {
        Row: {
          id: string
          user_id: string
          article_id: string
          selected_text: string
          note: string | null
          color_name: 'yellow' | 'blue' | 'green' | 'pink'
          start_offset: number | null
          end_offset: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          selected_text: string
          note?: string | null
          color_name?: 'yellow' | 'blue' | 'green' | 'pink'
          start_offset?: number | null
          end_offset?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          selected_text?: string
          note?: string | null
          color_name?: 'yellow' | 'blue' | 'green' | 'pink'
          start_offset?: number | null
          end_offset?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'highlights_article_id_fkey'
            columns: ['article_id']
            isOneToOne: false
            referencedRelation: 'articles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'highlights_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string
          article_id: string
          scroll_percentage: number
          scroll_y_offset: number
          last_read_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          scroll_percentage?: number
          scroll_y_offset?: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          scroll_percentage?: number
          scroll_y_offset?: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reading_progress_article_id_fkey'
            columns: ['article_id']
            isOneToOne: false
            referencedRelation: 'articles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reading_progress_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          reader_font_size: number
          reader_font_family: string
          reader_theme: 'light' | 'dark' | 'sepia'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reader_font_size?: number
          reader_font_family?: string
          reader_theme?: 'light' | 'dark' | 'sepia'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reader_font_size?: number
          reader_font_family?: string
          reader_theme?: 'light' | 'dark' | 'sepia'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
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
      [_ in never]: never
    }
    Enums: {
      metadata_status: 'pending' | 'fetching' | 'fetched' | 'failed'
      highlight_color: 'yellow' | 'blue' | 'green' | 'pink'
      reader_theme: 'light' | 'dark' | 'sepia'
      system_folder_identifier: 'unsorted' | 'to_read'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
