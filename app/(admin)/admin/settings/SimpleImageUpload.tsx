/**
 * Simple Logo & Favicon Manager
 * Cho phép nhập URL trực tiếp thay vì upload
 */

"use client"

import { useState } from "react"
import { Save, Image as ImageIcon } from "lucide-react"
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

    const handleSave = async () => {
        if (!url.trim()) {
            toast.error("Vui lòng nhập URL")
            return
        }

        setSaving(true)
        try {
            let result
            if (type === "logo") {
                result = await updateLogo(
                    variant as "main" | "dark" | "small" | "text",
                    url
                )
            } else {
                result = await updateFavicon(
                    variant as "ico" | "16" | "32" | "180" | "192" | "512",
                    url
                )
            }

            if (result.success) {
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

                {/* URL Input */}
                <div className="flex-1 space-y-2">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    )
}

interface SimpleLogoFaviconManagerProps {
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

export function SimpleLogoFaviconManager({ logos, favicons }: SimpleLogoFaviconManagerProps) {
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
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Hướng dẫn:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload ảnh lên <a href="https://imgur.com" target="_blank" className="underline">Imgur</a> hoặc <a href="https://imgbb.com" target="_blank" className="underline">ImgBB</a></li>
                    <li>• Copy URL ảnh và paste vào ô input</li>
                    <li>• Click "Lưu" để cập nhật</li>
                    <li>• Logo nên có nền trong suốt (PNG)</li>
                    <li>• Dùng <a href="https://realfavicongenerator.net/" target="_blank" className="underline">RealFaviconGenerator</a> để tạo favicon</li>
                </ul>
            </div>
        </div>
    )
}
