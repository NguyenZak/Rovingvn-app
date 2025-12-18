'use server'

import { z } from 'zod'

const contactSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ').optional(),
    subject: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
    message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(data: ContactFormData) {
    try {
        // Validate the form data
        const validatedData = contactSchema.parse(data)

        // TODO: Integrate with your email service (e.g., Resend, SendGrid)
        // For now, we'll just log the data
        console.log('Contact form submission:', validatedData)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        return {
            success: true,
            message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Vui lòng kiểm tra lại thông tin',
                errors: (error as z.ZodError).issues,
            }
        }

        return {
            success: false,
            message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        }
    }
}
