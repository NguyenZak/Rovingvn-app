// ============================================
// Media Library Page (Server Component)
// ============================================

import { getAllMedia } from './actions'
import MediaLibraryClient from './MediaLibraryClient'

export default async function MediaPage() {
    const media = await getAllMedia()

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thư viện Media</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {media.length} tệp tin
                    </p>
                </div>
            </div>

            {/* Client Component for upload and interactions */}
            <MediaLibraryClient initialMedia={media} />
        </div>
    )
}
