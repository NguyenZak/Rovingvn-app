/**
 * Create New Tour Page
 */

import { TourForm } from "../_components/TourForm";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Create New Tour | Admin",
};

export const dynamic = 'force-dynamic';

export default async function CreateTourPage() {
    // Check permission
    const canCreate = await hasPermission('create_tours');
    if (!canCreate) {
        redirect('/admin/tours');
    }

    return (
        <div className="max-w-7xl mx-auto">
            <TourForm />
        </div>
    );
}
