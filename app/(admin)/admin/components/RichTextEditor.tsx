/**
 * Rich Text Editor Component
 * A powerful WYSIWYG editor built with Tiptap for blog content creation
 */

"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, CodeIcon, Minus, Undo, Redo,
    Link2, Image as ImageIcon, UnderlineIcon
} from 'lucide-react';
import { useCallback, useRef } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Start writing your content...' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-emerald-600 hover:text-emerald-700 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Underline,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'blog-content');
            formData.append('alt_text', file.name);

            // Dynamically import to ensure we're using the server action in this client component
            const { uploadMedia } = await import('@/app/(admin)/admin/media/actions');

            // Show some loading state if possible, or just wait
            const result = await uploadMedia(formData);

            if (result.success && result.data) {
                editor?.chain().focus().setImage({ src: result.data.url }).run();
            } else {
                alert('Upload failed: ' + result.error);
            }
        } catch (error) {
            console.error('Editor upload error', error);
            alert('Upload failed');
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, active, disabled, title, children }: {
        onClick: () => void;
        active?: boolean;
        disabled?: boolean;
        title: string;
        children: React.ReactNode;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${active ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            {/* Toolbar */}
            <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        active={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        active={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        active={editor.isActive('code')}
                        title="Inline Code"
                    >
                        <Code size={18} />
                    </ToolbarButton>
                </div>

                {/* Headings */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        active={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        active={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 size={18} />
                    </ToolbarButton>
                </div>

                {/* Lists */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered size={18} />
                    </ToolbarButton>
                </div>

                {/* Special Blocks */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')}
                        title="Blockquote"
                    >
                        <Quote size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        active={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <CodeIcon size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Horizontal Rule"
                    >
                        <Minus size={18} />
                    </ToolbarButton>
                </div>

                {/* Links & Images */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={setLink}
                        active={editor.isActive('link')}
                        title="Add Link"
                    >
                        <Link2 size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={addImage}
                        title="Add Image"
                    >
                        <ImageIcon size={18} />
                    </ToolbarButton>
                </div>

                {/* Undo/Redo */}
                <div className="flex gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo size={18} />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}
