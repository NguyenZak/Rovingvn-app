/**
 * Destinations Management - Server Page
 */

import { getAllDestinations } from "@/lib/actions/destination-actions";
import { DestinationsClient } from "./DestinationsClient";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Destinations Management | Admin",
};

export const dynamic = 'force-dynamic';

export default async function DestinationsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; status?: string; region?: string }>;
}) {
    // Check permission
    const canView = await hasPermission('manage_tours');
    if (!canView) {
        redirect('/admin');
    }

    const { page: pageParam, search: searchParam, status: statusParam, region: regionParam } = await searchParams;

    const page = Number(pageParam) || 1;
    const search = searchParam || '';
    const status = statusParam || '';
    const region = regionParam || '';

    const result = await getAllDestinations({
        page,
        search,
        status,
        region,
        limit: 20
    });

    const destinations = result.success && result.data ? result.data : [];


    return (
        <DestinationsClient
            initialDestinations={destinations}
            initialSearch={search}
            initialStatus={status}
            initialRegion={region}
        />
    );
}
