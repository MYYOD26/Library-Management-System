import { useState } from 'react'
import { useMembers } from './useMembers'
import { membersService } from './membersService'
import MemberFormModal from './MemberFormModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import type { MemberDto, MemberRequest } from './Interface.Members'
import { formatDate } from '../../Services/format'
import { AlertCircle, Plus, Search, Trash2, Pencil, Users } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext'

export default function MembersPage() {
  const { members, isLoading, error, search, handleSearch, fetchMembers } = useMembers()
  const { canManage } = useAuth()

  const [searchInput, setSearchInput] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<MemberDto | null>(null)
  const [deletingMember, setDeletingMember] = useState<MemberDto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingMember(null)
    setIsFormOpen(true)
  }

  const openEditModal = (member: MemberDto) => {
    setEditingMember(member)
    setIsFormOpen(true)
  }

  const handleSearchSubmit = (value: string) => {
    setSearchInput(value)
    handleSearch(value)
  }

  const handleFormSubmit = async (data: MemberRequest) => {
    if (editingMember) {
      await membersService.updateMember(editingMember.id, data)
      setSuccessMessage('บันทึกการแก้ไขข้อมูลสมาชิกเรียบร้อยแล้ว')
    } else {
      await membersService.createMember(data)
      setSuccessMessage('เพิ่มสมาชิกใหม่เรียบร้อยแล้ว')
    }
    setIsFormOpen(false)
    fetchMembers(search)
  }

  const handleDelete = async () => {
    if (!deletingMember) return
    setIsDeleting(true)
    setActionError(null)
    try {
      await membersService.deleteMember(deletingMember.id)
      setSuccessMessage('ลบสมาชิกเรียบร้อยแล้ว')
      setDeletingMember(null)
      fetchMembers(search)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'ไม่สามารถลบสมาชิกได้')
      setDeletingMember(null)
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
            <Users size={16} /> การจัดการ (Admin)
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">จัดการสมาชิกห้องสมุด</h1>
          <p className="text-red-100 text-sm">เพิ่ม แก้ไข และติดตามสถานะสมาชิกทั้งหมดในระบบ</p>
        </div>

        {canManage && (
          <button
            onClick={openCreateModal}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Plus size={18} /> เพิ่มสมาชิก
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
            onClick={() => fetchMembers(search)}
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
            placeholder="ค้นหาด้วยชื่อ รหัสสมาชิก หรืออีเมล..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">ไม่พบสมาชิกในระบบ</p>
            <p className="text-gray-400 text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มสมาชิกใหม่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">รหัสสมาชิก</th>
                  <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                  <th className="py-3 px-4">อีเมล</th>
                  <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                  <th className="py-3 px-4">วันที่สมัคร</th>
                  <th className="py-3 px-4 text-center">กำลังยืม</th>
                  <th className="py-3 px-4 text-center">สถานะ</th>
                  <th className="py-3 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-red-600">{member.memberCode}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{member.fullName}</td>
                    <td className="py-3.5 px-4 text-gray-600">{member.email}</td>
                    <td className="py-3.5 px-4 text-gray-600">{member.phoneNumber || '—'}</td>
                    <td className="py-3.5 px-4 text-gray-500">{formatDate(member.joinDate)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-semibold ${member.activeLoans > 0 ? 'text-amber-600' : 'text-gray-400'}`}
                      >
                        {member.activeLoans}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          member.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {member.isActive ? 'ใช้งานอยู่' : 'ปิดการใช้งาน'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {canManage && (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(member)}
                            title="แก้ไขข้อมูล"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingMember(member)}
                            title={member.activeLoans > 0 ? 'สมาชิกยังมีหนังสือที่ต้องคืน' : 'ลบสมาชิก'}
                            disabled={member.activeLoans > 0}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      {canManage && (
        <button
          onClick={openCreateModal}
          className="sm:hidden fixed bottom-6 right-6 z-40 p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          <Plus size={22} />
        </button>
      )}

      <MemberFormModal
        isOpen={isFormOpen}
        member={editingMember}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={deletingMember !== null}
        title="ลบสมาชิก"
        message={`ต้องการลบสมาชิก "${deletingMember?.fullName}" (${deletingMember?.memberCode}) ออกจากระบบใช่หรือไม่?`}
        confirmLabel="ลบสมาชิก"
        isDanger
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingMember(null)}
      />
    </div>
  )
}
