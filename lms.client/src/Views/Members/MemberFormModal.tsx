import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { MemberDto, MemberRequest } from './Interface.Members'

export interface MemberFormModalProps {
  isOpen: boolean
  member: MemberDto | null
  onClose: () => void
  onSubmit: (data: MemberRequest) => Promise<void>
}

export default function MemberFormModal({ isOpen, member, onClose, onSubmit }: MemberFormModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFullName(member?.fullName ?? '')
      setEmail(member?.email ?? '')
      setPhoneNumber(member?.phoneNumber ?? '')
      setIsActive(member?.isActive ?? true)
      setError(null)
    }
  }, [isOpen, member])

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit({ fullName, email, phoneNumber: phoneNumber || undefined, isActive })
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
          <h3 className="font-bold text-gray-900">{member ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}</h3>
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
              ชื่อ-นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={150}
              placeholder="เช่น สมชาย ใจดี"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={200}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={20}
              placeholder="เช่น 081-234-5678"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
            />
          </div>

          <label className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">เปิดการใช้งานสมาชิก</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-red-600 cursor-pointer"
            />
          </label>

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
            disabled={isSubmitting || !fullName.trim() || !email.trim()}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'กำลังบันทึก...' : member ? 'บันทึกการแก้ไข' : 'เพิ่มสมาชิก'}
          </button>
        </div>
      </form>
    </div>
  )
}
