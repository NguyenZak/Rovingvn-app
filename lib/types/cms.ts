// ============================================
// CMS TypeScript Types & Interfaces
// ============================================

import { Database } from './database.types'

// ============================================
// ENUMS
// ============================================

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer'
}

export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published'
}

export enum PageStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published'
}

export enum SliderStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export enum AuditAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LOGIN = 'login',
    LOGOUT = 'logout',
    PUBLISH = 'publish',
    UNPUBLISH = 'unpublish'
}

export enum ObjectType {
    POST = 'post',
    PAGE = 'page',
    MEDIA = 'media',
    USER = 'user',
    CATEGORY = 'category',
    TAG = 'tag',
    SLIDER = 'slider'
}

// ============================================
// DATABASE ROW TYPES
// ============================================

export type Role = Database['public']['Tables']['roles']['Row']
export type UserRole_DB = Database['public']['Tables']['user_roles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Page = Database['public']['Tables']['pages']['Row']
export type SEOMetadata = Database['public']['Tables']['seo_metadata']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type Slider = {
    id: string
    title: string
    subtitle: string | null
    description: string | null
    image_id: string | null
    link: string | null
    button_text: string | null
    display_order: number
    status: string
    start_date: string | null
    end_date: string | null
    created_by: string | null
    created_at: string
    updated_at: string
}

// ============================================
// INSERT TYPES
// ============================================

export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type MediaInsert = Database['public']['Tables']['media']['Insert']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PageInsert = Database['public']['Tables']['pages']['Insert']
export type SEOMetadataInsert = Database['public']['Tables']['seo_metadata']['Insert']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']
export type SliderInsert = Omit<Slider, 'id' | 'created_at' | 'updated_at'>
export type SliderUpdate = Partial<SliderInsert>

// ============================================
// UPDATE TYPES
// ============================================

export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type TagUpdate = Database['public']['Tables']['tags']['Update']
export type MediaUpdate = Database['public']['Tables']['media']['Update']
export type PostUpdate = Database['public']['Tables']['posts']['Update']
export type PageUpdate = Database['public']['Tables']['pages']['Update']
export type SEOMetadataUpdate = Database['public']['Tables']['seo_metadata']['Update']

// ============================================
// EXTENDED TYPES WITH RELATIONS
// ============================================

export interface PostWithRelations extends Post {
    author?: {
        id: string
        email?: string
    }
    featured_image?: Media
    categories?: Category[]
    tags?: Tag[]
    seo_metadata?: SEOMetadata
}

export interface PageWithRelations extends Page {
    author?: {
        id: string
        email?: string
    }
    featured_image?: Media
    seo_metadata?: SEOMetadata
}

export interface MediaWithUploader extends Media {
    uploader?: {
        id: string
        email?: string
    }
}

export interface AuditLogWithUser extends AuditLog {
    user?: {
        id: string
        email?: string
    }
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface PostFormData {
    title: string
    slug?: string
    content?: string
    excerpt?: string
    featured_image_id?: string
    status: PostStatus
    category_ids?: string[]
    tag_ids?: string[]
    seo?: SEOFormData
}

export interface PageFormData {
    title: string
    slug?: string
    content?: string
    template?: string
    featured_image_id?: string
    status: PageStatus
    seo?: SEOFormData
}

export interface SEOFormData {
    meta_title?: string
    meta_description?: string
    canonical_url?: string
    og_title?: string
    og_description?: string
    og_image_id?: string
    noindex?: boolean
    nofollow?: boolean
}

export interface MediaUploadData {
    file: File
    alt_text?: string
}

export interface CategoryFormData {
    name: string
    slug?: string
    description?: string
    parent_id?: string
}

export interface TagFormData {
    name: string
    slug?: string
}

export interface SliderFormData {
    title: string
    subtitle?: string
    description?: string
    image_id?: string
    link?: string
    button_text?: string
    display_order: number
    status: SliderStatus
    start_date?: string
    end_date?: string
}

// ============================================
// FILTER & QUERY TYPES
// ============================================

export interface PostFilters {
    status?: PostStatus
    category_id?: string
    tag_id?: string
    author_id?: string
    search?: string
    dateFrom?: string
    dateTo?: string
}

export interface PageFilters {
    status?: PageStatus
    template?: string
    search?: string
}

export interface MediaFilters {
    mime_type?: string
    uploaded_by?: string
    search?: string
    dateFrom?: string
    dateTo?: string
}

export interface AuditLogFilters {
    user_id?: string
    action?: AuditAction
    object_type?: ObjectType
    dateFrom?: string
    dateTo?: string
}

export interface SliderFilters {
    status?: SliderStatus
    search?: string
}

export interface PaginationParams {
    page: number
    perPage: number
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    perPage: number
    totalPages: number
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface APIResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface ValidationError {
    field: string
    message: string
}

export interface APIError {
    message: string
    errors?: ValidationError[]
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface CMSStats {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalPages: number
    totalMedia: number
    totalCategories: number
    totalTags: number
    recentActivity: AuditLogWithUser[]
}

// ============================================
// USER WITH ROLE
// ============================================

export interface UserWithRole {
    id: string
    email?: string
    role?: UserRole
    created_at?: string
}

// ============================================
// SEO PREVIEW DATA
// ============================================

export interface SEOPreviewData {
    title: string
    description: string
    url: string
}
