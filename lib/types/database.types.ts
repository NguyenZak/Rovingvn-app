// ============================================
// Supabase Database Types (Auto-generated placeholder)
// Run: npx supabase gen types typescript --local > lib/types/database.types.ts
// ============================================

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
            roles: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
            }
            user_roles: {
                Row: {
                    id: string
                    user_id: string
                    role_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    role_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    role_id?: string
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    parent_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    parent_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    parent_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tags: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    created_at?: string
                }
            }
            media: {
                Row: {
                    id: string
                    filename: string
                    storage_path: string
                    url: string
                    file_size: number | null
                    mime_type: string | null
                    width: number | null
                    height: number | null
                    alt_text: string | null
                    uploaded_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    filename: string
                    storage_path: string
                    url: string
                    file_size?: number | null
                    mime_type?: string | null
                    width?: number | null
                    height?: number | null
                    alt_text?: string | null
                    uploaded_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    filename?: string
                    storage_path?: string
                    url?: string
                    file_size?: number | null
                    mime_type?: string | null
                    width?: number | null
                    height?: number | null
                    alt_text?: string | null
                    uploaded_by?: string | null
                    created_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    content: string | null
                    excerpt: string | null
                    featured_image_id: string | null
                    status: string
                    author_id: string | null
                    published_at: string | null
                    view_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug?: string
                    content?: string | null
                    excerpt?: string | null
                    featured_image_id?: string | null
                    status?: string
                    author_id?: string | null
                    published_at?: string | null
                    view_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    content?: string | null
                    excerpt?: string | null
                    featured_image_id?: string | null
                    status?: string
                    author_id?: string | null
                    published_at?: string | null
                    view_count?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            post_categories: {
                Row: {
                    post_id: string
                    category_id: string
                    created_at: string
                }
                Insert: {
                    post_id: string
                    category_id: string
                    created_at?: string
                }
                Update: {
                    post_id?: string
                    category_id?: string
                    created_at?: string
                }
            }
            post_tags: {
                Row: {
                    post_id: string
                    tag_id: string
                    created_at: string
                }
                Insert: {
                    post_id: string
                    tag_id: string
                    created_at?: string
                }
                Update: {
                    post_id?: string
                    tag_id?: string
                    created_at?: string
                }
            }
            pages: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    content: string | null
                    template: string | null
                    featured_image_id: string | null
                    status: string
                    author_id: string | null
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug?: string
                    content?: string | null
                    template?: string | null
                    featured_image_id?: string | null
                    status?: string
                    author_id?: string | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    content?: string | null
                    template?: string | null
                    featured_image_id?: string | null
                    status?: string
                    author_id?: string | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            seo_metadata: {
                Row: {
                    id: string
                    object_type: string
                    object_id: string
                    meta_title: string | null
                    meta_description: string | null
                    canonical_url: string | null
                    og_title: string | null
                    og_description: string | null
                    og_image_id: string | null
                    noindex: boolean
                    nofollow: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    object_type: string
                    object_id: string
                    meta_title?: string | null
                    meta_description?: string | null
                    canonical_url?: string | null
                    og_title?: string | null
                    og_description?: string | null
                    og_image_id?: string | null
                    noindex?: boolean
                    nofollow?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    object_type?: string
                    object_id?: string
                    meta_title?: string | null
                    meta_description?: string | null
                    canonical_url?: string | null
                    og_title?: string | null
                    og_description?: string | null
                    og_image_id?: string | null
                    noindex?: boolean
                    nofollow?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            destinations: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    country: string | null
                    region: string | null
                    description: string | null
                    image_url: string | null
                    gallery_images: string | null
                    best_time_to_visit: string | null
                    climate_info: string | null
                    attractions: string | null
                    seo_title: string | null
                    seo_description: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    country?: string | null
                    region?: string | null
                    description?: string | null
                    image_url?: string | null
                    gallery_images?: string | null
                    best_time_to_visit?: string | null
                    climate_info?: string | null
                    attractions?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    country?: string | null
                    region?: string | null
                    description?: string | null
                    image_url?: string | null
                    gallery_images?: string | null
                    best_time_to_visit?: string | null
                    climate_info?: string | null
                    attractions?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            tours: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    destination_id: string | null
                    price: number | null
                    duration: string | null
                    description: string | null
                    highlights: string[] | null
                    itinerary: Json | null
                    included: string[] | null
                    excluded: string[] | null
                    images: string[] | null
                    cover_image: string | null
                    max_group_size: number
                    difficulty: string | null
                    tour_type: string | null
                    featured: boolean
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    destination_id?: string | null
                    price?: number | null
                    duration?: string | null
                    description?: string | null
                    highlights?: string[] | null
                    itinerary?: Json | null
                    included?: string[] | null
                    excluded?: string[] | null
                    images?: string[] | null
                    cover_image?: string | null
                    max_group_size?: number
                    difficulty?: string | null
                    tour_type?: string | null
                    featured?: boolean
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    destination_id?: string | null
                    price?: number | null
                    duration?: string | null
                    description?: string | null
                    highlights?: string[] | null
                    itinerary?: Json | null
                    included?: string[] | null
                    excluded?: string[] | null
                    images?: string[] | null
                    cover_image?: string | null
                    max_group_size?: number
                    difficulty?: string | null
                    tour_type?: string | null
                    featured?: boolean
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            tour_pricing: {
                Row: {
                    id: string
                    tour_id: string
                    tier_name: string
                    price: number
                    description: string | null
                    max_guests: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tour_id: string
                    tier_name: string
                    price: number
                    description?: string | null
                    max_guests?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tour_id?: string
                    tier_name?: string
                    price?: number
                    description?: string | null
                    max_guests?: number | null
                    created_at?: string
                }
            }
            audit_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    user_email: string | null
                    action: string
                    object_type: string | null
                    object_id: string | null
                    object_name: string | null
                    before_data: Json | null
                    after_data: Json | null
                    ip_address: string | null
                    user_agent: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    user_email?: string | null
                    action: string
                    object_type?: string | null
                    object_id?: string | null
                    object_name?: string | null
                    before_data?: Json | null
                    after_data?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    user_email?: string | null
                    action?: string
                    object_type?: string | null
                    object_id?: string | null
                    object_name?: string | null
                    before_data?: Json | null
                    after_data?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_user_role: {
                Args: { user_uuid: string }
                Returns: string
            }
            is_admin: {
                Args: { user_uuid: string }
                Returns: boolean
            }
            is_editor_or_admin: {
                Args: { user_uuid: string }
                Returns: boolean
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
