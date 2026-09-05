import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { BookDto } from './Interface.Books'
import { borrowingsService } from '../Borrowings/borrowingsService'
import { membersService } from '../Members/membersService'
import type { MemberDto } from '../Members'

export interface BorrowModalProps {
  isOpen: boolean
  book: BookDto | null
  onClose: () => void
  onSuccess: () => void
}

export default function BorrowModal({ isOpen, book, onClose, onSuccess }: BorrowModalProps) {
  const [members, setMembers] = useState<MemberDto[]>([])
  const [memberId, setMemberId] = useState('')
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setIsLoadingMembers(true)
    setError(null)
    setMemberId('')

    membersService
      .getMembers()
      .then((data) => {
        if (isMounted) setMembers(data.filter((member) => member.isActive))
      })
      .catch(() => {
        if (isMounted) setError('ไม่สามารถโหลดรายชื่อสมาชิกได้')
      })
      .finally(() => {
        if (isMounted) setIsLoadingMembers(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen])

  if (!isOpen || !book) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await borrowingsService.borrowBook({ bookId: book.id, memberId })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกรายการยืมได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">บันทึกการยืมหนังสือ</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Book Info */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="font-bold text-gray-900 text-sm">{book.title}</p>
            <p className="text-xs text-gray-600 mt-0.5">{book.author}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5">
              พร้อมให้ยืม {book.availableCopies} จาก {book.totalCopies} เล่ม
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              สมาชิกผู้ยืม <span className="text-red-500">*</span>
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              disabled={isLoadingMembers}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition cursor-pointer disabled:bg-gray-50"
            >
              <option value="" disabled>
                {isLoadingMembers ? 'กำลังโหลดรายชื่อสมาชิก...' : 'เลือกสมาชิก'}
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.memberCode} — {member.fullName}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1.5">แสดงเฉพาะสมาชิกที่เปิดการใช้งาน • ยืมได้สูงสุด 3 เล่ม / คน</p>
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
            disabled={isSubmitting || !memberId}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการยืม'}
          </button>
        </div>
      </form>
    </div>
  )
}
