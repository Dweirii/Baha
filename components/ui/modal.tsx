"use client"

import React from "react"
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"
import Button from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  description,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[90%] md:max-w-2xl lg:max-w-4xl w-full p-0 gap-0 shadow-lg",
          "max-h-[80vh] overflow-y-auto",
          className
        )}
      >
        <div className="relative w-full bg-background">
          {(title || description) && (
            <DialogHeader className="px-4 pt-5 pb-2 sm:px-6">
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}

          {/* Close button */}
          <Button
            className="absolute right-4 top-4 h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          {/* Main content area where the image and details go side by side */}
          <div className="p-4 sm:p-6 lg:p-8 pt-2">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal
