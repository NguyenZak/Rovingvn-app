/**
 * Blog Management - Server Page
 */

import { getAllPosts, getCategories } from "@/lib/actions/blog-actions";
import { BlogClient } from "./BlogClient";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Blog Management | Admin",
    description: "Manage blog posts and categories",
};

export const dynamic = 'force-dynamic';

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; status?: string; category?: string }>;
}) {
    // Check permission
    const canView = await hasPermission('manage_blog'); // Or view_dashboard + view_content if separated
    // For now using manage_blog as strict check
    if (!canView) {
        // Check if viewer has read access?
        // In migration: viewer has read-only access but might not have 'manage_blog'.
        // We should probably check 'view_dashboard' or specific 'view_blog' if existed.
        // For now assuming admin/editor access for this page.
        const isAdminOrEditor = await hasPermission('manage_blog');
        if (!isAdminOrEditor) redirect('/admin');
    }

    const { page: pageParam, search: searchParam, status: statusParam, category: categoryParam } = await searchParams;

    const page = Number(pageParam) || 1;
    const search = searchParam || '';
    const status = statusParam || '';
    const category = categoryParam || '';

    const [postsResult, categoriesResult] = await Promise.all([
        getAllPosts({
            page,
            search,
            status,
            category,
            limit: 20
        }),
        getCategories()
    ]);

    const posts = postsResult.success && postsResult.data ? postsResult.data : [];
    // const pagination = postsResult.success ? postsResult.pagination : null;
    const categories = categoriesResult.success && categoriesResult.data ? categoriesResult.data : [];

    return (
        <BlogClient
            initialPosts={posts}
            // initialPagination={pagination}
            initialCategories={categories}
            initialSearch={search}
            initialStatus={status}
            initialCategory={category}
        />
    );
}
