'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  MapPin, 
  Mail, 
  Calendar, 
  Building2,
  X
} from 'lucide-react'
import type { ContactInfo, AddContactInfoRequest, UpdateContactInfoRequest } from '@/types/home-types'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddContactInfoRequest | UpdateContactInfoRequest) => void
  contact?: ContactInfo | null
  isSubmitting: boolean
  isEditing: boolean
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contact,
  isSubmitting,
  isEditing
}) => {
  const [formData, setFormData] = useState({
    officeAddress: '',
    eventVenue: '',
    email: '',
    emailLink: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when modal opens or contact changes
  useEffect(() => {
    if (isOpen) {
      if (contact && isEditing) {
        setFormData({
          officeAddress: contact.officeAddress || '',
          eventVenue: contact.eventVenue || '',
          email: contact.email || '',
          emailLink: contact.emailLink || ''
        })
      } else {
        setFormData({
          officeAddress: '',
          eventVenue: '',
          email: '',
          emailLink: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, contact, isEditing])

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.officeAddress.trim()) {
      newErrors.officeAddress = 'Office address is required'
    }

    if (!formData.eventVenue.trim()) {
      newErrors.eventVenue = 'Event venue is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.emailLink.trim()) {
      newErrors.emailLink = 'Email link is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailLink)) {
      newErrors.emailLink = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl">
                {isEditing ? 'Edit Contact Information' : 'Add Contact Information'}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Office Address */}
          <div className="space-y-2">
            <Label htmlFor="officeAddress" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Office Address
            </Label>
            <Textarea
              id="officeAddress"
              value={formData.officeAddress}
              onChange={(e) => handleInputChange('officeAddress', e.target.value)}
              placeholder="Enter the office address..."
              className={`min-h-[100px] ${errors.officeAddress ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.officeAddress && (
              <p className="text-sm text-red-600">{errors.officeAddress}</p>
            )}
          </div>

          {/* Event Venue */}
          <div className="space-y-2">
            <Label htmlFor="eventVenue" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              Event Venue
            </Label>
            <Textarea
              id="eventVenue"
              value={formData.eventVenue}
              onChange={(e) => handleInputChange('eventVenue', e.target.value)}
              placeholder="Enter the event venue address..."
              className={`min-h-[100px] ${errors.eventVenue ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.eventVenue && (
              <p className="text-sm text-red-600">{errors.eventVenue}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-600" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address..."
              className={errors.email ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Email Link */}
          <div className="space-y-2">
            <Label htmlFor="emailLink" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-600" />
              Email Link
            </Label>
            <Input
              id="emailLink"
              type="email"
              value={formData.emailLink}
              onChange={(e) => handleInputChange('emailLink', e.target.value)}
              placeholder="Enter email link..."
              className={errors.emailLink ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.emailLink && (
              <p className="text-sm text-red-600">{errors.emailLink}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                isEditing ? 'Update Contact' : 'Add Contact'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ContactModal