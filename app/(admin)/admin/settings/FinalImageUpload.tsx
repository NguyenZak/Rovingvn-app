/**
 * Simple Logo & Favicon Manager (No Upload)
 * Chỉ hỗ trợ: URL input hoặc chọn từ Media Library
 */

"use client"

import { useState } from "react"
import { Save, Image as ImageIcon, Link as LinkIcon, FolderOpen } from "lucide-react"
import Image from "next/image"
import { updateLogo, updateFavicon } from "@/lib/actions/site-settings"
import { toast } from "sonner"

interface SimpleImageInputProps {
    label: string
    currentUrl?: string
    type: "logo" | "favicon"
    variant: "main" | "dark" | "small" | "text" | "ico" | "16" | "32" | "180" | "192" | "512"
    recommendedSize: string
}

function SimpleImageInput({
    label,
    currentUrl,
    type,
    variant,
    recommendedSize,
}: SimpleImageInputProps) {
    const [url, setUrl] = useState(currentUrl || "")
    const [saving, setSaving] = useState(false)
    const [mode, setMode] = useState<"url" | "media">("url")

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

    const openMediaPicker = () => {
        window.open('/admin/media?picker=true', 'mediaPicker', 'width=1200,height=800')
        toast.info("Chọn ảnh từ Media Library, sau đó copy URL và paste vào đây")
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
                            onClick={() => setMode("media")}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${mode === "media"
                                    ? "text-emerald-600 border-b-2 border-emerald-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <FolderOpen size={14} className="inline mr-1" />
                            Media Library
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

                    {/* Media Library Mode */}
                    {mode === "media" && (
                        <div className="space-y-2">
                            <button
                                onClick={openMediaPicker}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FolderOpen size={16} />
                                Mở Media Library
                            </button>
                            <p className="text-xs text-gray-500">
                                1. Click nút trên để mở Media Library<br />
                                2. Click vào ảnh để xem chi tiết<br />
                                3. Copy URL từ media library<br />
                                4. Quay lại tab URL và paste
                            </p>
                        </div>
                    )}

                    {/* Current URL Display */}
                    {url && (
                        <div className="text-xs text-gray-500 break-all">
                            <span className="font-medium">URL:</span> {url}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

interface FinalLogoFaviconManagerProps {
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

export function FinalLogoFaviconManager({ logos, favicons }: FinalLogoFaviconManagerProps) {
    return (
        <div className="space-y-8">
            {/* Logo Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SimpleImageInput
                        label="Logo chính"
                        currentUrl={logos?.main}
                        type="logo"
                        variant="main"
                        recommendedSize="300x100px"
                    />

                    <SimpleImageInput
                        label="Logo Dark Mode"
                        currentUrl={logos?.dark}
                        type="logo"
                        variant="dark"
                        recommendedSize="300x100px"
                    />

                    <SimpleImageInput
                        label="Logo nhỏ (Mobile)"
                        currentUrl={logos?.small}
                        type="logo"
                        variant="small"
                        recommendedSize="100x100px"
                    />

                    <SimpleImageInput
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
                    <SimpleImageInput
                        label="Favicon ICO"
                        currentUrl={favicons?.ico}
                        type="favicon"
                        variant="ico"
                        recommendedSize="32x32px"
                    />

                    <SimpleImageInput
                        label="Favicon 16x16"
                        currentUrl={favicons?.icon16}
                        type="favicon"
                        variant="16"
                        recommendedSize="16x16px"
                    />

                    <SimpleImageInput
                        label="Favicon 32x32"
                        currentUrl={favicons?.icon32}
                        type="favicon"
                        variant="32"
                        recommendedSize="32x32px"
                    />

                    <SimpleImageInput
                        label="Apple Touch Icon"
                        currentUrl={favicons?.icon180}
                        type="favicon"
                        variant="180"
                        recommendedSize="180x180px"
                    />

                    <SimpleImageInput
                        label="Android 192x192"
                        currentUrl={favicons?.icon192}
                        type="favicon"
                        variant="192"
                        recommendedSize="192x192px"
                    />

                    <SimpleImageInput
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
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Cách thêm ảnh:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li><strong>Cách 1 - Upload vào Media Library:</strong>
                        <ol className="ml-4 mt-1 space-y-1">
                            <li>1. Vào <a href="/admin/media" target="_blank" className="underline">Media Library</a></li>
                            <li>2. Upload ảnh</li>
                            <li>3. Click vào ảnh, copy URL</li>
                            <li>4. Quay lại Settings, paste URL</li>
                        </ol>
                    </li>
                    <li><strong>Cách 2 - Dùng link bên ngoài:</strong>
                        <ol className="ml-4 mt-1 space-y-1">
                            <li>1. Upload lên <a href="https://imgur.com" target="_blank" className="underline">Imgur</a> hoặc <a href="https://imgbb.com" target="_blank" className="underline">ImgBB</a></li>
                            <li>2. Copy URL ảnh</li>
                            <li>3. Paste vào tab URL</li>
                        </ol>
                    </li>
                    <li>• Logo nên có nền trong suốt (PNG)</li>
                </ul>
            </div>
        </div>
    )
}
