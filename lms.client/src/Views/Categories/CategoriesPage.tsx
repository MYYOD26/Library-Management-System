import { useState } from 'react'
import { useCategories } from './useCategories'
import { categoriesService } from './categoriesService'
import CategoryFormModal from './CategoryFormModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import type { CategoryDto, CategoryRequest } from './Interface.Categories'
import { AlertCircle, Layers, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext'

export default function CategoriesPage() {
  const { categories, isLoading, error, fetchCategories } = useCategories()
  const { canManage } = useAuth()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryDto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const openEditModal = (category: CategoryDto) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: CategoryRequest) => {
    if (editingCategory) {
      await categoriesService.updateCategory(editingCategory.id, data)
      setSuccessMessage('บันทึกการแก้ไขหมวดหมู่เรียบร้อยแล้ว')
    } else {
      await categoriesService.createCategory(data)
      setSuccessMessage('เพิ่มหมวดหมู่ใหม่เรียบร้อยแล้ว')
    }
    setIsFormOpen(false)
    fetchCategories()
  }

  const handleDelete = async () => {
    if (!deletingCategory) return
    setIsDeleting(true)
    setActionError(null)
    try {
      await categoriesService.deleteCategory(deletingCategory.id)
      setSuccessMessage('ลบหมวดหมู่เรียบร้อยแล้ว')
      setDeletingCategory(null)
      fetchCategories()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'ไม่สามารถลบหมวดหมู่ได้')
      setDeletingCategory(null)
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
            <Layers size={16} /> หมวดหมู่หนังสือ
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">จัดการหมวดหมู่หนังสือ</h1>
          <p className="text-red-100 text-sm">แบ่งประเภทหนังสือในห้องสมุดให้เป็นระเบียบ ค้นหาง่าย</p>
        </div>

        {canManage && (
          <button
            onClick={openCreateModal}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Plus size={18} /> เพิ่มหมวดหมู่
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
            onClick={fetchCategories}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            ลองใหม่
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Layers size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">ยังไม่มีหมวดหมู่ในระบบ</p>
          <p className="text-gray-400 text-sm mt-1">เริ่มต้นโดยเพิ่มหมวดหมู่แรกของห้องสมุด</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  {category.bookCount} เล่ม
                </span>
                <div className="flex items-center gap-1">
                  {canManage && (
                    <button
                      onClick={() => openEditModal(category)}
                      title="แก้ไขหมวดหมู่"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {canManage && (
                    <button
                      onClick={() => setDeletingCategory(category)}
                      title="ลบหมวดหมู่"
                      disabled={category.bookCount > 0}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{category.description || 'ไม่มีคำอธิบาย'}</p>
            </div>
          ))}
        </div>
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

      <CategoryFormModal
        isOpen={isFormOpen}
        category={editingCategory}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={deletingCategory !== null}
        title="ลบหมวดหมู่"
        message={`ต้องการลบหมวดหมู่ "${deletingCategory?.name}" ออกจากระบบใช่หรือไม่?`}
        confirmLabel="ลบหมวดหมู่"
        isDanger
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  )
}
