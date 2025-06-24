// Minimal type definitions for use-toast.ts compatibility
import type { ReactNode } from "react"

export interface ToastProps {
  id?: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement<any, any> 