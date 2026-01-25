'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import ImageUpload from '@/app/components/ImageUpload';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"postCategories">;
  const category = useQuery(api.postCategories.getById, { id });
  const updateCategory = useMutation(api.postCategories.update);
  const markFileUsed = useMutation(api.files.markFileUsed);
  const releaseFile = useMutation(api.files.releaseFile);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlugEditor, setShowSlugEditor] = useState(false);
  const originalImageUrl = useRef<string>('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setImageUrl(category.imageUrl || '');
      setOrder(category.order ?? '');
      originalImageUrl.current = category.imageUrl || '';
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error('Vui lòng điền tên và slug');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateCategory({
        id,
        name,
        slug,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        order: order === '' ? undefined : Number(order),
      });
      
      const usedByKey = `postCategories:${id}`;
      if (imageUrl !== originalImageUrl.current) {
        if (originalImageUrl.current && originalImageUrl.current.includes('convex.cloud')) {
          await releaseFile({ usedBy: usedByKey });
        }
        if (imageUrl && imageUrl.includes('convex.cloud')) {
          await markFileUsed({ url: imageUrl, usedBy: usedByKey });
        }
      }
      
      toast.success('Cập nhật danh mục thành công');
      router.push('/admin/categories');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) {
    return <div className="text-center py-8 text-slate-500">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh Sửa Danh Mục</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Cập nhật thông tin danh mục</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tên danh mục *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Slug (URL) *
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200 resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Hình ảnh đại diện
              </label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
            </button>
            <Link
              href="/admin/categories"
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
