'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Mail, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2
} from 'lucide-react'
import { 
  addContactInfo, 
  getContactInfo, 
  updateContactInfo, 
  deleteContactInfo 
} from '@/service/homeService'
import type { ContactInfo, AddContactInfoRequest, UpdateContactInfoRequest } from '@/types/home-types'
import { toast } from 'sonner'
import ContactModal from './ContactModal'
import DeleteConfirmModal from './DeleteConfirmModal'

const HomeContactPage: React.FC = () => {
  const [contactData, setContactData] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingContact, setDeletingContact] = useState<ContactInfo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch contact information
  const fetchContactInfo = async () => {
    try {
      setLoading(true)
      const response = await getContactInfo()
      if (response.success && response.data) {
        setContactData(Array.isArray(response.data) ? response.data : [response.data])
      } else {
        toast.error(response.error || 'Failed to fetch contact information')
      }
    } catch (error) {
      toast.error('An error occurred while fetching contact information')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContactInfo()
  }, [])

  // Handle add contact
  const handleAddContact = async (data: AddContactInfoRequest | UpdateContactInfoRequest) => {
    try {
      setIsSubmitting(true)
      const response = await addContactInfo(data as AddContactInfoRequest)
      if (response.success) {
        toast.success(response.message || 'Contact information added successfully')
        setIsModalOpen(false)
        fetchContactInfo()
      } else {
        toast.error(response.error || 'Failed to add contact information')
      }
    } catch (error) {
      toast.error('An error occurred while adding contact information')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle update contact
  const handleUpdateContact = async (id: string, data: AddContactInfoRequest | UpdateContactInfoRequest) => {
    try {
      setIsSubmitting(true)
      const response = await updateContactInfo(id, data as UpdateContactInfoRequest)
      if (response.success) {
        toast.success(response.message || 'Contact information updated successfully')
        setIsModalOpen(false)
        setEditingContact(null)
        fetchContactInfo()
      } else {
        toast.error(response.error || 'Failed to update contact information')
      }
    } catch (error) {
      toast.error('An error occurred while updating contact information')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete contact
  const handleDeleteContact = async (contact: ContactInfo) => {
    setDeletingContact(contact)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete contact
  const confirmDeleteContact = async () => {
    if (!deletingContact) return

    try {
      setIsDeleting(true)
      const response = await deleteContactInfo(deletingContact._id)
      if (response.success) {
        toast.success(response.message || 'Contact information deleted successfully')
        setIsDeleteModalOpen(false)
        setDeletingContact(null)
        fetchContactInfo()
      } else {
        toast.error(response.error || 'Failed to delete contact information')
      }
    } catch (error) {
      toast.error('An error occurred while deleting contact information')
    } finally {
      setIsDeleting(false)
    }
  }

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false)
      setDeletingContact(null)
    }
  }

  // Open modal for editing
  const openEditModal = (contact: ContactInfo) => {
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingContact(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
          <p className="text-gray-600 mt-1">Manage contact details for the home page</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Contact Info
        </Button>
      </div>

      {/* Contact Information Cards */}
      {contactData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contact Information</h3>
            <p className="text-gray-600 text-center mb-4">
              No contact information has been added yet. Click the button above to add contact details.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact Information
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {contactData.map((contact) => (
            <Card key={contact._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Contact Information</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContact(contact)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Office Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Office Address</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {contact.officeAddress}
                    </p>
                  </div>
                </div>

                {/* Event Venue */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Event Venue</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {contact.eventVenue}
                    </p>
                  </div>
                </div>

                {/* Email Information */}
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email Contact</h4>
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span> {contact.email}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Email Link:</span> {contact.emailLink}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-end pt-2">
                  {/* <Badge variant="secondary" className="text-xs">
                    ID: {contact._id}
                  </Badge> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingContact ? 
          (data) => handleUpdateContact(editingContact._id, data) : 
          handleAddContact
        }
        contact={editingContact}
        isSubmitting={isSubmitting}
        isEditing={!!editingContact}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteContact}
        isDeleting={isDeleting}
        itemName="contact information"
      />
    </div>
  )
}

export default HomeContactPage
