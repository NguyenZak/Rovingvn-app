/**
 * Create New Destination Page
 */

import { DestinationForm } from "../_components/DestinationForm";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Add Destination | Admin",
};

export const dynamic = 'force-dynamic';

export default async function CreateDestinationPage() {
    // Check permission
    const canCreate = await hasPermission('manage_tours');
    if (!canCreate) {
        redirect('/admin/destinations');
    }

    return (
        <div className="max-w-5xl mx-auto">
            <DestinationForm isNew={true} />
        </div>
    );
}
