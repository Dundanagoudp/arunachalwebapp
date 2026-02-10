/**
 * XSS Protection Utility
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify for safe HTML rendering
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(
  dirty: string
): string {
  // Return empty string if input is falsy
  if (!dirty) return '';

  // Default configuration - strips dangerous elements and attributes
  const defaultConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'span', 'div',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  // Sanitize and return
  return DOMPurify.sanitize(dirty, defaultConfig as any) as unknown as string;
}

/**
 * Strip all HTML tags from content
 * Use this for plain text display where no HTML is needed
 * @param html - The HTML string to strip
 * @returns Plain text with all HTML removed
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  const config = {
    ALLOWED_TAGS: [] as string[],
    ALLOWED_ATTR: [] as string[],
    KEEP_CONTENT: true,
  };
  
  return DOMPurify.sanitize(html, config as any) as unknown as string;
}

/**
 * Sanitize for text content only (strips all HTML but keeps text)
 * Useful for descriptions and excerpts
 * @param content - The content to sanitize
 * @returns Text-only content
 */
export function sanitizeTextContent(content: string): string {
  if (!content) return '';
  
  // First strip HTML, then trim whitespace
  return stripHtml(content).trim();
}

/**
 * Validate and sanitize file upload
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSizeInMB - Maximum file size in megabytes
 * @returns Validation result with error message if invalid
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeInMB: number
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeInMB}MB limit`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const allowedExtensions = allowedTypes.map(type => {
    const parts = type.split('/');
    return parts[parts.length - 1];
  });

  const fileExtension = fileName.split('.').pop() || '';
  
  // For images, validate common extensions
  if (file.type.startsWith('image/')) {
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    if (!validImageExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: 'Invalid image file extension',
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param url - The URL to sanitize
 * @returns Safe URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmedUrl = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmedUrl.startsWith('javascript:') ||
    trimmedUrl.startsWith('data:') ||
    trimmedUrl.startsWith('vbscript:') ||
    trimmedUrl.startsWith('file:')
  ) {
    return '';
  }

  // Allow http, https, and relative URLs
  if (
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('/') ||
    trimmedUrl.startsWith('./') ||
    trimmedUrl.startsWith('../')
  ) {
    return url.trim();
  }

  // For other cases, assume it's a relative URL and prepend /
  return '/' + url.trim();
}
