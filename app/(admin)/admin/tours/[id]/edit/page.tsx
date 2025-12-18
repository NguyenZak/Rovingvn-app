/**
 * Edit Tour Page
 */

import { TourForm } from "../../_components/TourForm";
import { getTourById } from "@/lib/actions/tour-actions";
import { hasPermission } from "@/lib/rbac/permissions";
import { notFound, redirect } from "next/navigation";

export const metadata = {
    title: "Edit Tour | Admin",
};

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    // Check permission
    const canEdit = await hasPermission('edit_tours');
    if (!canEdit) {
        redirect('/admin/tours');
    }

    const { id } = await params;
    const { data: tour, success } = await getTourById(id);

    if (!success || !tour) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <TourForm initialData={tour} />
        </div>
    );
}
