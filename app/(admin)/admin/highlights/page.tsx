
import { getHighlights } from "@/lib/actions/highlight-actions";
import { getSiteSettings } from "@/lib/actions/site-settings";
import { HighlightsClient } from "./HighlightsClient";

export const metadata = {
    title: "Cultural Highlights | Admin",
    description: "Manage highlights on the homepage",
};

export const dynamic = 'force-dynamic';

export default async function HighlightsPage() {
    const [highlights, settings] = await Promise.all([
        getHighlights(),
        getSiteSettings()
    ]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <HighlightsClient initialHighlights={highlights} initialSettings={settings} />
        </div>
    );
}
