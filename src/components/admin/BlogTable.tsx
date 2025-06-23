import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  status: string;
  date: string;
  views: number;
  author: string;
  category: string;
  featured: boolean;
}

export default function BlogTable({ blogs, onDelete }: { blogs: Blog[]; onDelete: (blog: Blog) => void }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "archived":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div key={blog.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium leading-none">{blog.title}</h3>
              {blog.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>By {blog.author}</span>
              <span>•</span>
              <span>{blog.category}</span>
              <span>•</span>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.views} views</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
              <div className="flex items-center gap-1">
                {getStatusIcon(blog.status)}
                {blog.status}
              </div>
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/blog/${blog.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(blog)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
} 