import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { CategoryDto, CategoryRequest } from './Interface.Categories'

export interface CategoryFormModalProps {
  isOpen: boolean
  category: CategoryDto | null
  onClose: () => void
  onSubmit: (data: CategoryRequest) => Promise<void>
}

export default function CategoryFormModal({ isOpen, category, onClose, onSubmit }: CategoryFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName(category?.name ?? '')
      setDescription(category?.description ?? '')
      setError(null)
    }
  }, [isOpen, category])

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name, description: description || undefined })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{category ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</h3>
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
              ชื่อหมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              placeholder="เช่น เทคโนโลยีและการเขียนโปรแกรม"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">คำอธิบาย</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="อธิบายประเภทของหนังสือในหมวดหมู่นี้"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5">{error}</div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-5 pt-0">
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
            disabled={isSubmitting || !name.trim()}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'กำลังบันทึก...' : category ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
          </button>
        </div>
      </form>
    </div>
  )
}
