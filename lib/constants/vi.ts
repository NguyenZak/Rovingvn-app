// ============================================
// Vietnamese Language Constants
// All UI text in Vietnamese
// ============================================

export const VI_LABELS = {
    // Navigation
    nav: {
        dashboard: 'Tổng quan',
        posts: 'Bài viết',
        pages: 'Trang',
        seo: 'SEO',
        media: 'Media',
        users: 'Người dùng',
        auditLogs: 'Nhật ký hệ thống',
        categories: 'Danh mục',
        tags: 'Thẻ',
        settings: 'Cài đặt',
    },

    // Common Actions
    actions: {
        create: 'Tạo mới',
        edit: 'Chỉnh sửa',
        delete: 'Xoá',
        save: 'Lưu',
        cancel: 'Huỷ',
        publish: 'Xuất bản',
        unpublish: 'Huỷ xuất bản',
        saveDraft: 'Lưu nháp',
        search: 'Tìm kiếm',
        filter: 'Lọc',
        reset: 'Đặt lại',
        upload: 'Tải lên',
        download: 'Tải xuống',
        view: 'Xem',
        back: 'Quay lại',
        next: 'Tiếp theo',
        previous: 'Trước',
        confirm: 'Xác nhận',
        close: 'Đóng',
    },

    // Post Management
    posts: {
        title: 'Tiêu đề',
        slug: 'Slug',
        content: 'Nội dung',
        excerpt: 'Tóm tắt',
        featuredImage: 'Ảnh đại diện',
        status: 'Trạng thái',
        author: 'Tác giả',
        category: 'Danh mục',
        categories: 'Danh mục',
        tags: 'Thẻ',
        publishedAt: 'Ngày xuất bản',
        createdAt: 'Ngày tạo',
        updatedAt: 'Ngày cập nhật',
        viewCount: 'Lượt xem',
        draft: 'Nháp',
        published: 'Đã xuất bản',
        createNew: 'Tạo bài viết mới',
        editPost: 'Chỉnh sửa bài viết',
        allPosts: 'Tất cả bài viết',
        noPosts: 'Chưa có bài viết nào',
    },

    // Page Management
    pages: {
        title: 'Tiêu đề',
        slug: 'Slug',
        content: 'Nội dung',
        template: 'Template',
        status: 'Trạng thái',
        createNew: 'Tạo trang mới',
        editPage: 'Chỉnh sửa trang',
        allPages: 'Tất cả trang',
        noPages: 'Chưa có trang nào',
        templates: {
            about: 'Giới thiệu',
            policy: 'Chính sách',
            contact: 'Liên hệ',
            custom: 'Tùy chỉnh',
        },
    },

    // SEO
    seo: {
        title: 'SEO',
        metaTitle: 'Meta Title',
        metaDescription: 'Meta Description',
        canonicalUrl: 'Canonical URL',
        ogTitle: 'Open Graph Title',
        ogDescription: 'Open Graph Description',
        ogImage: 'Open Graph Image',
        noindex: 'No Index',
        nofollow: 'No Follow',
        preview: 'Xem trước Google',
        previewTitle: 'Xem trước kết quả tìm kiếm',
    },

    // Media Library
    media: {
        library: 'Thư viện Media',
        upload: 'Tải ảnh lên',
        filename: 'Tên file',
        fileSize: 'Kích thước',
        mimeType: 'Loại file',
        dimensions: 'Kích thước',
        uploadedBy: 'Người tải lên',
        uploadedAt: 'Ngày tải lên',
        altText: 'Alt text',
        selectImage: 'Chọn ảnh',
        noMedia: 'Chưa có media nào',
        dragDrop: 'Kéo thả file vào đây',
        orClick: 'hoặc click để chọn',
    },

    // Categories & Tags
    taxonomy: {
        categoryName: 'Tên danh mục',
        categorySlug: 'Slug danh mục',
        categoryDescription: 'Mô tả danh mục',
        parentCategory: 'Danh mục cha',
        tagName: 'Tên thẻ',
        tagSlug: 'Slug thẻ',
        createCategory: 'Tạo danh mục',
        createTag: 'Tạo thẻ',
        noCategories: 'Chưa có danh mục nào',
        noTags: 'Chưa có thẻ nào',
    },

    // Audit Logs
    audit: {
        logs: 'Nhật ký hệ thống',
        user: 'Người dùng',
        action: 'Hành động',
        objectType: 'Loại đối tượng',
        objectName: 'Tên đối tượng',
        timestamp: 'Thời gian',
        beforeData: 'Dữ liệu trước',
        afterData: 'Dữ liệu sau',
        changes: 'Thay đổi',
        noLogs: 'Chưa có nhật ký nào',
        filterByUser: 'Lọc theo người dùng',
        filterByAction: 'Lọc theo hành động',
        filterByDate: 'Lọc theo ngày',
    },

    // User Management
    users: {
        email: 'Email',
        role: 'Vai trò',
        createdAt: 'Ngày tạo',
        lastLogin: 'Đăng nhập lần cuối',
        status: 'Trạng thái',
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        roles: {
            admin: 'Quản trị viên',
            editor: 'Biên tập viên',
            viewer: 'Người xem',
        },
    },

    // Dashboard Stats
    stats: {
        totalPosts: 'Tổng bài viết',
        publishedPosts: 'Đã xuất bản',
        draftPosts: 'Nháp',
        totalPages: 'Tổng trang',
        totalMedia: 'Tổng media',
        totalCategories: 'Tổng danh mục',
        totalTags: 'Tổng thẻ',
        recentActivity: 'Hoạt động gần đây',
    },

    // Pagination
    pagination: {
        showing: 'Hiển thị',
        of: 'trong số',
        results: 'kết quả',
        page: 'Trang',
        perPage: 'mỗi trang',
    },

    // Slider Management
    sliders: {
        title: 'Tiêu đề',
        subtitle: 'Phụ đề',
        description: 'Mô tả',
        image: 'Hình ảnh',
        link: 'Liên kết',
        buttonText: 'Văn bản nút',
        displayOrder: 'Thứ tự hiển thị',
        status: 'Trạng thái',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        createNew: 'Tạo slider mới',
        editSlider: 'Chỉnh sửa slider',
        allSliders: 'Tất cả sliders',
        noSliders: 'Chưa có slider nào',
    },
}

