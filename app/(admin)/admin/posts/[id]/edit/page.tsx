'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import ImageUpload from '@/app/components/ImageUpload';

const LexicalEditor = dynamic(() => import('@/app/components/LexicalEditor'), { ssr: false });

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"posts">;
  const post = useQuery(api.posts.getById, { id });
  const updatePost = useMutation(api.posts.update);
  const markFileUsed = useMutation(api.files.markFileUsed);
  const releaseFile = useMutation(api.files.releaseFile);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlugEditor, setShowSlugEditor] = useState(false);
  const originalImageUrl = useRef<string>('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setImageUrl(post.imageUrl || '');
      setContent(post.content);
      setIsPublished(post.isPublished);
      originalImageUrl.current = post.imageUrl || '';
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setIsSubmitting(true);
    try {
      await updatePost({
        id,
        title,
        slug,
        content,
        imageUrl: imageUrl || undefined,
        isPublished,
      });
      
      const usedByKey = `posts:${id}`;
      if (imageUrl !== originalImageUrl.current) {
        if (originalImageUrl.current && originalImageUrl.current.includes('convex.cloud')) {
          await releaseFile({ usedBy: usedByKey });
        }
        if (imageUrl && imageUrl.includes('convex.cloud')) {
          await markFileUsed({ url: imageUrl, usedBy: usedByKey });
        }
      }
      
      toast.success('Cập nhật bài viết thành công');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <div className="text-center py-8 text-slate-500">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh Sửa Bài Viết</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Cập nhật thông tin bài viết</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tiêu đề
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Slug (URL)
              </label>
              {showSlugEditor ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSlugEditor(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-sm text-slate-600 dark:text-slate-400 font-mono">
                  <span className="flex-1">{slug}</span>
                  <button
                    type="button"
                    onClick={() => setShowSlugEditor(true)}
                    className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Hình ảnh đại diện
              </label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nội dung
              </label>
              <LexicalEditor
                value={content}
                onChange={setContent}
                placeholder="Nhập nội dung bài viết..."
                postId={id}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Xuất bản
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              href="/admin/posts"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
