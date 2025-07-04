"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/speaker/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getSpeaker, deleteSpeaker, getEvent } from "@/service/speaker";
import type { Speaker, Event } from "@/types/speaker-types";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useDeletePermission } from "@/hooks/use-delete-permission";
import { ContactAdminModal } from "@/components/ui/contact-admin-modal";

// Utility function to truncate text to a specified length
function truncate(text: string, maxLength: number) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function SpeakersPage() {
  const { isAdmin } = useDeletePermission();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(speakers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpeakers = speakers.slice(startIndex, endIndex);

  // Reset to page 1 if speakers list changes and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [speakers, totalPages]);

  // Generate pagination items (with ellipsis)
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) items.push(i);
        items.push("ellipsis");
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) items.push(i);
      } else {
        items.push(1);
        items.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
        items.push("ellipsis");
        items.push(totalPages);
      }
    }
    return items;
  };

  useEffect(() => {
    fetchSpeakers();
    fetchEvents();
  }, []);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getSpeaker();

      console.log("API Response:", response); // Debug log

      if (response.success && response.data) {
        setSpeakers(response.data);
      } else {
        setError(response.error || "Failed to fetch speakers");
        setSpeakers([]);
      }
    } catch (err) {
      console.error("Fetch speakers error:", err);
      setError("Failed to fetch speakers");
      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getEvent();
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch events");
    }
  };

  const handleDelete = async (speakerId: string) => {
    try {
      setDeleteLoading(speakerId);
      const response = await deleteSpeaker(speakerId);
      if (response.success) {
        setSuccess("Speaker deleted successfully!");
        setSpeakers(speakers.filter((speaker) => speaker._id !== speakerId));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.error || "Failed to delete speaker");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("Failed to delete speaker");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getEventName = (eventId: string) => {
    const event = events.find((e) => e._id === eventId);
    return event ? `${event.name} (${event.year})` : "Unknown Event";
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Speakers Management
          </h1>
          <p className="text-muted-foreground">
            Manage all speakers for your events.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/admin/dashboard/speakers/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Speaker
            </Link>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Speakers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Speakers</CardTitle>
          <CardDescription>
            {loading
              ? "Loading speakers..."
              : `Total ${speakers.length} speakers found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading speakers...</span>
            </div>
          ) : !Array.isArray(speakers) || speakers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No speakers found</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Get started by adding your first speaker.
              </p>
              <Button asChild>
                <Link href="/admin/dashboard/speakers/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Speaker
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[600px] lg:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 sm:w-20">Image</TableHead>
                    <TableHead className="min-w-[120px]">Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      About
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Event
                    </TableHead>
                    <TableHead className="text-right w-[180px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSpeakers.map((speaker) => (
                    <TableRow key={speaker._id}>
                      <TableCell>
                        {speaker.image_url ? (
                          <Image
                            src={speaker.image_url || "/placeholder.svg"}
                            alt={speaker.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{speaker.name}</span>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {truncate(speaker.about, 30)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] lg:max-w-xs">
                        <p className="truncate">{speaker.about}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 hidden xs:inline" />
                          {getEventName(speaker.event_ref)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="p-2 sm:px-3 sm:py-1"
                          >
                            <Link
                              href={`/admin/dashboard/speakers/${speaker._id}/edit`}
                            >
                              <Edit className="h-3 w-3 sm:mr-2" />
                              <span className="hidden sm:inline">Edit</span>
                            </Link>
                          </Button>
                          {isAdmin ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={deleteLoading === speaker._id}
                                  className="p-2 sm:px-3 sm:py-1"
                                >
                                  {deleteLoading === speaker._id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <>
                                      <Trash2 className="h-3 w-3 sm:mr-2" />
                                      <span className="hidden sm:inline">
                                        Delete
                                      </span>
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this speaker
                                    and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={async () => {
                                      try {
                                        setDeleteLoading(speaker._id);
                                        await handleDelete(speaker._id); // Your delete function
                                      } finally {
                                        setDeleteLoading(null);
                                      }
                                    }}
                                    disabled={deleteLoading === speaker._id}
                                  >
                                    {deleteLoading === speaker._id ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <ContactAdminModal
                              title="Delete Speaker Access Denied"
                              description="You don't have permission to delete speakers. Please contact the administrator for assistance."
                            >
                              <Button
                                variant="destructive"
                                size="sm"
                                className="p-2 sm:px-3 sm:py-1"
                              >
                                <Trash2 className="h-3 w-3 sm:mr-2" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </ContactAdminModal>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Responsive Pagination */}
              <div className="flex flex-col items-center gap-2 py-4 px-2 sm:px-0">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={`${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        } text-xs sm:text-sm`}
                      />
                    </PaginationItem>
                    {generatePaginationItems().map((item, idx) => (
                      <PaginationItem key={idx}>
                        {item === "ellipsis" ? (
                          <PaginationEllipsis className="hidden sm:flex" />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === item}
                            onClick={() => setCurrentPage(item as number)}
                            className="cursor-pointer text-xs sm:text-sm"
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        } text-xs sm:text-sm`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <div className="text-xs text-muted-foreground text-center">
                  Page {currentPage} of {totalPages} • Showing{" "}
                  {speakers.length === 0 ? 0 : startIndex + 1}-
                  {Math.min(endIndex, speakers.length)} of {speakers.length}{" "}
                  speakers
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