export const VI_MESSAGES = {
    success: {
        created: 'Đã tạo thành công',
        updated: 'Đã cập nhật thành công',
        deleted: 'Đã xoá thành công',
        published: 'Đã xuất bản thành công',
        unpublished: 'Đã huỷ xuất bản thành công',
        uploaded: 'Đã tải lên thành công',
        saved: 'Đã lưu thành công',
    },

    error: {
        generic: 'Có lỗi xảy ra',
        notFound: 'Không tìm thấy',
        unauthorized: 'Bạn không có quyền truy cập',
        invalidData: 'Dữ liệu không hợp lệ',
        uploadFailed: 'Tải lên thất bại',
        deleteFailed: 'Xoá thất bại',
        networkError: 'Lỗi kết nối mạng',
        fileTooLarge: 'File quá lớn (tối đa 5MB)',
        invalidFileType: 'Loại file không được hỗ trợ',
    },

    confirm: {
        delete: 'Bạn có chắc chắn muốn xoá?',
        deletePost: 'Bạn có chắc chắn muốn xoá bài viết này?',
        deletePage: 'Bạn có chắc chắn muốn xoá trang này?',
        deleteMedia: 'Bạn có chắc chắn muốn xoá media này?',
        deleteCategory: 'Bạn có chắc chắn muốn xoá danh mục này?',
        deleteTag: 'Bạn có chắc chắn muốn xoá thẻ này?',
        unsavedChanges: 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?',
    },

    validation: {
        required: 'Trường này là bắt buộc',
        minLength: 'Tối thiểu {min} ký tự',
        maxLength: 'Tối đa {max} ký tự',
        invalidEmail: 'Email không hợp lệ',
        invalidUrl: 'URL không hợp lệ',
        invalidSlug: 'Slug không hợp lệ (chỉ chữ thường, số và dấu gạch ngang)',
        slugExists: 'Slug đã tồn tại',
    },

    empty: {
        noPosts: 'Chưa có bài viết nào. Tạo bài viết đầu tiên!',
        noPages: 'Chưa có trang nào. Tạo trang đầu tiên!',
        noMedia: 'Chưa có media nào. Tải lên media đầu tiên!',
        noCategories: 'Chưa có danh mục nào. Tạo danh mục đầu tiên!',
        noTags: 'Chưa có thẻ nào. Tạo thẻ đầu tiên!',
        noResults: 'Không tìm thấy kết quả nào',
    },
}

export const VI_ERRORS = {
    auth: {
        unauthorized: 'Bạn chưa đăng nhập',
        forbidden: 'Bạn không có quyền truy cập',
        sessionExpired: 'Phiên đăng nhập đã hết hạn',
    },

    validation: {
        titleRequired: 'Tiêu đề là bắt buộc',
        slugRequired: 'Slug là bắt buộc',
        contentRequired: 'Nội dung là bắt buộc',
        categoryRequired: 'Phải chọn ít nhất một danh mục',
    },

    media: {
        fileTooLarge: 'File phải nhỏ hơn 5MB',
        invalidFormat: 'Chỉ hỗ trợ định dạng JPG, PNG, WEBP',
        uploadFailed: 'Tải lên thất bại. Vui lòng thử lại',
    },
}
