import { useState } from 'react'
import { useUsers } from './useUsers'
import { usersService } from './usersService'
import UserFormModal from './UserFormModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useAuth } from '../../Context/AuthContext'
import type { UserDto, UserFormValues } from './Interface.Users'
import { formatDate } from '../../Services/format'
import { AlertCircle, Pencil, Plus, Search, ShieldX, Trash2, UserCog } from 'lucide-react'

const roleLabels: Record<string, string> = {
  Admin: 'ผู้ดูแลระบบ',
  Librarian: 'บรรณารักษ์',
  Member: 'สมาชิก'
}

const roleBadgeStyles: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700',
  Librarian: 'bg-blue-100 text-blue-700',
  Member: 'bg-emerald-100 text-emerald-700'
}

export default function UsersPage() {
  const { isAdmin, user: currentUser } = useAuth()
  const { users, isLoading, error, search, handleSearch, fetchUsers } = useUsers()

  const [searchInput, setSearchInput] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDto | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserDto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm select-none">
        <ShieldX size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        <p className="text-gray-400 text-sm mt-1">เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่จัดการผู้ใช้ระบบได้</p>
      </div>
    )
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const openEditModal = (user: UserDto) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleSearchSubmit = (value: string) => {
    setSearchInput(value)
    handleSearch(value)
  }

  const handleFormSubmit = async (values: UserFormValues) => {
    if (editingUser) {
      await usersService.updateUser(editingUser.id, {
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        isActive: values.isActive
      })
      if (values.newPassword) {
        await usersService.resetPassword(editingUser.id, values.newPassword)
      }
      setSuccessMessage('บันทึกการแก้ไขผู้ใช้เรียบร้อยแล้ว')
    } else {
      await usersService.createUser({
        username: values.username!,
        fullName: values.fullName,
        email: values.email,
        password: values.password!,
        role: values.role
      })
      setSuccessMessage('เพิ่มผู้ใช้ระบบใหม่เรียบร้อยแล้ว')
    }
    setIsFormOpen(false)
    fetchUsers(search)
  }

  const handleDelete = async () => {
    if (!deletingUser) return
    setIsDeleting(true)
    setActionError(null)
    try {
      await usersService.deleteUser(deletingUser.id)
      setSuccessMessage('ลบผู้ใช้เรียบร้อยแล้ว')
      setDeletingUser(null)
      fetchUsers(search)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'ไม่สามารถลบผู้ใช้ได้')
      setDeletingUser(null)
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
            <UserCog size={16} /> การจัดการ (Admin)
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">จัดการผู้ใช้ระบบ</h1>
          <p className="text-red-100 text-sm">เพิ่มบัญชีเข้าสู่ระบบและกำหนดสิทธิ์ (Role) ของผู้ใช้ในระบบ</p>
        </div>

        <button
          onClick={openCreateModal}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Plus size={18} /> เพิ่มผู้ใช้
        </button>
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
            onClick={() => fetchUsers(search)}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            ลองใหม่
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchSubmit(e.target.value)}
            placeholder="ค้นหาด้วยชื่อผู้ใช้ ชื่อ-นามสกุล หรืออีเมล..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center">
            <UserCog size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">ไม่พบผู้ใช้ในระบบ</p>
            <p className="text-gray-400 text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มผู้ใช้ใหม่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">ชื่อผู้ใช้</th>
                  <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                  <th className="py-3 px-4">อีเมล</th>
                  <th className="py-3 px-4 text-center">Role</th>
                  <th className="py-3 px-4">วันที่สร้าง</th>
                  <th className="py-3 px-4 text-center">สถานะ</th>
                  <th className="py-3 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-red-600">
                        {user.username}
                        {isSelf && <span className="ml-2 text-[10px] font-bold text-gray-400">(คุณ)</span>}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">{user.fullName}</td>
                      <td className="py-3.5 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            roleBadgeStyles[user.role] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {roleLabels[user.role] ?? user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {user.isActive ? 'ใช้งานอยู่' : 'ปิดการใช้งาน'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(user)}
                            title="แก้ไขผู้ใช้"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingUser(user)}
                            title={isSelf ? 'ไม่สามารถลบบัญชีของตัวเองได้' : 'ลบผู้ใช้'}
                            disabled={isSelf}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={openCreateModal}
        className="sm:hidden fixed bottom-6 right-6 z-40 p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
      >
        <Plus size={22} />
      </button>

      <UserFormModal
        isOpen={isFormOpen}
        user={editingUser}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={deletingUser !== null}
        title="ลบผู้ใช้ระบบ"
        message={`ต้องการลบบัญชี "${deletingUser?.username}" (${deletingUser?.fullName}) ออกจากระบบใช่หรือไม่?`}
        confirmLabel="ลบผู้ใช้"
        isDanger
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  )
}
