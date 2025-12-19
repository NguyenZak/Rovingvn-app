/**
 * Advanced Logo & Favicon Manager
 * Hỗ trợ: URL input, Upload file, hoặc chọn từ Media Library
 */

"use client"

import { useState } from "react"
import { Save, Upload, Image as ImageIcon, Link as LinkIcon, FolderOpen } from "lucide-react"
import Image from "next/image"
import { updateLogo, updateFavicon } from "@/lib/actions/site-settings"
import { toast } from "sonner"

interface AdvancedImageInputProps {
    label: string
    currentUrl?: string
    type: "logo" | "favicon"
    variant: "main" | "dark" | "small" | "text" | "ico" | "16" | "32" | "180" | "192" | "512"
    recommendedSize: string
}

function AdvancedImageInput({
    label,
    currentUrl,
    type,
    variant,
    recommendedSize,
}: AdvancedImageInputProps) {
    const [url, setUrl] = useState(currentUrl || "")
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [mode, setMode] = useState<"url" | "upload" | "media">("url")

    const handleSave = async (imageUrl: string) => {
        if (!imageUrl.trim()) {
            toast.error("Vui lòng nhập URL hoặc chọn ảnh")
            return
        }

        setSaving(true)
        try {
            let result
            if (type === "logo") {
                result = await updateLogo(
                    variant as "main" | "dark" | "small" | "text",
                    imageUrl
                )
            } else {
                result = await updateFavicon(
                    variant as "ico" | "16" | "32" | "180" | "192" | "512",
                    imageUrl
                )
            }

            if (result.success) {
                setUrl(imageUrl)
                toast.success("Đã lưu thành công!")
            } else {
                toast.error(result.error || "Lưu thất bại")
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra")
        } finally {
            setSaving(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file hình ảnh")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File quá lớn. Tối đa 5MB")
            return
        }

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", type === "logo" ? "logos" : "favicons")
            formData.append("alt_text", label)

            const { uploadMedia } = await import("@/app/(admin)/admin/media/actions")
            const uploadResult = await uploadMedia(formData)

            if (!uploadResult.success || !uploadResult.data) {
                throw new Error(uploadResult.error || "Upload thất bại")
            }

            const uploadedUrl = uploadResult.data.url
            await handleSave(uploadedUrl)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload thất bại")
        } finally {
            setUploading(false)
        }
    }

    const openMediaPicker = () => {
        // Open media library in new window
        const mediaWindow = window.open('/admin/media', 'mediaPicker', 'width=1200,height=800')

        // Listen for media selection
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'MEDIA_SELECTED') {
                setUrl(event.data.url)
                handleSave(event.data.url)
                window.removeEventListener('message', handleMessage)
            }
        }

        window.addEventListener('message', handleMessage)

        // Cleanup if window is closed
        const checkClosed = setInterval(() => {
            if (mediaWindow?.closed) {
                window.removeEventListener('message', handleMessage)
                clearInterval(checkClosed)
            }
        }, 500)
    }

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                <span className="text-xs text-gray-500 ml-2">({recommendedSize})</span>
            </label>

            <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
                    {url ? (
                        <Image
                            src={url}
                            alt={label}
                            width={96}
                            height={96}
                            className="object-contain w-full h-full"
                            unoptimized
                        />
                    ) : (
                        <ImageIcon size={32} className="text-gray-400" />
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-1 space-y-3">
                    {/* Mode Tabs */}
                    <div className="flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setMode("url")}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${mode === "url"
                                    ? "text-emerald-600 border-b-2 border-emerald-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <LinkIcon size={14} className="inline mr-1" />
                            URL
                        </button>
                        <button
                            onClick={() => setMode("upload")}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${mode === "upload"
                                    ? "text-emerald-600 border-b-2 border-emerald-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <Upload size={14} className="inline mr-1" />
                            Upload
                        </button>
                        <button
                            onClick={() => setMode("media")}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${mode === "media"
                                    ? "text-emerald-600 border-b-2 border-emerald-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <FolderOpen size={14} className="inline mr-1" />
                            Media
                        </button>
                    </div>

                    {/* URL Input Mode */}
                    {mode === "url" && (
                        <div className="space-y-2">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/image.png"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <button
                                onClick={() => handleSave(url)}
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {saving ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    )}

                    {/* Upload Mode */}
                    {mode === "upload" && (
                        <div>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload size={16} />
                                {uploading ? "Đang upload..." : "Chọn file"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">Tối đa 5MB</p>
                        </div>
                    )}

                    {/* Media Library Mode */}
                    {mode === "media" && (
                        <div>
                            <button
                                onClick={openMediaPicker}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FolderOpen size={16} />
                                Chọn từ Media Library
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                                Mở cửa sổ mới để chọn ảnh từ thư viện
                            </p>
                        </div>
                    )}

                    {/* Current URL Display */}
                    {url && (
                        <div className="text-xs text-gray-500 break-all">
                            <span className="font-medium">URL hiện tại:</span> {url}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

interface AdvancedLogoFaviconManagerProps {
    logos?: {
        main?: string
        dark?: string
        small?: string
        text?: string
    }
    favicons?: {
        ico?: string
        icon16?: string
        icon32?: string
        icon180?: string
        icon192?: string
        icon512?: string
    }
}

export function AdvancedLogoFaviconManager({ logos, favicons }: AdvancedLogoFaviconManagerProps) {
    return (
        <div className="space-y-8">
            {/* Logo Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AdvancedImageInput
                        label="Logo chính"
                        currentUrl={logos?.main}
                        type="logo"
                        variant="main"
                        recommendedSize="300x100px"
                    />

                    <AdvancedImageInput
                        label="Logo Dark Mode"
                        currentUrl={logos?.dark}
                        type="logo"
                        variant="dark"
                        recommendedSize="300x100px"
                    />

                    <AdvancedImageInput
                        label="Logo nhỏ (Mobile)"
                        currentUrl={logos?.small}
                        type="logo"
                        variant="small"
                        recommendedSize="100x100px"
                    />

                    <AdvancedImageInput
                        label="Logo Text"
                        currentUrl={logos?.text}
                        type="logo"
                        variant="text"
                        recommendedSize="400x100px"
                    />
                </div>
            </div>

            {/* Favicon Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Favicon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AdvancedImageInput
                        label="Favicon ICO"
                        currentUrl={favicons?.ico}
                        type="favicon"
                        variant="ico"
                        recommendedSize="32x32px"
                    />

                    <AdvancedImageInput
                        label="Favicon 16x16"
                        currentUrl={favicons?.icon16}
                        type="favicon"
                        variant="16"
                        recommendedSize="16x16px"
                    />

                    <AdvancedImageInput
                        label="Favicon 32x32"
                        currentUrl={favicons?.icon32}
                        type="favicon"
                        variant="32"
                        recommendedSize="32x32px"
                    />

                    <AdvancedImageInput
                        label="Apple Touch Icon"
                        currentUrl={favicons?.icon180}
                        type="favicon"
                        variant="180"
                        recommendedSize="180x180px"
                    />

                    <AdvancedImageInput
                        label="Android 192x192"
                        currentUrl={favicons?.icon192}
                        type="favicon"
                        variant="192"
                        recommendedSize="192x192px"
                    />

                    <AdvancedImageInput
                        label="Android 512x512"
                        currentUrl={favicons?.icon512}
                        type="favicon"
                        variant="512"
                        recommendedSize="512x512px"
                    />
                </div>
            </div>

            {/* Helper Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 3 cách thêm ảnh:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>URL</strong>: Paste link ảnh từ Imgur, ImgBB, v.v.</li>
                    <li>• <strong>Upload</strong>: Upload file trực tiếp (tối đa 5MB)</li>
                    <li>• <strong>Media</strong>: Chọn từ Media Library có sẵn</li>
                    <li>• Logo nên có nền trong suốt (PNG)</li>
                </ul>
            </div>
        </div>
    )
}
