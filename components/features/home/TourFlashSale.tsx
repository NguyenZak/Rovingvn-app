"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Clock } from "lucide-react";
import { TourCard } from "@/components/features/tours/TourCard";
import type { Tour } from "@/lib/actions/tour-actions";

interface TourFlashSaleProps {
    tours: Tour[];
}

export function TourFlashSale({ tours }: TourFlashSaleProps) {
    // Simple 24h countdown loop for demonstration
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 30,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                // Reset loop
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!tours || tours.length === 0) return null;

    return (
        <section className="py-16 md:py-20 relative overflow-hidden bg-slate-900">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-red-500/20 blur-3xl mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl text-white">
                        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-sm font-bold mb-4">
                            <Zap size={16} className="fill-red-400" />
                            LIMITED TIME DEALS
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Flash Sale Offers</h2>
                        <p className="text-slate-300 text-lg">
                            Book now and save big on our most popular adventures. Prices won&apos;t stay this low for long!
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex flex-col items-start md:items-end bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                            <Clock size={16} />
                            Hurry, offers end in:
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                                <span className="bg-white/10 text-white text-2xl md:text-3xl font-bold px-3 py-2 rounded-lg min-w-[3rem] text-center">
                                    {String(timeLeft.hours).padStart(2, "0")}
                                </span>
                                <span className="text-xs text-slate-400 mt-1 uppercase">Hours</span>
                            </div>
                            <span className="text-white text-2xl font-bold pb-4">:</span>
                            <div className="flex flex-col items-center">
                                <span className="bg-white/10 text-white text-2xl md:text-3xl font-bold px-3 py-2 rounded-lg min-w-[3rem] text-center">
                                    {String(timeLeft.minutes).padStart(2, "0")}
                                </span>
                                <span className="text-xs text-slate-400 mt-1 uppercase">Mins</span>
                            </div>
                            <span className="text-white text-2xl font-bold pb-4">:</span>
                            <div className="flex flex-col items-center">
                                <span className="bg-white/10 text-red-400 text-2xl md:text-3xl font-bold px-3 py-2 rounded-lg min-w-[3rem] text-center">
                                    {String(timeLeft.seconds).padStart(2, "0")}
                                </span>
                                <span className="text-xs text-red-400/70 mt-1 uppercase">Secs</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tours.map((tour) => (
                        <div key={tour.id} className="relative group/flash">
                            {/* Flash Sale Badge */}
                            <div className="absolute top-4 left-4 z-20 bg-red-600 text-white font-black text-sm px-3 py-1.5 rounded shadow-lg transform -rotate-3 border border-red-400 flex items-center gap-1">
                                <Zap size={14} className="fill-white" />
                                FLASH SALE
                            </div>
                            {/* Original Price Strikethrough (Simulated logic since no db field) */}
                            <div className="absolute bottom-28 right-6 z-20 flex flex-col items-end pointer-events-none">
                                {tour.price_adult ? (
                                    <span className="text-sm text-red-200 line-through font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm mb-1">
                                        ${Math.round(tour.price_adult * 1.2)}
                                    </span>
                                ) : null}
                            </div>
                            
                            {/* We re-use TourCard but we make it look slightly distinct by wrapping it */}
                            <TourCard tour={tour} />
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/tours" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 border border-red-500 rounded-full font-bold text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/30">
                        View All Deals <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
