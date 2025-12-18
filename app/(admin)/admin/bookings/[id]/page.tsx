/**
 * Booking Details Page
 */

import { getBookingById } from "@/lib/actions/booking-actions";
import { BookingDetailClient } from "./BookingDetailClient";
import { hasPermission } from "@/lib/rbac/permissions";
import { notFound, redirect } from "next/navigation";

export const metadata = {
    title: "Booking Details | Admin",
};

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Check permission
    const canView = await hasPermission('manage_tours'); // Reuse tour permission
    if (!canView) {
        redirect('/admin/bookings');
    }

    const { id } = await params;
    const { data: booking, success } = await getBookingById(id);

    if (!success || !booking) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <BookingDetailClient booking={booking} />
        </div>
    );
}
