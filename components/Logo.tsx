/**
 * Logo Component
 * Component để hiển thị logo của website với các variant khác nhau
 */

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

interface LogoProps {
    /**
     * Variant của logo
     * - main: Logo chính (default)
     * - dark: Logo cho dark mode
     * - small: Logo nhỏ (mobile, sidebar)
     * - text: Logo văn bản
     */
    variant?: "main" | "dark" | "small" | "text";

    /**
     * Chiều cao của logo (width tự động tính theo tỷ lệ)
     */
    height?: number;

    /**
     * Có thể click để về trang chủ không
     */
    clickable?: boolean;

    /**
     * Class name bổ sung
     */
    className?: string;

    /**
     * Priority loading (cho above-the-fold images)
     */
    priority?: boolean;
}

export function Logo({
    variant = "main",
    height = 48,
    clickable = true,
    className = "",
    priority = false,
}: LogoProps) {
    // Lấy đường dẫn logo tương ứng
    const logoSrc = siteConfig.logo[variant];

    // Tính width dựa trên aspect ratio (giả sử 3:1)
    const width = height * 3;

    const logoImage = (
        <Image
            src={logoSrc}
            alt={`${siteConfig.name} Logo`}
            width={width}
            height={height}
            className={className}
            priority={priority}
        />
    );

    // Nếu clickable, bọc trong Link
    if (clickable) {
        return (
            <Link
                href="/"
                className="inline-block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="Về trang chủ"
            >
                {logoImage}
            </Link>
        );
    }

    return logoImage;
}

/**
 * Logo Text - Hiển thị tên website dạng text (fallback khi chưa có logo)
 */
export function LogoText({
    clickable = true,
    className = "",
}: {
    clickable?: boolean;
    className?: string;
}) {
    const textContent = (
        <span className={`text-2xl font-bold text-primary ${className}`}>
            {siteConfig.name}
        </span>
    );

    if (clickable) {
        return (
            <Link
                href="/"
                className="inline-block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="Về trang chủ"
            >
                {textContent}
            </Link>
        );
    }

    return textContent;
}
