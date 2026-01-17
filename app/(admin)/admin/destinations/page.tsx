/**
 * Destinations Management - Server Page
 */

import { getAllDestinations } from "@/lib/actions/destination-actions";
import { DestinationsClient } from "./DestinationsClient";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { getRegions } from "@/lib/actions/region-actions";

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

    // Fetch destinations
    const result = await getAllDestinations({
        page,
        search,
        status,
        region,
        limit: 20
    });

    const destinations = result.success && result.data ? result.data : [];

    // Fetch regions for filter dropdown
    const regionsResult = await getRegions();
    const regions = regionsResult.success ? regionsResult.data : [];

    return (
        <DestinationsClient
            initialDestinations={destinations}
            initialSearch={search}
            initialStatus={status}
            initialRegion={region}
            regions={regions}
        />
    );
}
