"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Blog } from "@/types/newAndBlogTypes";
import { getBlogOnly, getBlogs } from "@/service/newsAndBlogs";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Mail,
  Search,
  Send,
  Tag,
  User,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";

// Loading skeleton for the blog content
const BlogContentSkeleton = () => (
  <div className="min-h-screen bg-[#FFFAEE] p-4 sm:p-6 lg:p-8">
    <Card className="p-6">
      <article className="prose dark:prose-invert max-w-none">
        <header className="mb-8 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </header>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-3/6" />
        </div>
      </article>
    </Card>
  </div>
);

export default function BlogById() {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const handelAllBlogs = () => {
    route.push("/blogsContent");
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Blog ID is missing");
        }

        const response = await getBlogOnly(id);
        const reponse1 = await getBlogs();

        if (!response.data) {
          throw new Error("Failed to fetch blog content");
        }

        setContent(response.data);
        setBlogs(reponse1.data ?? []);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (isLoading) {
    return <BlogContentSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFAEE] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="p-6 max-w-2xl w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#FFFAEE] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="p-6 max-w-2xl w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
          <p className="text-muted-foreground">
            The requested blog post could not be found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE] p-4 sm:p-6 lg:p-8">
      <header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/blogsContent">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Blogs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="space-y-8">
              {/* Featured Image */}
              <div className="w-full relative group">
                {content.image_url && (
                  <>
                    <Image
                      src={content.image_url}
                      alt={content.title}
                      width={1080}
                      height={1920}
                      className="w-full h-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-sm bg-[#D96D34]/90 px-2 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Featured Article
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Article Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[#D96D34]">
                  <BookOpen className="w-4 h-4" />
                  <span>Blog Post</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-blue-800 leading-tight">
                  {content.title}
                </h1>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{content.author || "Anonymous"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {content.publishedDate
                        ? new Date(content.publishedDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Unknown date"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed border-t border-gray-200 pt-6">
                <p className="text-lg">{content.contents}</p>
              </div>

              {/* Tags/Categories */}
              <div className="flex flex-wrap gap-2 pt-4">
                <span className="bg-[#FFFAEE] border border-[#D96D34] text-[#D96D34] px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Technology
                </span>
                <span className="bg-[#FFFAEE] border border-[#D96D34] text-[#D96D34] px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Design
                </span>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search Bar */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-[#D96D34] text-base bg-transparent"
                  />
                </div>
                <button className="bg-[#D96D34] text-white px-4 py-3 rounded-lg flex items-center gap-1 hover:bg-[#c05d2b] transition-colors">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Latest Blogs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#D96D34]" />
                <h2 className="text-xl font-bold text-blue-800">
                  Latest Posts
                </h2>
              </div>

              <div className="space-y-4">
                {blogs
                  .sort(
                    (a, b) =>
                      new Date(
                        b.publishedDate?.toLocaleString() ?? ""
                      ).getTime() -
                      new Date(
                        a.publishedDate?.toLocaleString() ?? ""
                      ).getTime()
                  )
                  .slice(0, 5)
                  .map((blog) => (
                    <div
                      key={blog._id}
                      className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0 group"
                    >
                      <div className="flex-shrink-0 relative overflow-hidden rounded-lg w-16 h-16">
                        <Image
                          src={blog.image_url || "/placeholder.svg"}
                          alt={blog.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {blog.publishedDate
                            ? new Date(blog.publishedDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "Unknown date"}
                        </p>
                        <h3 className="text-sm font-medium text-blue-800 leading-tight truncate group-hover:text-[#D96D34] transition-colors cursor-pointer">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <User className="w-3 h-3" />
                          <span>{blog.author || "Anonymous"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <button className="mt-4 w-full text-center text-sm text-[#D96D34] font-medium flex items-center justify-center gap-1 hover:underline" onClick={handelAllBlogs}>
                View all articles
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
