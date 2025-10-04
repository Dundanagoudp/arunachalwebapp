export interface Blog {
  _id: string;
  title: string;
  contentType: 'blog' | 'link';
  contents?: string;
  link?: string;
  image_url?: string;
  publishedDate?: Date;
  category_ref: string;
  author?: string;
}


export interface Category {
  name: string;
  _id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
