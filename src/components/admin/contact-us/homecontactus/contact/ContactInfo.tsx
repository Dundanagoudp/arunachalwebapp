'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MapPin, 
  Mail, 
  Calendar, 
  Building2,
  Phone
} from 'lucide-react'
import { getContactInfo } from '@/service/homeService'
import type { ContactInfo } from '@/types/home-types'

const ContactInfo: React.FC = () => {
  const [contactData, setContactData] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await getContactInfo()
        if (response.success && response.data) {
          const data = Array.isArray(response.data) ? response.data[0] : response.data
          setContactData(data)
        }
      } catch (error) {
        console.error('Failed to fetch contact information:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!contactData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Contact information not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">Get in touch with us</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Office Address */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                <p className="text-gray-700 leading-relaxed">
                  {contactData.officeAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Venue */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Venue</h3>
                <p className="text-gray-700 leading-relaxed">
                  {contactData.eventVenue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Contact */}
        <Card className="hover:shadow-lg transition-shadow md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Contact</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{' '}
                    <a 
                      href={contactData.emailLink?.startsWith('mailto:') ? contactData.emailLink : `mailto:${contactData.emailLink}`}
                      className="text-primary hover:underline"
                    >
                      {contactData.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContactInfo