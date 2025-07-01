"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Users, MessageSquare, RefreshCw, Mail, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ContactMessage } from "@/types/contactus-types"
import { ContactMessageCard } from "@/components/admin/contact-us/contact-message-card"
import { SenderMailManagement } from "@/components/admin/contact-us/sender-mail-management"
// Use the clean service that works with your API
import {  deleteContactMessage, getAllContactMessages, replyToContactMessage } from "@/service/contactusServices"

const ITEMS_PER_PAGE = 6

export default function ContactManagement() {
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [filteredContacts, setFilteredContacts] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const response = await getAllContactMessages()
      if (response.success && response.data) {
        setContacts(response.data)
        setFilteredContacts(response.data)
      } else {
        toast({
          title: "Info",
          description: response.error || response.message || "No contact messages available",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredContacts(filtered)
    setCurrentPage(1)
  }, [searchTerm, contacts])

  const handleDeleteContact = async (contactId: string) => {
    setDeletingIds((prev) => new Set(prev).add(contactId))
    try {
      const response = await deleteContactMessage(contactId)
      if (response.success) {
        setContacts((prev) => prev.filter((contact) => contact._id !== contactId))
        toast({
          title: "Success",
          description: response.message || "Contact message deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete contact message",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact message",
      })
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(contactId)
        return newSet
      })
    }
  }

  // Reply handler
  const handleReplyToContact = async (contactId: string, data: { message: string }) => {
    const response = await replyToContactMessage(contactId, data)
    if (response.success) {
      setContacts(prev => prev.map(msg => msg._id === contactId ? { ...msg, isReplied: true } : msg))
      toast({
        title: "Reply Sent",
        description: response.message || "Reply sent successfully",
      })
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to send reply",
      })
    }
  }

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentContacts = filteredContacts.slice(startIndex, endIndex)

  const ContactSkeleton = () => (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 px-2 sm:px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm sm:text-base">Contact Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Contact Management</h1>
              <p className="text-muted-foreground">Manage contact messages and sender email configurations</p>
            </div>

            <Tabs defaultValue="senders" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Contact Messages</span>
                  <span className="sm:hidden">Messages</span>
                </TabsTrigger>
                <TabsTrigger value="replied" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Replied Messages</span>
                  <span className="sm:hidden">Replied</span>
                </TabsTrigger>
                <TabsTrigger value="senders" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Sender Emails</span>
                  <span className="sm:hidden">Senders</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="messages" className="space-y-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{loading ? "..." : contacts.length}</div>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">This Month</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{loading ? "..." : contacts.length}</div>
                      <p className="text-xs text-muted-foreground">+20% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
                      <Filter className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{loading ? "..." : filteredContacts.length}</div>
                      <p className="text-xs text-muted-foreground">Current search</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">95%</div>
                      <p className="text-xs text-muted-foreground">Within 24 hours</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={fetchContacts}
                    disabled={loading}
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {/* Contact Messages Grid */}
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                      <ContactSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredContacts.filter(c => !c.isReplied).length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No unreplied messages found</h3>
                      <p className="text-gray-500 text-center max-w-sm">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Unreplied contact messages will appear here when received"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredContacts.filter(c => !c.isReplied).slice(startIndex, endIndex).map((contact) => (
                        <ContactMessageCard
                          key={contact._id}
                          contact={contact}
                          onDelete={handleDeleteContact}
                          isDeleting={deletingIds.has(contact._id)}
                          onReply={handleReplyToContact}
                        />
                      ))}
                    </div>
                    {/* Pagination */}
                    {Math.ceil(filteredContacts.filter(c => !c.isReplied).length / ITEMS_PER_PAGE) > 1 && (
                      <div className="flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            {[...Array(Math.ceil(filteredContacts.filter(c => !c.isReplied).length / ITEMS_PER_PAGE))].map((_, i) => (
                              <PaginationItem key={i + 1}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(i + 1)}
                                  isActive={currentPage === i + 1}
                                  className="cursor-pointer"
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setCurrentPage(Math.min(Math.ceil(filteredContacts.filter(c => !c.isReplied).length / ITEMS_PER_PAGE), currentPage + 1))}
                                className={
                                  currentPage === Math.ceil(filteredContacts.filter(c => !c.isReplied).length / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="replied" className="space-y-4">
                {/* Replied Messages Grid */}
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                      <ContactSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredContacts.filter(c => c.isReplied).length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Mail className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No replied messages found</h3>
                      <p className="text-gray-500 text-center max-w-sm">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Replied contact messages will appear here after you reply"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredContacts.filter(c => c.isReplied).slice(startIndex, endIndex).map((contact) => (
                        <ContactMessageCard
                          key={contact._id}
                          contact={contact}
                          onDelete={handleDeleteContact}
                          isDeleting={deletingIds.has(contact._id)}
                          // No reply button for replied messages
                        />
                      ))}
                    </div>
                    {/* Pagination */}
                    {Math.ceil(filteredContacts.filter(c => c.isReplied).length / ITEMS_PER_PAGE) > 1 && (
                      <div className="flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            {[...Array(Math.ceil(filteredContacts.filter(c => c.isReplied).length / ITEMS_PER_PAGE))].map((_, i) => (
                              <PaginationItem key={i + 1}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(i + 1)}
                                  isActive={currentPage === i + 1}
                                  className="cursor-pointer"
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setCurrentPage(Math.min(Math.ceil(filteredContacts.filter(c => c.isReplied).length / ITEMS_PER_PAGE), currentPage + 1))}
                                className={
                                  currentPage === Math.ceil(filteredContacts.filter(c => c.isReplied).length / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="senders" className="space-y-4">
                <SenderMailManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
