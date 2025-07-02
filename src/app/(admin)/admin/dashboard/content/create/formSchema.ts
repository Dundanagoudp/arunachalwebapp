import * as z from "zod";

export const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    contentType: z.enum(["blog", "link"]),
    publishedDate: z.date(),
    contents: z.string().optional(),
    link: z.string().optional(),
    image: z.instanceof(File).optional(),
    category_ref: z.string().min(1, "Category is required"),
  })
  .refine((data) => {
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