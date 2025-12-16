// ============================================
// Audit Log Utility Functions
// ============================================

import { createClient } from '@/lib/supabase/server'
import { AuditAction, ObjectType } from '@/lib/types/cms'

/**
 * Log an action to the audit_logs table
 * Note: Most audit logging happens automatically via database triggers,
 * but this function can be used for custom logging (e.g., login events)
 */
export async function logAuditAction(params: {
    action: AuditAction
    objectType?: ObjectType
    objectId?: string
    objectName?: string
    beforeData?: Record<string, unknown>
    afterData?: Record<string, unknown>
    ipAddress?: string
    userAgent?: string
}) {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            console.warn('Cannot log audit action: No authenticated user')
            return { success: false, error: 'No authenticated user' }
        }

        const { error } = await supabase
            .from('audit_logs')
            .insert({
                user_id: user.id,
                user_email: user.email,
                action: params.action,
                object_type: params.objectType,
                object_id: params.objectId,
                object_name: params.objectName,
                before_data: params.beforeData,
                after_data: params.afterData,
                ip_address: params.ipAddress,
                user_agent: params.userAgent
            })

        if (error) {
            console.error('Audit log error:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Failed to log audit action:', error)
        return { success: false, error: 'Unknown error' }
    }
}

/**
 * Format audit log data for display
 */
export function formatAuditData(data: unknown): string {
    if (!data) return '-'

    try {
        return JSON.stringify(data, null, 2)
    } catch {
        return String(data)
    }
}

/**
 * Get Vietnamese label for audit action
 */
export function getAuditActionLabel(action: string): string {
    const labels: Record<string, string> = {
        create: 'Tạo mới',
        update: 'Cập nhật',
        delete: 'Xoá',
        login: 'Đăng nhập',
        logout: 'Đăng xuất',
        publish: 'Xuất bản',
        unpublish: 'Huỷ xuất bản'
    }

    return labels[action] || action
}

/**
 * Get Vietnamese label for object type
 */
export function getObjectTypeLabel(objectType: string): string {
    const labels: Record<string, string> = {
        post: 'Bài viết',
        page: 'Trang',
        media: 'Media',
        user: 'Người dùng',
        category: 'Danh mục',
        tag: 'Thẻ'
    }

    return labels[objectType] || objectType
}

/**
 * Compare two objects and return differences
 */
export function getObjectDiff(
    before: Record<string, unknown>,
    after: Record<string, unknown>
): Record<string, { before: unknown; after: unknown }> {
    const diff: Record<string, { before: unknown; after: unknown }> = {}

    // Get all unique keys
    const keys = new Set([...Object.keys(before), ...Object.keys(after)])

    for (const key of keys) {
        if (before[key] !== after[key]) {
            diff[key] = {
                before: before[key],
                after: after[key]
            }
        }
    }

    return diff
}
