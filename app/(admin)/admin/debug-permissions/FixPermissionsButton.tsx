"use client";

import { useState } from "react";
import { repairRBACSystem } from "@/lib/actions/rbac-actions";
import { Loader2, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export function FixPermissionsButton() {
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleFix = async () => {
        if (!confirm("This will repair the entire RBAC system: Create missing permissions, reset admin rights, and assign them to YOU. Continue?")) return;

        setIsPending(true);
        setMessage(null);

        try {
            const result = await repairRBACSystem();
            if (result.success) {
                setMessage("System Repaired Successfully!");
                router.refresh();
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch {
            setMessage("An unexpected error occurred");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {message && (
                <span className={`text-sm font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                    {message}
                </span>
            )}
            <button
                onClick={handleFix}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm font-medium"
            >
                {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Wrench size={16} />
                )}
                Repair System & Grant Full Access
            </button>
        </div>
    );
}
