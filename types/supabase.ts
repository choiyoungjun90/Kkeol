export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string | null
          avatar_url: string | null
          is_anonymous: boolean
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname?: string | null
          avatar_url?: string | null
          is_anonymous?: boolean
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nickname?: string | null
          avatar_url?: string | null
          is_anonymous?: boolean
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string | null
          stock_code: string | null
          title: string
          content: string
          view_count: number
          like_count: number
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          stock_code?: string | null
          title: string
          content: string
          view_count?: number
          like_count?: number
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          stock_code?: string | null
          title?: string
          content?: string
          view_count?: number
          like_count?: number
          ip_address?: string | null
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string | null
          parent_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id?: string | null
          parent_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string | null
          parent_id?: string | null
          content?: string
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          vote_type: 'LIKE' | 'BUY' | 'SELL'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          vote_type: 'LIKE' | 'BUY' | 'SELL'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          vote_type?: 'LIKE' | 'BUY' | 'SELL'
          created_at?: string
        }
      }
    }
  }
}
