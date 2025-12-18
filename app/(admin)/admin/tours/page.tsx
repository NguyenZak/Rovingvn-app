/**
 * Tours Management - Server Page  
 * Load tours and pass to client component
 */

import { getAllTours, type Tour } from "@/lib/actions/tour-actions";
import { ToursClient } from "./ToursClient";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Tours Management | Admin",
    description: "Manage tours and travel packages",
};

export const dynamic = 'force-dynamic';

export default async function ToursPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
    // Check permission
    const canView = await hasPermission('view_tours');
    if (!canView) {
        redirect('/admin');
    }

    const { page: pageParam, search: searchParam, status: statusParam } = await searchParams;

    const page = Number(pageParam) || 1;
    const search = searchParam || '';
    const status = statusParam || '';

    const result = await getAllTours({
        page,
        search,
        status,
        limit: 20
    });

    const tours: Tour[] = result.success && result.data ? result.data as Tour[] : [];


    return (
        <ToursClient
            initialTours={tours}
            initialSearch={search}
            initialStatus={status}
        />
    );
}
