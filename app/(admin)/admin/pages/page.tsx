import { getAllPages } from '@/lib/actions/page-actions'
import Link from 'next/link'
import { FileText, Edit, Plus } from 'lucide-react'

export const metadata = {
    title: 'Pages | Roving Admin',
    description: 'Manage static pages content'
}

export const dynamic = 'force-dynamic'

export default async function PagesPage() {
    const result = await getAllPages()
    const pages = result.data || []

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
                    <p className="text-gray-600 mt-1">Manage static page content</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={20} />
                    Create New Page
                </Link>
            </div>

            {pages.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
                    <p className="text-gray-500">Pages will appear here</p>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {pages.map((page: any) => (
                                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <FileText size={18} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{page.title}</div>
                                                <div className="text-sm text-gray-500">{page.meta_title || 'No meta title'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">/{page.slug}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            {new Date(page.updated_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/pages/${page.slug}/edit`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
