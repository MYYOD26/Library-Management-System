import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { BookDto, BookRequest } from './Interface.Books'
import type { CategoryDto } from '../Categories'

export interface BookFormModalProps {
  isOpen: boolean
  book: BookDto | null
  categories: CategoryDto[]
  onClose: () => void
  onSubmit: (data: BookRequest) => Promise<void>
}

export default function BookFormModal({ isOpen, book, categories, onClose, onSubmit }: BookFormModalProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [totalCopies, setTotalCopies] = useState('1')
  const [isbn, setIsbn] = useState('')
  const [publisher, setPublisher] = useState('')
  const [publishedYear, setPublishedYear] = useState('')
  const [description, setDescription] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle(book?.title ?? '')
      setAuthor(book?.author ?? '')
      setCategoryId(book?.categoryId ?? '')
      setTotalCopies(String(book?.totalCopies ?? 1))
      setIsbn(book?.isbn ?? '')
      setPublisher(book?.publisher ?? '')
      setPublishedYear(book?.publishedYear ? String(book.publishedYear) : '')
      setDescription(book?.description ?? '')
      setCoverUrl(book?.coverUrl ?? '')
      setError(null)
    }
  }, [isOpen, book])

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        title,
        author,
        categoryId,
        totalCopies: Math.max(0, Number(totalCopies) || 0),
        isbn: isbn || undefined,
        publisher: publisher || undefined,
        publishedYear: publishedYear ? Number(publishedYear) : null,
        description: description || undefined,
        coverUrl: coverUrl || undefined
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form onSubmit={handleSubmit} className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100 z-10">
          <h3 className="font-bold text-gray-900">{book ? 'แก้ไขข้อมูลหนังสือ' : 'เพิ่มหนังสือใหม่'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              ชื่อหนังสือ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={250}
              placeholder="ชื่อหนังสือ"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                ผู้แต่ง <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                maxLength={200}
                placeholder="ชื่อผู้แต่ง"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                หมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition cursor-pointer"
              >
                <option value="" disabled>
                  เลือกหมวดหมู่
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                จำนวนเล่ม <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                required
                min={0}
                max={1000}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">ISBN</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                maxLength={20}
                placeholder="เช่น 9780132350884"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">ปีที่พิมพ์</label>
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                min={1400}
                max={2100}
                placeholder="เช่น 2567"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">สำนักพิมพ์</label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                maxLength={150}
                placeholder="ชื่อสำนักพิมพ์"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL ภาพปก (ไม่บังคับ)</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                maxLength={500}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">คำอธิบาย</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="เรื่องย่อหรือคำอธิบายหนังสือ"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5">{error}</div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white flex justify-end gap-2 p-5 pt-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !author.trim() || !categoryId}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'กำลังบันทึก...' : book ? 'บันทึกการแก้ไข' : 'เพิ่มหนังสือ'}
          </button>
        </div>
      </form>
    </div>
  )
}
