export interface MemberDto {
  id: string
  memberCode: string
  fullName: string
  email: string
  phoneNumber?: string | null
  isActive: boolean
  joinDate: string
  activeLoans: number
}

export interface MemberRequest {
  fullName: string
  email: string
  phoneNumber?: string
  isActive: boolean
}
