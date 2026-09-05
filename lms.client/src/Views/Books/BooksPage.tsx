import { useEffect, useState } from 'react'
import { AlertCircle, BookOpen, BookPlus, ChevronLeft, ChevronRight, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'
import { useBooks } from './useBooks'
import { booksService } from './booksService'
import BookFormModal from './BookFormModal'
import BorrowModal from './BorrowModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import type { BookDto, BookRequest } from './Interface.Books'
import { useCategories } from '../Categories'
import { useAuth } from '../../Context/AuthContext'

const statusLabels: Record<string, string> = {
  available: 'พร้อมให้ยืม',
  borrowed: 'ถูกยืมอยู่',
  reserved: 'จองแล้ว'
}

export default function BooksPage() {
  const { books, isLoading, error, filters, updateFilters, setPage, refresh } = useBooks()
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const { canManage } = useAuth()

  const [searchInput, setSearchInput] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<BookDto | null>(null)
  const [borrowingBook, setBorrowingBook] = useState<BookDto | null>(null)
  const [deletingBook, setDeletingBook] = useState<BookDto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // ค้นหาแบบ Debounce: รอ 400ms หลังพิมพ์เสร็จก่อนยิง API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ search: searchInput })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput, filters.search, updateFilters])

  const openCreateModal = () => {
    setEditingBook(null)
    setFormOpen(true)
  }

  const openEditModal = (book: BookDto) => {
    setEditingBook(book)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data: BookRequest) => {
    if (editingBook) {
      await booksService.updateBook(editingBook.id, data)
      setSuccessMessage('บันทึกการแก้ไขหนังสือเรียบร้อยแล้ว')
    } else {
      await booksService.createBook(data)
      setSuccessMessage('เพิ่มหนังสือใหม่เรียบร้อยแล้ว')
    }
    setFormOpen(false)
    refresh()
  }

  const handleDelete = async () => {
    if (!deletingBook) return
    setIsDeleting(true)
    setActionError(null)
    try {
      await booksService.deleteBook(deletingBook.id)
      setSuccessMessage('ลบหนังสือเรียบร้อยแล้ว')
      setDeletingBook(null)
      refresh()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'ไม่สามารถลบหนังสือได้')
      setDeletingBook(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-red-100 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen size={16} /> คลังหนังสือ
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">สำรวจหนังสือทั้งหมด</h1>
          <p className="text-red-100 text-sm">
            ค้นหาและจัดการหนังสือในห้องสมุด {books ? `รวมทั้งสิ้น ${books.totalCount.toLocaleString()} รายการ` : ''}
          </p>
        </div>

        {canManage && (
          <button
            onClick={openCreateModal}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Plus size={18} /> เพิ่มหนังสือ
          </button>
        )}
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
            onClick={refresh}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            ลองใหม่
          </button>
        </div>
      )}

      {/* Toolbar: Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ค้นหาชื่อหนังสือ ผู้แต่ง หรือ ISBN..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilters({ categoryId: e.target.value })}
            disabled={isLoadingCategories}
            className="flex-1 sm:flex-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition cursor-pointer"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="flex-1 sm:flex-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition cursor-pointer"
          >
            <option value="">ทุกสถานะ</option>
            <option value="available">พร้อมให้ยืม</option>
            <option value="borrowed">ถูกยืมอยู่</option>
          </select>

          <button
            onClick={refresh}
            title="รีเฟรชข้อมูล"
            className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-44 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      ) : !books || books.items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">ไม่พบหนังสือที่ตรงกับการค้นหา</p>
          <p className="text-gray-400 text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเคลียร์ตัวกรองทั้งหมด</p>
          {(filters.search || filters.categoryId || filters.status) && (
            <button
              onClick={() => {
                setSearchInput('')
                updateFilters({ search: '', categoryId: '', status: '' })
              }}
              className="mt-4 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
            >
              เคลียร์ตัวกรองทั้งหมด
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.items.map((book) => (
              <div key={book.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full truncate max-w-[60%]">
                    {book.categoryName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      book.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {statusLabels[book.status] ?? book.status}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 truncate mb-0.5">{book.author}</p>
                <p className="text-xs text-gray-400 mb-4">
                  {book.publishedYear ?? '—'} {book.publisher ? `• ${book.publisher}` : ''}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`text-xs font-medium ${book.availableCopies > 0 ? 'text-gray-500' : 'text-amber-600'}`}>
                    เหลือ {book.availableCopies}/{book.totalCopies} เล่ม
                  </span>

                  <div className="flex items-center gap-0.5">
                    {canManage && (
                      <button
                        onClick={() => setBorrowingBook(book)}
                        disabled={book.availableCopies === 0}
                        title={book.availableCopies > 0 ? 'บันทึกการยืม' : 'หนังสือถูกยืมครบแล้ว'}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <BookPlus size={14} /> ยืม
                      </button>
                    )}
                    {canManage && (
                      <button
                        onClick={() => openEditModal(book)}
                        title="แก้ไขข้อมูลหนังสือ"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    {canManage && (
                      <button
                        onClick={() => setDeletingBook(book)}
                        title="ลบหนังสือ"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {books.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-5 py-3.5 shadow-sm">
              <p className="text-xs text-gray-500">
                หน้า {books.page} จาก {books.totalPages} • รวม {books.totalCount.toLocaleString()} รายการ
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(books.page - 1)}
                  disabled={books.page <= 1}
                  className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={14} /> ก่อนหน้า
                </button>
                <button
                  onClick={() => setPage(books.page + 1)}
                  disabled={books.page >= books.totalPages}
                  className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  ถัดไป <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile FAB */}
      {canManage && (
        <button
          onClick={openCreateModal}
          className="sm:hidden fixed bottom-6 right-6 z-40 p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          <Plus size={22} />
        </button>
      )}

      <BookFormModal
        isOpen={formOpen}
        book={editingBook}
        categories={categories}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <BorrowModal
        isOpen={borrowingBook !== null}
        book={borrowingBook}
        onClose={() => setBorrowingBook(null)}
        onSuccess={() => {
          setBorrowingBook(null)
          setSuccessMessage('บันทึกรายการยืมเรียบร้อยแล้ว')
          refresh()
        }}
      />

      <ConfirmDialog
        isOpen={deletingBook !== null}
        title="ลบหนังสือ"
        message={`ต้องการลบ "${deletingBook?.title}" ออกจากระบบใช่หรือไม่?`}
        confirmLabel="ลบหนังสือ"
        isDanger
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBook(null)}
      />
    </div>
  )
}
