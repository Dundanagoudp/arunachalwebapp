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
import { addBlog, getCategory } from "@/service/newsAndBlogs";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { formSchema } from "./formSchema";

type FormValues = z.infer<typeof formSchema>;

interface Category {
  _id: string;
  name: string;
}
export default function NewsBlogForm() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await getCategory();
        const category = response.data;
        if (category && Array.isArray(category)) {
          setOptions(category);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log('Form submission triggered with values:', values);
    try {
      const formData = new FormData();
      formData.append("category_ref", values.category_ref);
      formData.append("title", values.title);
      formData.append("contentType", values.contentType);
      formData.append("publishedDate", values.publishedDate.toISOString());

      // Always send both fields, empty if not used
      formData.append("contents", values.contents || "");
      formData.append("link", values.link || "");

      if (values.image) {
        formData.append("image_url", values.image);
      }

      const response = await addBlog(formData);

      if (!response.success) {
        toast({
          title: "Failed to add blog",
          description: response.message || "Something went wrong."
        });
        throw new Error("Failed to add blog: " + response.message);
      }

      toast({
        title: "Blog created successfully!",
        description: "Your blog post has been added."
      });
      router.push("/admin/dashboard/content/blogs");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Something went wrong."
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">
            Create New Content
          </CardTitle>
          <CardDescription>
            Add new blog posts, news articles, or external links..
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
                        <RadioGroup
                          className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-2 rounded-lg w-full sm:w-fit shadow-sm bg-muted"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <RadioGroupItem
                            value="blog"
                            id="content-type-blog"
                            className="peer sr-only"
                          />
                          <label
                            htmlFor="content-type-blog"
                            className={`w-full sm:w-auto flex-1 sm:flex-none px-4 py-3 text-base sm:text-sm font-medium flex items-center gap-2 rounded-lg min-w-[120px] border-2 cursor-pointer transition-all
                              ${field.value === "blog" ? "bg-blue-100 border-blue-500 text-blue-900 shadow-md scale-105" : "bg-white border-gray-300 text-gray-700 hover:scale-[1.02]"}`}
                          >
                            <span className="mr-2">📝</span> Blog Post
                            {field.value === "blog" && (
                              <span className="ml-2 text-blue-600">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                              </span>
                            )}
                          </label>
                          <RadioGroupItem
                            value="link"
                            id="content-type-link"
                            className="peer sr-only"
                          />
                          <label
                            htmlFor="content-type-link"
                            className={`w-full sm:w-auto flex-1 sm:flex-none px-4 py-3 text-base sm:text-sm font-medium flex items-center gap-2 rounded-lg min-w-[120px] border-2 cursor-pointer transition-all
                              ${field.value === "link" ? "bg-blue-100 border-blue-500 text-blue-900 shadow-md scale-105" : "bg-white border-gray-300 text-gray-700 hover:scale-[1.02]"}`}
                          >
                            <span className="mr-2">🔗</span> External Link
                            {field.value === "link" && (
                              <span className="ml-2 text-blue-600">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                              </span>
                            )}
                          </label>
                        </RadioGroup>
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
                      <Input placeholder="Enter title" {...field} />
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
                          placeholder="Write your blog content here..."
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
                          placeholder="https://example.com"
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
                    Upload Image
                  </Button>
                  {previewImage && (
                    <div className="w-20 h-20 rounded-md overflow-hidden border">
                      <img
                        src={previewImage}
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

              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto text-base sm:text-sm py-3 sm:py-2 mt-4">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
