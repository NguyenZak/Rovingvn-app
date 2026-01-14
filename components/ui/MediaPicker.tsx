'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { uploadMedia } from '@/app/(admin)/admin/media/actions'
import Image from 'next/image'

export interface MediaItem {
    id: string
    url: string
    filename: string
    alt_text?: string
}

interface MediaPickerProps {
    value?: string | string[]
    onChange: (url: string | string[]) => void
    onSelectMedia?: (media: MediaItem | MediaItem[]) => void
    label?: string
    name?: string
    children?: React.ReactNode // Custom trigger support
    compact?: boolean // For smaller layouts
    multiple?: boolean
}

export default function MediaPicker({ value, onChange, onSelectMedia, label, name, children, compact = false, multiple = false }: MediaPickerProps) {
    const [showLibrary, setShowLibrary] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [media, setMedia] = useState<MediaItem[]>([])
    const [loadingLibrary, setLoadingLibrary] = useState(false)
    const [selectedInLibrary, setSelectedInLibrary] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        setUploading(true)
        const uploadedUrls: string[] = []
        const uploadedItems: MediaItem[] = []
        const errors: string[] = []

        // Process sequentially to simpler error handling, could be parallel
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const formData = new FormData()
            formData.append('file', file)
            formData.append('alt_text', file.name)

            const result = await uploadMedia(formData)

            if (result.success && result.data) {
                uploadedUrls.push(result.data.url)
                // Construct MediaItem from result
                uploadedItems.push({
                    id: result.data.id,
                    url: result.data.url,
                    filename: file.name,
                    alt_text: file.name
                })
            } else {
                errors.push(`${file.name}: ${result.error}`)
            }
        }

        if (errors.length > 0) {
            alert(`Some files failed to upload:\n${errors.join('\n')}`)
        }

        if (uploadedUrls.length > 0) {
            if (multiple) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange(uploadedUrls as any)
                if (onSelectMedia) onSelectMedia(uploadedItems)
            } else {
                onChange(uploadedUrls[0])
                if (onSelectMedia && uploadedItems.length > 0) onSelectMedia(uploadedItems[0])
            }
            setShowLibrary(false)
        }

        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const openLibrary = async () => {
        setShowLibrary(true)
        setSelectedInLibrary([]) // Reset selection
        setLoadingLibrary(true)
        // Fetch media from library
        try {
            const res = await fetch('/api/media')
            if (res.ok) {
                const data = await res.json()
                setMedia(data)
            }
        } catch (error) {
            console.error('Failed to load media library', error)
        } finally {
            setLoadingLibrary(false)
        }
    }

    const handleLibrarySelect = () => {
        if (selectedInLibrary.length === 0) return

        // Find full objects for selected URLs
        const selectedItems = media.filter(item => selectedInLibrary.includes(item.url))

        if (multiple) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange(selectedInLibrary as any)
            if (onSelectMedia) onSelectMedia(selectedItems)
        } else {
            onChange(selectedInLibrary[0])
            if (onSelectMedia && selectedItems.length > 0) onSelectMedia(selectedItems[0])
        }
        setShowLibrary(false)
    }

    // Custom Trigger Logic
    if (children) {
        return (
            <>
                <div onClick={openLibrary} className="cursor-pointer">
                    {children}
                </div>

                {/* Hidden Inputs for upload handling logic via modal or direct */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={(e) => handleUpload(e.target.files)}
                    className="hidden"
                />

                {name && !multiple && <input type="hidden" name={name} value={value as string || ''} />}

                {/* Re-use generic modal */}
                <MediaLibraryModal
                    show={showLibrary}
                    onClose={() => setShowLibrary(false)}
                    media={media}
                    loading={loadingLibrary}
                    onSelect={(url) => {
                        if (multiple) {
                            setSelectedInLibrary(prev =>
                                prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
                            )
                        } else {
                            onChange(url)
                            // Find and pass the full media object
                            const selectedItem = media.find(item => item.url === url)
                            if (selectedItem && onSelectMedia) {
                                onSelectMedia(selectedItem)
                            }
                            setShowLibrary(false)
                        }
                    }}
                    selected={selectedInLibrary}
                    multiple={multiple}
                    onConfirmSelect={handleLibrarySelect}
                    onUploadClick={() => fileInputRef.current?.click()}
                    uploading={uploading}
                    onDrop={(files) => handleUpload(files)}
                />
            </>
        )
    }

    // Default UI
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

            {/* Preview Area or Placeholder */}
            {value && !Array.isArray(value) ? (
                <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                    <Image
                        src={value as string}
                        alt="Selected media"
                        fill
                        className="object-contain"
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={openLibrary}
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Change Image
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove image"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group flex flex-col items-center justify-center text-center ${compact ? 'p-4' : 'p-8'}`}
                    onClick={openLibrary}
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-emerald-100 text-gray-400 group-hover:text-emerald-600 flex items-center justify-center mb-3 transition-colors">
                        <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                        {multiple ? 'Click to select or drop multiple images' : 'Click to select or upload image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, WebP up to 5MB
                    </p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={(e) => handleUpload(e.target.files)}
                className="hidden"
            />
            {name && !multiple && <input type="hidden" name={name} value={value as string || ''} />}

            {/* Modal */}
            <MediaLibraryModal
                show={showLibrary}
                onClose={() => setShowLibrary(false)}
                media={media}
                loading={loadingLibrary}
                onSelect={(url) => {
                    if (multiple) {
                        setSelectedInLibrary(prev =>
                            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
                        )
                    } else {
                        onChange(url)
                        // Find and pass the full media object
                        const selectedItem = media.find(item => item.url === url)
                        if (selectedItem && onSelectMedia) {
                            onSelectMedia(selectedItem)
                        }
                        setShowLibrary(false)
                    }
                }}
                selected={selectedInLibrary}
                multiple={multiple}
                onConfirmSelect={handleLibrarySelect}
                onUploadClick={() => fileInputRef.current?.click()}
                uploading={uploading}
                onDrop={(files) => handleUpload(files)}
            />
        </div>
    )
}



interface MediaLibraryModalProps {
    show: boolean
    onClose: () => void
    media: MediaItem[]
    loading: boolean
    onSelect: (url: string) => void
    selected?: string[]
    multiple?: boolean
    onConfirmSelect?: () => void
    onUploadClick: () => void
    uploading: boolean
    onDrop?: (files: FileList) => void
}

// Separated Modal Component for cleaner code
function MediaLibraryModal({ show, onClose, media, loading, onSelect, selected = [], multiple, onConfirmSelect, onUploadClick, uploading, onDrop }: MediaLibraryModalProps) {
    const [dragging, setDragging] = useState(false)

    if (!show) return null

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop?.(e.dataTransfer.files)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Drag Overlay */}
                {dragging && (
                    <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-500 border-dashed z-50 flex items-center justify-center backdrop-blur-sm rounded-xl m-2 pointer-events-none">
                        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                            <Upload size={48} className="text-emerald-600 mb-2" />
                            <p className="text-lg font-semibold text-emerald-700">Drop files to upload</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Media Library</h3>
                        <p className="text-sm text-gray-500">
                            {multiple ? 'Select multiple images' : 'Select an image'} or drag & drop to upload
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {multiple && selected.length > 0 && (
                            <button
                                onClick={onConfirmSelect}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors"
                            >
                                Insert {selected.length} Images
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {media.length} items found
                    </div>
                    <button
                        type="button"
                        onClick={onUploadClick}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {uploading ? 'Uploading...' : 'Upload New'}
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
                            <Loader2 size={32} className="animate-spin text-emerald-600" />
                            <p>Loading media library...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {media.map((item: MediaItem) => {
                                const isSelected = selected.includes(item.url)
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => onSelect(item.url)}
                                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none 
                                        ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'}
                                    `}
                                    >
                                        <Image
                                            src={item.url}
                                            alt={item.alt_text || item.filename}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm z-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            </div>
                                        )}
                                        {!isSelected && multiple && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white bg-black/20 group-hover:bg-black/40 transition-colors" />
                                        )}
                                    </button>
                                )
                            })}
                            {media.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                                    <ImageIcon size={48} className="text-gray-300 mb-3" />
                                    <p className="font-medium">No media found</p>
                                    <p className="text-sm mb-4">Upload your first image to get started</p>
                                    <button
                                        type="button"
                                        onClick={onUploadClick}
                                        className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                                    >
                                        Upload Image
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
