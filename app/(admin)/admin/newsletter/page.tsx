import { NewsletterClient, Subscriber } from './NewsletterClient'
import { getSubscribers } from '@/lib/actions/newsletter-actions'

export const dynamic = 'force-dynamic'

export default async function NewsletterPage() {
    const rawData = await getSubscribers()

    // Type casting here since we know the shape from database
    const subscribers = (rawData || []) as Subscriber[]

    return (
        <div className="max-w-7xl mx-auto">
            <NewsletterClient initialSubscribers={subscribers} />
        </div>
    )
}
