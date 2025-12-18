/**
 * Edit Blog Post Page
 */

import { BlogForm } from "../../_components/BlogForm";
import { getPostById, getCategories } from "@/lib/actions/blog-actions";
import { hasPermission } from "@/lib/rbac/permissions";
import { notFound, redirect } from "next/navigation";

export const metadata = {
    title: "Edit Post | Admin",
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Check permission
    const canEdit = await hasPermission('manage_blog');
    if (!canEdit) {
        redirect('/admin/blog');
    }

    const [postResult, categoriesResult] = await Promise.all([
        getPostById(id),
        getCategories()
    ]);

    if (!postResult.success || !postResult.data) {
        notFound();
    }

    return (
        <div className="w-full mx-auto">
            <BlogForm
                initialData={postResult.data}
                categories={categoriesResult.data || []}
            />
        </div>
    );
}
