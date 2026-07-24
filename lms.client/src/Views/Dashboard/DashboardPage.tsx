import { useDashboard } from './useDashboard'
import { BookOpen, BookMarked, History, Users, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { stats, recentBooks, isLoading, error, handleRefresh } = useDashboard()

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse select-none">
        <div className="h-28 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
        >
          ลองใหม่
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-red-100 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={16} /> ภาพรวมระบบห้องสมุด
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            แดชบอร์ดจัดการระบบ (Dashboard)
          </h1>
          <p className="text-red-100 text-sm">
            สรุปข้อมูลสถิติรายการหนังสือและการยืม-คืนล่าสุดในระบบ
          </p>
        </div>

        <button
          onClick={handleRefresh}
          title="รีเฟรชข้อมูล"
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white hidden sm:block cursor-pointer"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">หนังสือทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalBooks.toLocaleString()} เล่ม</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <BookMarked size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">กำลังยืมอยู่</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.activeLoans.toLocaleString()} เล่ม</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <History size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">กำหนดคืนวันนี้</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.dueToday.toLocaleString()} เล่ม</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">สมาชิกทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalMembers.toLocaleString()} คน</p>
          </div>
        </div>
      </div>

      {/* Recent Books List Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">รายการหนังสือล่าสุด</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">ชื่อหนังสือ</th>
                <th className="py-3 px-4">ผู้แต่ง</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{book.title}</td>
                  <td className="py-3.5 px-4 text-gray-600">{book.author}</td>
                  <td className="py-3.5 px-4 text-gray-500">{book.category}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${book.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : book.status === 'borrowed'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {book.status === 'available' ? 'พร้อมให้ยืม' : book.status === 'borrowed' ? 'ถูกยืมอยู่' : 'จองแล้ว'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
