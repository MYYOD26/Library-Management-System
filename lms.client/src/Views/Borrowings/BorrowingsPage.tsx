import { useState } from 'react'
import { useBorrowings } from './useBorrowings'
import { borrowingsService } from './borrowingsService'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import type { BorrowingDto, BorrowingsTab } from './Interface.Borrowings'
import { daysUntil, formatDate } from '../../Services/format'
import { AlertCircle, BookMarked, RotateCcw, Search } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext'

const tabs: { id: BorrowingsTab; label: string }[] = [
  { id: 'active', label: 'กำลังยืม' },
  { id: 'overdue', label: 'เกินกำหนด' },
  { id: 'returned', label: 'ประวัติการคืน' }
]

export default function BorrowingsPage() {
  const { borrowings, isLoading, error, tab, search, changeTab, handleSearch, fetchBorrowings } = useBorrowings()
  const { canManage } = useAuth()

  const [searchInput, setSearchInput] = useState('')
  const [returningRecord, setReturningRecord] = useState<BorrowingDto | null>(null)
  const [isReturning, setIsReturning] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSearchSubmit = (value: string) => {
    setSearchInput(value)
    handleSearch(value)
  }

  const handleReturn = async () => {
    if (!returningRecord) return
    setIsReturning(true)
    setActionError(null)
    try {
      await borrowingsService.returnBook(returningRecord.id)
      setSuccessMessage(`รับคืน "${returningRecord.bookTitle}" เรียบร้อยแล้ว`)
      setReturningRecord(null)
      fetchBorrowings(tab, search)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกการคืนได้')
      setReturningRecord(null)
    } finally {
      setIsReturning(false)
    }
  }

  const renderStatusBadge = (record: BorrowingDto) => {
    if (record.status === 'returned') {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">คืนแล้ว</span>
    }
    if (record.status === 'overdue') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
          เกินกำหนด {Math.abs(daysUntil(record.dueDate))} วัน
        </span>
      )
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">กำลังยืม</span>
  }

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 text-red-100 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookMarked size={16} /> ระบบยืม-คืน
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">รายการยืม-คืนหนังสือ</h1>
        <p className="text-red-100 text-sm">ติดตามรายการยืม รับคืนหนังสือ และเช็ครายการที่เกินกำหนด</p>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
            ปิด
          </button>
        </div>
      )}
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-600 hover:text-red-800 cursor-pointer">
            ปิด
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchBorrowings(tab, search)}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            ลองใหม่
          </button>
        </div>
      )}

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === item.id ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchSubmit(e.target.value)}
            placeholder="ค้นหาชื่อหนังสือ ชื่อสมาชิก หรือรหัสสมาชิก..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
          />
        </div>
      </div>

      {/* Borrowings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : borrowings.length === 0 ? (
          <div className="py-12 text-center">
            <BookMarked size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">ไม่พบรายการยืม-คืน</p>
            <p className="text-gray-400 text-sm mt-1">
              {tab === 'returned' ? 'ยังไม่มีประวัติการคืน' : 'ลองเปลี่ยนคำค้นหา หรือบันทึกการยืมจากหน้าสำรวจหนังสือ'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">หนังสือ</th>
                  <th className="py-3 px-4">ผู้ยืม</th>
                  <th className="py-3 px-4">วันที่ยืม</th>
                  <th className="py-3 px-4">ครบกำหนด</th>
                  <th className="py-3 px-4">คืนแล้วเมื่อ</th>
                  <th className="py-3 px-4 text-center">สถานะ</th>
                  <th className="py-3 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {borrowings.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-900">{record.bookTitle}</p>
                      <p className="text-xs text-gray-500">{record.bookAuthor}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-900">{record.memberName}</p>
                      <p className="text-xs text-gray-500">{record.memberCode}</p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{formatDate(record.borrowedAt)}</td>
                    <td className={`py-3.5 px-4 font-medium ${record.status === 'overdue' ? 'text-red-600' : 'text-gray-600'}`}>
                      {formatDate(record.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{record.returnedAt ? formatDate(record.returnedAt) : '—'}</td>
                    <td className="py-3.5 px-4 text-center">{renderStatusBadge(record)}</td>
                    <td className="py-3.5 px-4 text-center">
                      {record.status === 'returned' ? (
                        <span className="text-xs text-gray-300">—</span>
                      ) : canManage ? (
                        <button
                          onClick={() => setReturningRecord(record)}
                          className="flex items-center gap-1.5 mx-auto px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <RotateCcw size={14} /> รับคืน
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={returningRecord !== null}
        title="รับคืนหนังสือ"
        message={`ยืนยันรับคืน "${returningRecord?.bookTitle}" จาก ${returningRecord?.memberName} (${returningRecord?.memberCode}) ใช่หรือไม่?`}
        confirmLabel="ยืนยันรับคืน"
        isBusy={isReturning}
        onConfirm={handleReturn}
        onCancel={() => setReturningRecord(null)}
      />
    </div>
  )
}
