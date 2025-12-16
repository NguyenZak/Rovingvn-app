// ============================================
// Vietnamese Slug Generator Utility
// ============================================

/**
 * Generate URL-friendly slug from Vietnamese text
 * @param text - Vietnamese text to convert to slug
 * @returns URL-safe slug
 */
export function generateSlug(text: string): string {
    if (!text) return ''

    let slug = text.toLowerCase()

    // Vietnamese character mappings
    const vietnameseMap: Record<string, string> = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd'
    }

    // Replace Vietnamese characters
    for (const [vietnamese, ascii] of Object.entries(vietnameseMap)) {
        slug = slug.replace(new RegExp(vietnamese, 'g'), ascii)
    }

    // Replace spaces and special characters with hyphens
    slug = slug
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen

    return slug
}

/**
 * Ensure slug is unique by appending number if needed
 * @param baseSlug - Base slug to check
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 */
export function ensureUniqueSlug(
    baseSlug: string,
    existingSlugs: string[]
): string {
    let slug = baseSlug
    let counter = 1

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

/**
 * Validate slug format
 * @param slug - Slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
}
