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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  LinkIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  MoreHorizontal,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBlogs, deleteBlog } from "@/service/newsAndBlogs";
import type { Blog } from "@/types/newAndBlogTypes";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function NewsAndBlogsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [newsAndBlogs, setNewsAndBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError("");
      try {
        const response = await getBlogs();
        if (response.success && Array.isArray(response.data)) {
          setNewsAndBlogs(response.data);
        } else {
          setError(response.message || "Failed to fetch blogs");
        }
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Reset to first page on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, contentTypeFilter, newsAndBlogs]);

  const handleEdit = (id: string) => {
    router.push(`/admin/dashboard/content/edit/${id}`);
  };
  const filteredContent = newsAndBlogs.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (content.contents &&
        content.contents.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType =
      contentTypeFilter === "all" || content.contentType === contentTypeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredContent.length / pageSize);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async (contentId: string) => {
    try {
      setDeleteLoading(contentId);
      setSuccess("");
      const response = await deleteBlog(contentId);
      if (response.success) {
        setSuccess("Content deleted successfully!");
        setNewsAndBlogs(
          newsAndBlogs.filter((content) => content._id !== contentId)
        );
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setSuccess(response.error || "Failed to delete content");
      }
    } catch (error) {
      setSuccess("Failed to delete content");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            News & Blogs Management
          </h1>
          <p className="text-muted-foreground">
            Manage news articles, blog posts, and external links.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/content/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Content
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsAndBlogs.length}</div>
            <p className="text-xs text-muted-foreground">All content pieces</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsAndBlogs.filter((c) => c.contentType === "blog").length}
            </div>
            <p className="text-xs text-muted-foreground">Full articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsAndBlogs.filter((c) => c.contentType === "link").length}
            </div>
            <p className="text-xs text-muted-foreground">External links</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          {/* <CardContent>
            <div className="text-2xl font-bold">
              {contents.reduce((sum, content) => sum + content.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent> */}
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search content</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <select
                id="contentType"
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Types</option>
                <option value="blog">Blog Posts</option>
                <option value="link">News Links</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>All Content</CardTitle>
          <CardDescription>
            {filteredContent.length} content piece
            {filteredContent.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedContent.map((content) => (
              <div
                key={content._id}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <div className="w-24 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={content.image_url || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {content.title}
                    </h3>
                    <Badge
                      variant={
                        content.contentType === "blog" ? "default" : "secondary"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {content.contentType === "blog" ? (
                          <FileText className="h-3 w-3" />
                        ) : (
                          <LinkIcon className="h-3 w-3" />
                        )}
                        {content.contentType}
                      </div>
                    </Badge>
                  </div>
                  {content.contentType === "blog" && content.contents && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.contents}
                    </p>
                  )}
                  {content.contentType === "link" && content.link && (
                    <div className="group flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                      <ExternalLink className="h-4 w-4" />
                      <a
                        href={content.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-[180px] hover:underline"
                        title={content.link} // Tooltip with full URL
                      >
                        {content.link
                          .replace(/^https?:\/\/(www\.)?/, "")
                          .substring(0, 20)}
                        {content.link.length > 20 && "..."}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Published: {content.publishedDate?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {/* <span>{content.views} views</span> */}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleEdit(content._id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {content.contentType === "link" && content.link && (
                        <DropdownMenuItem asChild>
                          <a
                            href={content.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Link
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(content._id)}
                      >
                        {deleteLoading === content._id ? (
                          <span className="flex items-center">
                            <Trash2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Deleting...
                          </span>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {success && (
        <div className="p-2 bg-green-100 text-green-800 rounded mb-2">
          {success}
        </div>
      )}
    </div>
  );
}
