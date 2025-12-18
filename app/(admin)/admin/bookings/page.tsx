/**
 * Bookings Management - Server Page
 */

import { getAllBookings } from "@/lib/actions/booking-actions";
import { BookingsClient } from "./BookingsClient";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Bookings Management | Admin",
};

export const dynamic = 'force-dynamic';

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; status?: string; payment?: string; dateFrom?: string; dateTo?: string }>;
}) {
    // Check permission (assuming 'manage_tours' covers bookings for now or generic admin)
    const canView = await hasPermission('manage_tours') || await hasPermission('view_dashboard');
    if (!canView) {
        redirect('/admin');
    }

    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const search = resolvedParams.search || '';
    const status = resolvedParams.status || '';
    const payment = resolvedParams.payment || '';
    const dateFrom = resolvedParams.dateFrom || '';
    const dateTo = resolvedParams.dateTo || '';

    const result = await getAllBookings({
        page,
        search,
        status,
        payment_status: payment,
        dateFrom,
        dateTo,
        limit: 20
    });

    const bookings = result.success && result.data ? result.data : [];
    // const pagination = result.success ? result.pagination : null;

    return (
        <BookingsClient
            initialBookings={bookings}
            // initialPagination={pagination}
            initialSearch={search}
            initialStatus={status}
            initialPayment={payment}
            initialDateFrom={dateFrom}
            initialDateTo={dateTo}
        />
    );
}
