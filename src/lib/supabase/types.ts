export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          user_id:    string
          role:       'superadmin' | 'editor'
          created_at: string
        }
        Insert: {
          user_id:    string
          role?:      'superadmin' | 'editor'
          created_at?: string
        }
        Update: {
          user_id?:   string
          role?:      'superadmin' | 'editor'
          created_at?: string
        }
      }
      products: {
        Row: {
          id:          string
          slug:        string
          name:        string
          description: string | null
          price:       number
          images:      string[]
          tier:        'Signature' | 'Couture' | 'Bespoke' | null
          in_stock:    boolean
          stock_count: number
          is_new:      boolean
          hair_type:   string | null
          length:      string | null
          density:     string | null
          cap_type:    string | null
          origin:      string | null
          category:    string | null
          colors:      Json
          lengths:     string[]
          created_at:  string
        }
        Insert: {
          id?:         string
          slug:        string
          name:        string
          description?: string | null
          price:       number
          images?:     string[]
          tier?:       'Signature' | 'Couture' | 'Bespoke' | null
          in_stock?:   boolean
          stock_count?: number
          is_new?:     boolean
          hair_type?:  string | null
          length?:     string | null
          density?:    string | null
          cap_type?:   string | null
          origin?:     string | null
          category?:   string | null
          colors?:     Json
          lengths?:    string[]
          created_at?: string
        }
        Update: {
          id?:         string
          slug?:       string
          name?:       string
          description?: string | null
          price?:      number
          images?:     string[]
          tier?:       'Signature' | 'Couture' | 'Bespoke' | null
          in_stock?:   boolean
          stock_count?: number
          is_new?:     boolean
          hair_type?:  string | null
          length?:     string | null
          density?:    string | null
          cap_type?:   string | null
          origin?:     string | null
          category?:   string | null
          colors?:     Json
          lengths?:    string[]
          created_at?: string
        }
      }
      orders: {
        Row: {
          id:               string
          user_id:          string | null
          guest_email:      string | null
          items:            Json
          subtotal:         number
          shipping_fee:     number
          total:            number
          status:           'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          paystack_ref:     string | null
          shipping_address: Json
          notes:            string | null
          created_at:       string
          updated_at:       string
        }
        Insert: {
          id?:              string
          user_id?:         string | null
          guest_email?:     string | null
          items:            Json
          subtotal:         number
          shipping_fee?:    number
          total:            number
          status?:          'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          paystack_ref?:    string | null
          shipping_address: Json
          notes?:           string | null
          created_at?:      string
          updated_at?:      string
        }
        Update: {
          id?:              string
          user_id?:         string | null
          guest_email?:     string | null
          items?:           Json
          subtotal?:        number
          shipping_fee?:    number
          total?:           number
          status?:          'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          paystack_ref?:    string | null
          shipping_address?: Json
          notes?:           string | null
          created_at?:      string
          updated_at?:      string
        }
      }
      profiles: {
        Row: {
          id:         string
          full_name:  string | null
          first_name: string | null
          last_name:  string | null
          phone:      string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id:          string
          full_name?:  string | null
          first_name?: string | null
          last_name?:  string | null
          phone?:      string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?:         string
          full_name?:  string | null
          first_name?: string | null
          last_name?:  string | null
          phone?:      string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id:         string
          user_id:    string
          product_id: string
          created_at: string
        }
        Insert: {
          id?:        string
          user_id:    string
          product_id: string
          created_at?: string
        }
        Update: {
          id?:        string
          user_id?:   string
          product_id?: string
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id:         string
          email:      string
          first_name: string | null
          status:     'active' | 'unsubscribed'
          source:     string | null
          created_at: string
        }
        Insert: {
          id?:        string
          email:      string
          first_name?: string | null
          status?:    'active' | 'unsubscribed'
          source?:    string | null
          created_at?: string
        }
        Update: {
          id?:        string
          email?:     string
          first_name?: string | null
          status?:    'active' | 'unsubscribed'
          source?:    string | null
          created_at?: string
        }
      }
    }
    Functions: {
      is_admin: {
        Args:    Record<string, never>
        Returns: boolean
      }
      decrement_stock: {
        Args:    { p_id: string; p_qty?: number }
        Returns: { success: boolean; remaining: number }
      }
    }
  }
}

// Convenience row-type aliases
export type AdminRow               = Database['public']['Tables']['admins']['Row']
export type ProductRow             = Database['public']['Tables']['products']['Row']
export type OrderRow               = Database['public']['Tables']['orders']['Row']
export type ProfileRow             = Database['public']['Tables']['profiles']['Row']
export type WishlistItemRow        = Database['public']['Tables']['wishlist_items']['Row']
export type NewsletterSubscriberRow = Database['public']['Tables']['newsletter_subscribers']['Row']
