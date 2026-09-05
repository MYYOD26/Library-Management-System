import { useState } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { BookOpenText, Lock, User } from 'lucide-react'

const demoAccounts = [
  { username: 'admin', password: 'Admin123!', label: 'ผู้ดูแลระบบ (Admin)' },
  { username: 'librarian', password: 'Librarian123!', label: 'บรรณารักษ์ (Librarian)' },
  { username: 'member', password: 'Member123!', label: 'สมาชิก (Member)' }
]

export default function LoginPage() {
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-600 to-red-800 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center text-white mb-6">
          <div className="w-16 h-16 mx-auto bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BookOpenText size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            LMS<span className="font-extrabold ml-1">Library</span>
          </h1>
          <p className="text-red-100 text-sm mt-1">ระบบบริหารจัดการห้องสมุด — เข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="font-bold text-gray-900 text-lg mb-1">เข้าสู่ระบบ</h2>
          <p className="text-sm text-gray-500 mb-5">กรอกชื่อผู้ใช้และรหัสผ่านของคุณ</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">ชื่อผู้ใช้</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="เช่น admin"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">รหัสผ่าน</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">บัญชีทดลองใช้งาน</p>
            <div className="grid grid-cols-1 gap-1.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.username}
                  type="button"
                  onClick={() => {
                    setUsername(account.username)
                    setPassword(account.password)
                  }}
                  className="flex items-center justify-between px-3 py-2 text-xs bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-xl transition-colors cursor-pointer group"
                >
                  <span className="font-semibold text-gray-700 group-hover:text-red-700">{account.label}</span>
                  <span className="text-gray-400 group-hover:text-red-500 font-mono">
                    {account.username} / {account.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
