"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCategory, updateBlogs, getBlogById } from "@/service/newsAndBlogs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-separator";
import { Toggle } from "@/components/ui/toggle";
import { useParams } from "next/navigation";
import { Blog } from "@/types/newAndBlogTypes";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  contentType: z.enum(["blog", "link"]),
  publishedDate: z.date({
    required_error: "A published date is required.",
  }),
  contents: z.string().optional(),
  link: z.string().url("Please enter a valid URL").optional(),
  image: z.instanceof(File).optional(),
  category_ref: z.string().min(1, "Please select a category"),
}).refine((data) => {
    return data.contentType === "blog" ? !!data.contents?.trim() : true;
  }, {
    message: "Contents are required for blog type",
    path: ["contents"],
  })
  .refine((data) => {
    return data.contentType === "link" ? !!data.link?.trim() : true;
  }, {
    message: "Link is required for link type",
    path: ["link"],
  });



type FormValues = z.infer<typeof formSchema>;

interface Category {
  _id: string;
  name: string;
}

export default function EditNewsBlogForm() {
  const params = useParams();
  const id = params.id as string;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      contentType: "blog",
      publishedDate: new Date(),
      contents: "",
      link: "",
      category_ref: "",
    },
  });

  const contentType = form.watch("contentType");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Fetch blog data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setBlogLoading(true);
      try {
        // Fetch blog data
        const blogResponse = await getBlogById(id);
        if (blogResponse.success && blogResponse.data) {
          const blogData = blogResponse.data;
          setBlog(blogData);

          // Update form with existing data
          form.reset({
            title: blogData.title || "",
            contentType: blogData.contentType || "blog",
            publishedDate: blogData.publishedDate
              ? new Date(blogData.publishedDate)
              : new Date(),
            contents: blogData.contents || "",
            link: blogData.link || "",
            category_ref: blogData.category_ref || "",
          });

          // Set preview image
          if (blogData.image_url) {
            setPreviewImage(blogData.image_url);
          }
        }

        // Fetch categories
        const categoryResponse = await getCategory();
        if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
          setOptions(categoryResponse.data);
        }
      } catch (error) {
        // Error fetching data
      } finally {
        setBlogLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("category_ref", values.category_ref);
      formData.append("title", values.title);
      formData.append("contentType", values.contentType);
      formData.append("publishedDate", values.publishedDate.toISOString());

      // Preserve existing image if no new image is uploaded
      if (!values.image && blog?.image_url) {
        formData.append("existingImage", blog.image_url);
      }

      // Handle content based on type
      if (values.contentType === "blog") {
        // Always send contents, even if empty
        formData.append("contents", values.contents || "");
      } else if (values.contentType === "link") {
        formData.append("link", values.link || "");
      }

      // Add new image if uploaded
      if (values.image) {
        formData.append("image_url", values.image);
      }

      const response = await updateBlogs(id, formData);

      if (!response.success) {
        throw new Error("Failed to update blog: " + response.message);
      }

      // Success handling...
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRemoveImage = () => {
    setPreviewImage(null);
    form.setValue("image", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (blogLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading blog data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">
            Edit Content
          </CardTitle>
          <CardDescription>
            Update your blog post, article, or external link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="category_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    {blog?.category_ref && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Current:{" "}
                        {options.find(
                          (cat) => cat._id === blog.category_ref
                        )?.name || "Unknown"}
                      </div>
                    )}
                    <FormControl>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading categories...</span>
                        </div>
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((categories) => (
                              <SelectItem
                                key={categories._id}
                                value={categories._id}
                              >
                                {categories.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <div className="w-full">
                        <FormLabel className="mb-2 block text-sm font-medium text-muted-foreground">
                          Select Content Type
                        </FormLabel>
                        {blog?.contentType && (
                          <div className="text-sm text-muted-foreground mb-2">
                            Current:{" "}
                            {blog.contentType === "blog"
                              ? "📝 Blog Post"
                              : "🔗 External Link"}
                          </div>
                        )}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2 rounded-lg w-full sm:w-fit shadow-sm bg-muted">
                          <Toggle
                            variant={
                              field.value === "blog" ? "default" : "outline"
                            }
                            pressed={field.value === "blog"}
                            onPressedChange={() => field.onChange("blog")}
                            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 rounded-lg hover:scale-[1.02] min-w-[120px]"
                          >
                            📝 Blog Post
                          </Toggle>
                          <Toggle
                            variant={
                              field.value === "link" ? "default" : "outline"
                            }
                            pressed={field.value === "link"}
                            onPressedChange={() => field.onChange("link")}
                            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 rounded-lg hover:scale-[1.02] min-w-[120px]"
                          >
                            🔗 External Link
                          </Toggle>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          blog?.title
                            ? `Current: ${blog.title}`
                            : "Enter title"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {contentType === "blog" ? (
                <FormField
                  control={form.control}
                  name="contents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            blog?.contents
                              ? `Current content: ${blog.contents.substring(
                                  0,
                                  100
                                )}...`
                              : "Write your blog content here..."
                          }
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            blog?.link
                              ? `Current: ${blog.link}`
                              : "https://example.com"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Published Date</FormLabel>
                    {blog?.publishedDate && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Current:{" "}
                        {format(new Date(blog.publishedDate), "PPP")}
                      </div>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Featured Image</Label>
                {blog?.image_url && !previewImage && (
                  <div className="text-sm text-muted-foreground mb-2">
                    Current image is set. Upload a new one to replace it.
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                  >
                    {previewImage || blog?.image_url
                      ? "Change Image"
                      : "Upload Image"}
                  </Button>
                  {(previewImage || blog?.image_url) && (
                    <div className="w-20 h-20 rounded-md overflow-hidden border">
                      <img
                        src={previewImage || blog?.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a featured image for your post
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting }>
                {isSubmitting ? "Updating..." : "Update Content"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
function refine(arg0: (data: { contentType: string; contents: string; }) => boolean, arg1: { message: string; path: string[]; }) {
  throw new Error("Function not implemented.");
}

