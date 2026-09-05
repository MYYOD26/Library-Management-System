/** ฟังก์ชันช่วยจัดรูปแบบวันที่ (ภาษาไทย) และคำนวณวันครบกำหนด */

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/** จำนวนวันที่เหลือจนถึงวันครบกำหนด (ติดลบ = เกินกำหนดไปแล้ว) */
export function daysUntil(isoDate: string): number {
  const dueDate = new Date(isoDate)
  const today = new Date()
  return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
