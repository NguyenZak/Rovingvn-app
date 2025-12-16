
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BlogPostFormClient from './BlogFormClient'

export default async function BlogPostFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const isNew = id === 'new'
    let post = null

    if (!isNew) {
        const supabase = await createClient()
        const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single()
        post = data
        if (!post) redirect('/admin/blog')
    }

    return <BlogPostFormClient post={post} isNew={isNew} />
}
