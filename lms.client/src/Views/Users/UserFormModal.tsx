import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { UserDto, UserFormValues, UserRole } from './Interface.Users'

export interface UserFormModalProps {
  isOpen: boolean
  user: UserDto | null
  onClose: () => void
  onSubmit: (values: UserFormValues) => Promise<void>
}

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'Admin', label: 'ผู้ดูแลระบบ (Admin)', description: 'จัดการทุกอย่างรวมถึงผู้ใช้ระบบ' },
  { value: 'Librarian', label: 'บรรณารักษ์ (Librarian)', description: 'จัดการหนังสือ สมาชิก และยืม-คืน' },
  { value: 'Member', label: 'สมาชิก (Member)', description: 'ดูข้อมูลหนังสือและรายการยืมได้อย่างเดียว' }
]

export default function UserFormModal({ isOpen, user, onClose, onSubmit }: UserFormModalProps) {
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [role, setRole] = useState<UserRole>('Member')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setUsername(user?.username ?? '')
      setFullName(user?.fullName ?? '')
      setEmail(user?.email ?? '')
      setPassword('')
      setNewPassword('')
      setRole(user?.role ?? 'Member')
      setIsActive(user?.isActive ?? true)
      setError(null)
    }
  }, [isOpen, user])

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        username: user ? undefined : username,
        fullName,
        email,
        password: user ? undefined : password,
        newPassword: user && newPassword ? newPassword : undefined,
        role,
        isActive
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition disabled:bg-gray-50 disabled:text-gray-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100 z-10">
          <h3 className="font-bold text-gray-900">{user ? 'แก้ไขผู้ใช้ระบบ' : 'เพิ่มผู้ใช้ระบบใหม่'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!user && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                ชื่อผู้ใช้ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                maxLength={100}
                pattern="[a-zA-Z0-9._-]+"
                title="ใช้ตัวอังกฤษ ตัวเลข และ . _ - เท่านั้น"
                placeholder="เช่น admin01"
                className={inputClass}
              />
            </div>
          )}

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
              className={inputClass}
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
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Role (สิทธิ์การใช้งาน) <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              required
              className={`${inputClass} bg-white cursor-pointer`}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1.5">
              {roleOptions.find((option) => option.value === role)?.description}
            </p>
          </div>

          {user ? (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                รีเซ็ตรหัสผ่าน (ไม่กรอก = ไม่เปลี่ยน)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                placeholder="รหัสผ่านใหม่"
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className={inputClass}
              />
            </div>
          )}

          <label className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">เปิดการใช้งานบัญชี</span>
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
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'กำลังบันทึก...' : user ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
          </button>
        </div>
      </form>
    </div>
  )
}
