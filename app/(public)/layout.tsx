import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/actions/site-settings'

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const settings = await getSiteSettings()

    return (
        <div className="flex flex-col min-h-screen">
            <Header
                siteName={settings?.site_name}
                logoUrl={settings?.logo_main}
            />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}
