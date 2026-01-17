/**
 * Edit Destination Page
 */

import { DestinationForm } from "../../_components/DestinationForm";
import { getDestinationById } from "@/lib/actions/destination-actions";
import { hasPermission } from "@/lib/rbac/permissions";
import { notFound, redirect } from "next/navigation";
import { getRegions } from "@/lib/actions/region-actions";

export const metadata = {
    title: "Edit Destination | Admin",
};

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
    // Check permission
    const canEdit = await hasPermission('manage_tours');
    if (!canEdit) {
        redirect('/admin/destinations');
    }

    const { id } = await params;
    const { data: destination, success } = await getDestinationById(id);

    if (!success || !destination) {
        notFound();
    }

    // Fetch regions for the form
    const regionsResult = await getRegions();
    const regions = regionsResult.success ? regionsResult.data : [];

    return (
        <div className="max-w-5xl mx-auto">
            <DestinationForm destination={destination} isNew={false} regions={regions} />
        </div>
    );
}
