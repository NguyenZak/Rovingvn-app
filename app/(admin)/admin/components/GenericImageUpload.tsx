/**
 * Generic Image Upload Component
 * Uploads images to Cloudinary and returns the URL
 */

"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface GenericImageUploadProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    folder?: string; // Cloudinary folder
    className?: string;
    recommendedSize?: string;
}

export function GenericImageUpload({
    label,
    value,
    onChange,
    folder = "tours",
    className = "",
    recommendedSize
}: GenericImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn file hình ảnh");
            return;
        }

        // Validate file size (max 5MB) - server action has 10MB limit but we keep client check safe
        if (file.size > 5 * 1024 * 1024) {
            setError("File quá lớn. Tối đa 5MB");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            formData.append("alt_text", label || file.name);

            // Import dynamically or assume it's available via props/actions
            // Since this is a client component, we need to import the action.
            // Note: We need to add the import statement at the top of the file as well.
            const { uploadMedia } = await import("@/app/(admin)/admin/media/actions");

            const result = await uploadMedia(formData);

            if (!result.success || !result.data) {
                throw new Error(result.error || "Upload thất bại");
            }

            onChange(result.data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload thất bại");
        } finally {
            setUploading(false);
            // Reset input value to allow re-selecting same file if needed
            e.target.value = "";
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {recommendedSize && (
                    <span className="text-xs text-gray-500 ml-2">({recommendedSize})</span>
                )}
            </label>

            {value ? (
                <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
                    <div className="relative aspect-video w-full h-48 sm:h-64">
                        <Image
                            src={value}
                            alt={label}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={handleRemove}
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label className={`
          flex flex-col items-center justify-center w-full h-48 sm:h-64
          border-2 border-dashed border-gray-300 rounded-lg cursor-pointer
          bg-gray-50 hover:bg-gray-100 transition-colors
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-3" />
                        ) : (
                            <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        )}
                        <p className="text-sm text-gray-500">
                            {uploading ? 'Đang upload...' : 'Click để chọn hình'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 5MB
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            )}

            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <X size={16} /> {error}
                </p>
            )}
        </div>
    );
}
