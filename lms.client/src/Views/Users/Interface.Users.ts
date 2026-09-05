export type UserRole = 'Admin' | 'Librarian' | 'Member'

export interface UserDto {
  id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export interface CreateUserRequest {
  username: string
  fullName: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  fullName: string
  email: string
  role: UserRole
  isActive: boolean
}

/** ข้อมูลจากฟอร์ม: edit mode ส่ง newPassword ได้ (ไม่กรอก = ไม่เปลี่ยนรหัสผ่าน) */
export interface UserFormValues {
  username?: string
  fullName: string
  email: string
  password?: string
  newPassword?: string
  role: UserRole
  isActive: boolean
}
