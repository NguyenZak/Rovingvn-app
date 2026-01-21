'use client'

import { useState } from 'react'
import { Trash2, Mail, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

import { deleteSubscriber, sendNewsletter, getSubscribers } from '@/lib/actions/newsletter-actions'
import { toast } from 'sonner'
import { EMAIL_TEMPLATES } from '@/lib/constants/email-templates'

export type Subscriber = {
    id: string
    email: string
    status: string
    created_at: string
}

export function NewsletterClient({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
    const [selectedEmails, setSelectedEmails] = useState<string[]>([])
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [emailSubject, setEmailSubject] = useState('')
    const [emailContent, setEmailContent] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Filter selections
    const toggleSelectAll = () => {
        if (selectedEmails.length === subscribers.length) {
            setSelectedEmails([])
        } else {
            setSelectedEmails(subscribers.map(s => s.email))
        }
    }

    const toggleSelectOne = (email: string) => {
        if (selectedEmails.includes(email)) {
            setSelectedEmails(selectedEmails.filter(e => e !== email))
        } else {
            setSelectedEmails([...selectedEmails, email])
        }
    }

    const refreshData = async () => {
        setIsRefreshing(true)
        try {
            const freshData = await getSubscribers()
            setSubscribers(freshData as Subscriber[])
            toast.success('List updated')
        } catch (error) {
            toast.error('Failed to refresh list')
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email}?`)) return

        const result = await deleteSubscriber(id)
        if (result.success) {
            setSubscribers(subscribers.filter(s => s.id !== id))
            setSelectedEmails(selectedEmails.filter(e => e !== email))
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
    }

    const handleSendEmail = async () => {
        if (!emailSubject || !emailContent) {
            toast.error('Please fill in subject and content')
            return
        }

        setIsSending(true)
        const result = await sendNewsletter({
            subject: emailSubject,
            content: emailContent,
            recipients: selectedEmails
        })
        setIsSending(false)

        if (result.success) {
            toast.success(result.message)
            setShowEmailModal(false)
            setEmailSubject('')
            setEmailContent('')
            setSelectedEmails([])
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
                    <p className="text-gray-500">Manage your valuable audience ({subscribers.length} total)</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:animate-spin"
                        title="Refresh list"
                    >
                        <RefreshCw size={20} />
                    </button>

                    <button
                        onClick={() => setShowEmailModal(true)}
                        disabled={selectedEmails.length === 0}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Mail size={18} />
                        Send Email ({selectedEmails.length})
                    </button>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={subscribers.length > 0 && selectedEmails.length === subscribers.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                </th>
                                <th className="p-4 font-semibold text-gray-700">Email</th>
                                <th className="p-4 font-semibold text-gray-700">Status</th>
                                <th className="p-4 font-semibold text-gray-700">Subscribed At</th>
                                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No subscribers yet.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmails.includes(sub.email)}
                                                onChange={() => toggleSelectOne(sub.email)}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{sub.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'subscribed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.id, sub.email)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                title="Delete Subscriber"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Send Newsletter</h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex gap-2 items-start">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <p>You are about to send an email to <strong>{selectedEmails.length}</strong> subscribers. Please ensure your content is correct.</p>
                            </div>

                            {/* Template Selector */}
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-emerald-800 mb-2">Load a Template</label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 px-3 py-2 rounded border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        onChange={(e) => {
                                            const templateId = e.target.value
                                            const template = EMAIL_TEMPLATES.find(t => t.id === templateId)
                                            if (template) {
                                                setEmailSubject(template.subject)
                                                setEmailContent(template.content)
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select a template...</option>
                                        {EMAIL_TEMPLATES.map(t => (
                                            <option key={t.id} value={t.id}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="Enter subject..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML supported)</label>
                                <textarea
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                    rows={10}
                                    placeholder="Write your newsletter content here..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono text-sm"
                                />
                                <div className="flex justify-between items-start mt-1">
                                    <p className="text-xs text-gray-500">Supported HTML: &lt;b&gt;, &lt;i&gt;, &lt;br&gt;, &lt;a&gt;, etc.</p>
                                    <p className="text-xs text-emerald-600 font-medium">✨ Use <code className="bg-emerald-50 px-1 rounded">{"{{name}}"}</code> to insert subscriber's name automatically.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendEmail}
                                disabled={isSending || !emailSubject || !emailContent}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {isSending ? (
                                    <>Sending...</>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
