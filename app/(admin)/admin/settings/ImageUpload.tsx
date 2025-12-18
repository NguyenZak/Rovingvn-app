/**
 * Logo & Favicon Upload Component
 * Upload hình ảnh lên Cloudinary và lưu URL vào database
 */

"use client";

import { useState } from "react";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { updateLogo, updateFavicon } from "@/lib/actions/site-settings";

interface ImageUploadProps {
    label: string;
    currentUrl?: string;
    type: "logo" | "favicon";
    variant: "main" | "dark" | "small" | "text" | "ico" | "16" | "32" | "180" | "192" | "512";
    recommendedSize: string;
    onUploadSuccess?: (url: string) => void;
}

export function ImageUpload({
    label,
    currentUrl,
    type,
    variant,
    recommendedSize,
    onUploadSuccess,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(currentUrl || "");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn file hình ảnh");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("File quá lớn. Tối đa 5MB");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", type === "logo" ? "logos" : "favicons");
            formData.append("alt_text", label);

            // Dynamically import action
            const { uploadMedia } = await import("@/app/(admin)/admin/media/actions");
            const uploadResult = await uploadMedia(formData);

            if (!uploadResult.success || !uploadResult.data) {
                throw new Error(uploadResult.error || "Upload thất bại");
            }

            const uploadedUrl = uploadResult.data.url;

            // Save to database (update site settings)
            let result;
            if (type === "logo") {
                result = await updateLogo(
                    variant as "main" | "dark" | "small" | "text",
                    uploadedUrl
                );
            } else {
                result = await updateFavicon(
                    variant as "ico" | "16" | "32" | "180" | "192" | "512",
                    uploadedUrl
                );
            }

            if (result.success) {
                setImageUrl(uploadedUrl);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                onUploadSuccess?.(uploadedUrl);
            } else {
                throw new Error(result.error || "Lưu thất bại");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload thất bại");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                <span className="text-xs text-gray-500 ml-2">({recommendedSize})</span>
            </label>

            <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={label}
                            width={96}
                            height={96}
                            className="object-contain w-full h-full"
                        />
                    ) : (
                        <ImageIcon size={32} className="text-gray-400" />
                    )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                    <label
                        className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300
              text-sm font-medium cursor-pointer transition-colors
              ${uploading
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }
            `}
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                Đang upload...
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Chọn file
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>

                    {/* Status Messages */}
                    {success && (
                        <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                            <Check size={16} />
                            Upload thành công!
                        </div>
                    )}

                    {error && (
                        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <X size={16} />
                            {error}
                        </div>
                    )}

                    {/* Current URL */}
                    {imageUrl && !uploading && (
                        <div className="mt-2">
                            <a
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline break-all"
                            >
                                {imageUrl}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Logo & Favicon Manager Section
 * Quản lý tất cả logo và favicon
 */
interface LogoFaviconManagerProps {
    logos?: {
        main?: string;
        dark?: string;
        small?: string;
        text?: string;
    };
    favicons?: {
        ico?: string;
        icon16?: string;
        icon32?: string;
        icon180?: string;
        icon192?: string;
        icon512?: string;
    };
}

export function LogoFaviconManager({ logos, favicons }: LogoFaviconManagerProps) {
    return (
        <div className="space-y-8">
            {/* Logo Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload
                        label="Logo chính"
                        currentUrl={logos?.main}
                        type="logo"
                        variant="main"
                        recommendedSize="300x100px"
                    />

                    <ImageUpload
                        label="Logo Dark Mode"
                        currentUrl={logos?.dark}
                        type="logo"
                        variant="dark"
                        recommendedSize="300x100px"
                    />

                    <ImageUpload
                        label="Logo nhỏ (Mobile)"
                        currentUrl={logos?.small}
                        type="logo"
                        variant="small"
                        recommendedSize="100x100px"
                    />

                    <ImageUpload
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
                    <ImageUpload
                        label="Favicon ICO"
                        currentUrl={favicons?.ico}
                        type="favicon"
                        variant="ico"
                        recommendedSize="32x32px"
                    />

                    <ImageUpload
                        label="Favicon 16x16"
                        currentUrl={favicons?.icon16}
                        type="favicon"
                        variant="16"
                        recommendedSize="16x16px"
                    />

                    <ImageUpload
                        label="Favicon 32x32"
                        currentUrl={favicons?.icon32}
                        type="favicon"
                        variant="32"
                        recommendedSize="32x32px"
                    />

                    <ImageUpload
                        label="Apple Touch Icon"
                        currentUrl={favicons?.icon180}
                        type="favicon"
                        variant="180"
                        recommendedSize="180x180px"
                    />

                    <ImageUpload
                        label="Android 192x192"
                        currentUrl={favicons?.icon192}
                        type="favicon"
                        variant="192"
                        recommendedSize="192x192px"
                    />

                    <ImageUpload
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
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Mẹo:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Logo nên có nền trong suốt (PNG)</li>
                    <li>• Favicon được tạo tự động từ logo nhỏ bằng công cụ online</li>
                    <li>• Dùng <a href="https://realfavicongenerator.net/" target="_blank" className="underline">RealFaviconGenerator</a> để tạo tất cả favicon</li>
                    <li>• File tối đa 5MB</li>
                </ul>
            </div>
        </div>
    );
}
