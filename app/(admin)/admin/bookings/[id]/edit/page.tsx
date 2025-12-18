
import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/actions/booking-actions";
import BookingForm from "../../_components/BookingForm";

export const metadata = {
    title: "Edit Booking | Admin",
};

interface EditBookingPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
    const { id } = await params;
    const result = await getBookingById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    return (
        <BookingForm
            initialData={result.data}
            isEdit={true}
        />
    );
}
