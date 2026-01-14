'use client'

import { useState, useRef, useTransition } from 'react'
import { Upload, Trash2, X, Image as ImageIcon, Copy, Check, CheckCircle, XCircle } from 'lucide-react'
import { uploadMedia, deleteMedia } from './actions'

interface MediaItem {
    id: string
    filename: string
    url: string
    mime_type: string
    file_size: number
    alt_text: string | null
    created_at: string
}

interface MediaLibraryClientProps {
    initialMedia: MediaItem[]
}

interface Toast {
    id: number
    type: 'success' | 'error'
    message: string
}

export default function MediaLibraryClient({ initialMedia }: MediaLibraryClientProps) {
    const [media, setMedia] = useState<MediaItem[]>(initialMedia)
    const [isPending, startTransition] = useTransition()
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [toasts, setToasts] = useState<Toast[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const showToast = (type: 'success' | 'error', message: string) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, type, message }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }

    const [currentUpload, setCurrentUpload] = useState<{ filename: string, progress: number } | null>(null)

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        setUploading(true)

        for (const file of Array.from(files)) {
            setCurrentUpload({ filename: file.name, progress: 0 })

            try {
                // 1. Get Signature
                const signRes = await fetch('/api/media/sign', {
                    method: 'POST',
                    body: JSON.stringify({
                        folder: 'roving-vietnam/media'
                    })
                })

                if (!signRes.ok) throw new Error('Failed to get upload signature')
                const signData = await signRes.json()
                const { signature, timestamp, cloud_name, api_key, folder } = signData.data

                // 2. Upload to Cloudinary
                const result = await new Promise<{ success: boolean, data?: MediaItem, error?: string }>((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('api_key', api_key)
                    formData.append('timestamp', timestamp.toString())
                    formData.append('signature', signature)
                    formData.append('folder', folder)

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = Math.round((event.loaded / event.total) * 100)
                            setCurrentUpload({ filename: file.name, progress: percentComplete })
                        }
                    }

                    xhr.onload = async () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                const response = JSON.parse(xhr.responseText)

                                // 3. Save to Backend
                                const saveRes = await fetch('/api/media/upload', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        public_id: response.public_id,
                                        secure_url: response.secure_url,
                                        filename: file.name,
                                        mime_type: file.type || 'image/jpeg',
                                        bytes: response.bytes,
                                        width: response.width,
                                        height: response.height,
                                        alt_text: file.name
                                    })
                                })

                                if (saveRes.ok) {
                                    const savedData = await saveRes.json()
                                    resolve(savedData)
                                } else {
                                    reject('Failed to save to database')
                                }

                            } catch (e) {
                                reject('Invalid response from Cloudinary')
                            }
                        } else {
                            try {
                                const response = JSON.parse(xhr.responseText)
                                reject(response.error?.message || 'Upload failed')
                            } catch {
                                reject('Upload failed')
                            }
                        }
                    }

                    xhr.onerror = () => reject('Network error during upload')

                    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`)
                    xhr.send(formData)
                })

                if (result.success && result.data) {
                    // Add to local state
                    const newMedia: MediaItem = {
                        id: result.data.id,
                        filename: file.name,
                        url: result.data.url,
                        mime_type: file.type || 'image/jpeg',
                        file_size: file.size,
                        alt_text: file.name,
                        created_at: new Date().toISOString()
                    }
                    setMedia(prev => [newMedia, ...prev])
                    showToast('success', `Đã tải lên: ${file.name}`)
                } else {
                    showToast('error', result.error || 'Tải lên thất bại')
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error)
                showToast('error', `Lỗi tải lên ${file.name}: ${msg}`)
            }
        }

        setCurrentUpload(null)
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDelete = async (mediaId: string) => {
        if (!confirm('Bạn có chắc muốn xoá ảnh này?')) return

        startTransition(async () => {
            const result = await deleteMedia(mediaId)

            if (result.success) {
                setMedia(prev => prev.filter(m => m.id !== mediaId))
                if (selectedMedia?.id === mediaId) {
                    setSelectedMedia(null)
                }
            } else {
                alert(result.error || 'Xoá thất bại')
            }
        })
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        handleUpload(e.dataTransfer.files)
    }

    const copyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handleUpload(e.target.files)}
                    className="hidden"
                />

                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />

                <p className="text-gray-600 mb-2">
                    Kéo thả file vào đây hoặc{' '}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        disabled={uploading}
                    >
                        click để chọn
                    </button>
                </p>

                <p className="text-sm text-gray-500">
                    JPG, PNG, WebP, GIF - Tối đa 5MB
                </p>

                {uploading && (
                    <div className="mt-4 max-w-md mx-auto">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>{currentUpload?.filename || 'Đang tải lên...'}</span>
                            <span>{currentUpload?.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${currentUpload?.progress || 0}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Media Grid */}
            <div className="bg-white rounded-lg shadow">
                {media.length === 0 ? (
                    <div className="p-12 text-center">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Chưa có media nào</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Tải lên ảnh đầu tiên của bạn
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                        {media.map((item) => (
                            <div
                                key={item.id}
                                className={`relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedMedia?.id === item.id
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-transparent hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedMedia(item)}
                            >
                                <div className="aspect-square bg-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.url}
                                        alt={item.alt_text || item.filename}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            copyUrl(item.url, item.id)
                                        }}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                        title="Copy URL"
                                    >
                                        {copiedId === item.id ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(item.id)
                                        }}
                                        className="p-2 bg-white rounded-full hover:bg-red-50"
                                        title="Xoá"
                                        disabled={isPending}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Media Details Modal */}
            {selectedMedia && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-semibold text-gray-900">Chi tiết Media</h3>
                            <button
                                onClick={() => setSelectedMedia(null)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="bg-gray-100 rounded-lg overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedMedia.url}
                                    alt={selectedMedia.alt_text || selectedMedia.filename}
                                    className="max-h-80 mx-auto object-contain"
                                />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-500">Tên file</label>
                                    <p className="font-medium text-gray-700">{selectedMedia.filename}</p>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={selectedMedia.url}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-gray-50 border rounded text-sm"
                                        />
                                        <button
                                            onClick={() => copyUrl(selectedMedia.url, selectedMedia.id)}
                                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            {copiedId === selectedMedia.id ? 'Đã copy!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500">Kích thước</label>
                                        <p className="font-medium text-gray-700">{formatFileSize(selectedMedia.file_size)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Loại</label>
                                        <p className="font-medium text-gray-700">{selectedMedia.mime_type}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">Ngày tải lên</label>
                                    <p className="font-medium text-gray-700">
                                        {new Date(selectedMedia.created_at).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => handleDelete(selectedMedia.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    disabled={isPending}
                                >
                                    Xoá ảnh
                                </button>
                                <button
                                    onClick={() => setSelectedMedia(null)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-up ${toast.type === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <XCircle className="w-5 h-5" />
                        )}
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
