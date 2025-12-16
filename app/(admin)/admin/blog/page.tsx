
import { createClient } from '@/lib/supabase/server'
import BlogClient from './BlogClient'

export const revalidate = 0

export default async function AdminBlogPage() {
    const supabase = await createClient()
    const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })

    return <BlogClient posts={posts || []} />
}
