
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBooking, updateBooking, type Booking } from "@/lib/actions/booking-actions";
import { getAllTours, type Tour } from "@/lib/actions/tour-actions";
import { CreditCard, User, MapPin, FileText, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface BookingFormProps {
    initialData?: Booking | null;
    isEdit?: boolean;
}

export default function BookingForm({ initialData, isEdit = false }: BookingFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [tours, setTours] = useState<Tour[]>([]);
    const [isLoadingTours, setIsLoadingTours] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<Booking>>({
        tour_id: initialData?.tour_id || "",
        travel_date: initialData?.travel_date || new Date().toISOString().split('T')[0],
        adults: initialData?.adults || 1,
        children: initialData?.children || 0,
        infants: initialData?.infants || 0,
        total_price: initialData?.total_price || 0,
        currency: initialData?.currency || "VND",
        payment_status: initialData?.payment_status || "pending",
        payment_method: initialData?.payment_method || "bank_transfer",
        status: initialData?.status || "pending",
        booking_code: initialData?.booking_code || `BK-${Date.now().toString().slice(-6)}`,
        customer_info: {
            name: initialData?.customer_info?.name || "",
            email: initialData?.customer_info?.email || "",
            phone: initialData?.customer_info?.phone || "",
            address: initialData?.customer_info?.address || "",
            nationality: initialData?.customer_info?.nationality || "",
        },
        special_requests: initialData?.special_requests || "",
        admin_notes: initialData?.admin_notes || "",
    });

    useEffect(() => {
        const fetchTours = async () => {
            setIsLoadingTours(true);
            try {
                const result = await getAllTours({ limit: 100 }); // Fetch enough tours
                if (result.success && result.data) {
                    setTours(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch tours", error);
                toast.error("Failed to load tours");
            } finally {
                setIsLoadingTours(false);
            }
        };
        fetchTours();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCustomerChange = (field: string, value: string) => {
        setFormData(prev => {
            const currentInfo = prev.customer_info || {
                name: "",
                email: "",
                phone: "",
                address: "",
                nationality: "",
            };
            return {
                ...prev,
                customer_info: { ...currentInfo, [field]: value }
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tour_id) {
            toast.error("Please select a tour");
            return;
        }

        startTransition(async () => {
            try {
                if (isEdit && initialData?.id) {
                    const result = await updateBooking(initialData.id, formData);
                    if (result.success) {
                        toast.success("Booking updated successfully");
                        router.push("/admin/bookings");
                        router.refresh();
                    } else {
                        toast.error(result.error || "Failed to update booking");
                    }
                } else {
                    const result = await createBooking(formData);
                    if (result.success) {
                        toast.success("Booking created successfully");
                        router.push("/admin/bookings");
                        router.refresh();
                    } else {
                        toast.error(result.error || "Failed to create booking");
                    }
                }
            } catch {
                toast.error("An unexpected error occurred");
            }
        });
    };

    // Auto calculate price helper (simple logic)
    const handleCalculatePrice = () => {
        const selectedTour = tours.find(t => t.id === formData.tour_id);
        if (selectedTour) {
            const adultPrice = selectedTour.price_adult || 0;
            const childPrice = selectedTour.price_child || 0;
            const total = (adultPrice * (formData.adults || 0)) + (childPrice * (formData.children || 0));
            setFormData(prev => ({ ...prev, total_price: total }));
            toast.success("Price calculated based on tour rates");
        } else {
            toast.error("Please select a tour first");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Edit Booking" : "New Booking"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isEdit ? `Managing booking ${initialData?.booking_code}` : "Create a new reservation manually"}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/bookings"
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors flex items-center gap-2"
                    >
                        {isPending && <Loader2 className="animate-spin" size={18} />}
                        {isEdit ? "Update Booking" : "Create Booking"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Customer Info Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                            <User className="text-emerald-600" size={20} />
                            <h2 className="font-semibold text-gray-900">Customer Information</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customer_info?.name}
                                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="e.g. Nguyen Van A"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.customer_info?.email}
                                    onChange={(e) => handleCustomerChange('email', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="customer@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.customer_info?.phone}
                                    onChange={(e) => handleCustomerChange('phone', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="+84..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.customer_info?.address}
                                    onChange={(e) => handleCustomerChange('address', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Street, City, Country"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                <input
                                    type="text"
                                    value={formData.customer_info?.nationality}
                                    onChange={(e) => handleCustomerChange('nationality', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Vietnam"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Trip Details Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                            <MapPin className="text-emerald-600" size={20} />
                            <h2 className="font-semibold text-gray-900">Trip Details</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Tour</label>
                                <select
                                    required
                                    value={formData.tour_id}
                                    onChange={(e) => handleChange('tour_id', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="">-- Choose a Tour --</option>
                                    {isLoadingTours ? (
                                        <option disabled>Loading tours...</option>
                                    ) : (
                                        tours.map(tour => (
                                            <option key={tour.id} value={tour.id}>
                                                {tour.title} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: tour.currency || 'VND' }).format(tour.price_adult || 0)})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.travel_date}
                                        onChange={(e) => handleChange('travel_date', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Code</label>
                                    <input
                                        type="text"
                                        readOnly={!isEdit} // Might allow editing if really needed, but usually auto-generated
                                        value={formData.booking_code}
                                        onChange={(e) => handleChange('booking_code', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.adults}
                                        onChange={(e) => handleChange('adults', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.children}
                                        onChange={(e) => handleChange('children', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Infants</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.infants}
                                        onChange={(e) => handleChange('infants', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                            <FileText className="text-emerald-600" size={20} />
                            <h2 className="font-semibold text-gray-900">Notes & Requests</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (from Customer)</label>
                                <textarea
                                    rows={3}
                                    value={formData.special_requests}
                                    onChange={(e) => handleChange('special_requests', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Dietary restrictions, pickup location, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Internal)</label>
                                <textarea
                                    rows={3}
                                    value={formData.admin_notes}
                                    onChange={(e) => handleChange('admin_notes', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-yellow-50"
                                    placeholder="Internal remarks..."
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Status & Payment */}
                <div className="space-y-8">

                    {/* Status Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                            <CheckCircle className="text-emerald-600" size={20} />
                            <h2 className="font-semibold text-gray-900">Booking Status</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                            <CreditCard className="text-emerald-600" size={20} />
                            <h2 className="font-semibold text-gray-900">Payment Details</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={formData.total_price}
                                        onChange={(e) => handleChange('total_price', parseFloat(e.target.value))}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className="w-24 px-2 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    >
                                        <option value="VND">VND</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCalculatePrice}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 mt-1 font-medium underline"
                                >
                                    Auto-calculate based on tour
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                <select
                                    value={formData.payment_status}
                                    onChange={(e) => handleChange('payment_status', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="pending">Unpaid</option>
                                    <option value="paid">Paid</option>
                                    <option value="partial">Partially Paid</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={formData.payment_method}
                                    onChange={(e) => handleChange('payment_method', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="paypal">Paypal</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
}
