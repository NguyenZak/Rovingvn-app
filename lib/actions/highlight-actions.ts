
"use server";

import { createClient, createPublicClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Highlight {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    bg: string;
    display_order: number;
    created_at?: string;
}

/**
 * Get all highlights (public)
 */
export async function getHighlights(): Promise<Highlight[]> {
    try {
        const supabase = await createPublicClient();
        const { data, error } = await supabase
            .from("highlights")
            .select("*")
            .order("display_order", { ascending: true });

        if (error) {
            console.error("Error fetching highlights:", error);
            return [];
        }

        return data as Highlight[];
    } catch (error) {
        console.error("Error in getHighlights:", error);
        return [];
    }
}

/**
 * Create a new highlight
 */
export async function createHighlight(highlight: Omit<Highlight, "id" | "created_at">) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const { data, error } = await supabase
            .from("highlights")
            .insert(highlight)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/");
        revalidatePath("/admin/highlights");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Internal server error" };
    }
}

/**
 * Update a highlight
 */
export async function updateHighlight(id: string, highlight: Partial<Highlight>) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const { data, error } = await supabase
            .from("highlights")
            .update(highlight)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/");
        revalidatePath("/admin/highlights");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Internal server error" };
    }
}

/**
 * Delete a highlight
 */
export async function deleteHighlight(id: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const { error } = await supabase
            .from("highlights")
            .delete()
            .eq("id", id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/");
        revalidatePath("/admin/highlights");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Internal server error" };
    }
}
