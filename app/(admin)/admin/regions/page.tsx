import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import { getRegions } from '@/lib/actions/region-actions'
import { DeleteRegionButton } from '@/components/features/cms/DeleteRegionButton' // Ensure this component is created

export default async function AdminRegionsPage() {
    const { data: regions, error } = await getRegions()

    if (error) {
        return <div className="p-4 text-red-500">Error loading regions: {error}</div>
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Regions</h1>
                <Link
                    href="/admin/regions/new"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={20} /> Add Region
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Description</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Display Order</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {regions?.map((region) => (
                            <tr key={region.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{region.name}</td>
                                <td className="py-3 px-4 text-gray-600">{region.description}</td>
                                <td className="py-3 px-4 text-gray-600">{region.display_order}</td>
                                <td className="py-3 px-4">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/regions/${region.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <DeleteRegionButton id={region.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {regions?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                    No regions found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
