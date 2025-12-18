/**
 * Create New Blog Post Page
 */

import { BlogForm } from "../_components/BlogForm";
import { getCategories } from "@/lib/actions/blog-actions";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Write New Post | Admin",
};

export const dynamic = 'force-dynamic';

export default async function CreateBlogPage() {
    // Check permission
    const canCreate = await hasPermission('manage_blog');
    if (!canCreate) {
        redirect('/admin/blog');
    }

    const { data: categories } = await getCategories();

    return (
        <div className="w-full mx-auto">
            <BlogForm categories={categories || []} />
        </div>
    );
}
