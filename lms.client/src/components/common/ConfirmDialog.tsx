import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  isDanger?: boolean
  isBusy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'ยืนยัน',
  isDanger = false,
  isBusy = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const [isMounted, setIsMounted] = useState(isOpen)

  useEffect(() => {
    if (isOpen) setIsMounted(true)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isBusy, onCancel])

  if (!isMounted || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={isBusy ? undefined : onCancel} />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-5">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1 break-words">{message}</p>
          </div>
          {!isBusy && (
            <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={isBusy}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            disabled={isBusy}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer ${
              isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isBusy ? 'กำลังดำเนินการ...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
