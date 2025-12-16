
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
            users: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    role: 'admin' | 'user'
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'admin' | 'user'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'admin' | 'user'
                    created_at?: string
                }
            }
            destinations: {
                Row: {
                    id: string
                    slug: string
                    name: string
                    description: string | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    name: string
                    description?: string | null
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    name?: string
                    description?: string | null
                    image_url?: string | null
                    created_at?: string
                }
            }
            tours: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string | null
                    price: number
                    duration: string | null
                    destination_id: string | null
                    images: string[] | null
                    schedule: Json | null
                    status: 'published' | 'draft' | 'archived'
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    description?: string | null
                    price: number
                    duration?: string | null
                    destination_id?: string | null
                    images?: string[] | null
                    schedule?: Json | null
                    status?: 'published' | 'draft' | 'archived'
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    description?: string | null
                    price?: number
                    duration?: string | null
                    destination_id?: string | null
                    images?: string[] | null
                    schedule?: Json | null
                    status?: 'published' | 'draft' | 'archived'
                    created_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    tour_id: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone: string | null
                    people_count: number
                    start_date: string | null
                    message: string | null
                    status: 'pending' | 'confirmed' | 'cancelled'
                    created_at: string
                }
                Insert: {
                    id?: string
                    tour_id?: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone?: string | null
                    people_count?: number
                    start_date?: string | null
                    message?: string | null
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    created_at?: string
                }
                Update: {
                    id?: string
                    tour_id?: string | null
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string | null
                    people_count?: number
                    start_date?: string | null
                    message?: string | null
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    created_at?: string
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    content: string | null
                    excerpt: string | null
                    cover_image: string | null
                    status: 'published' | 'draft'
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    content?: string | null
                    excerpt?: string | null
                    cover_image?: string | null
                    status?: 'published' | 'draft'
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    content?: string | null
                    excerpt?: string | null
                    cover_image?: string | null
                    status?: 'published' | 'draft'
                    created_at?: string
                }
            }
        }
    }
}
