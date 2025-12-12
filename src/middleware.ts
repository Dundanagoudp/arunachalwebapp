import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the protected paths
const protectedPaths = [
  '/admin/dashboard',
];

// CVE-2025-55182 Protection: Dangerous patterns that could indicate RCE attempts
const DANGEROUS_PATTERNS = [
  '__proto__',
  'constructor',
  '_response',
  '_prefix',
  'process.mainModule.require',
  'child_process.execSync',
  'process.binding',
  'require(',
  'eval(',
];

// CVE-2025-55182 Protection: Check if request contains dangerous RSC payload indicators
function isRSCPayloadRequest(request: NextRequest): boolean {
  const headers = request.headers;
  
  // Block React Server Component action requests
  if (headers.get('accept')?.includes('text/x-component')) {
    return true;
  }
  
  // Block Next.js action requests
  if (headers.get('next-action')) {
    return true;
  }
  
  // Block suspicious multipart/form-data that may contain RSC payloads
  const contentType = headers.get('content-type');
  if (contentType?.includes('multipart/form-data') && 
      (contentType.includes('text/x-component') || contentType.includes('boundary=----'))) {
    return true;
  }
  
  return false;
}

// CVE-2025-55182 Protection: Check URL and query parameters for dangerous patterns
function hasDangerousPattern(request: NextRequest): boolean {
  const url = request.nextUrl.toString();
  const searchParams = request.nextUrl.searchParams.toString();
  
  // Check URL and all query parameters
  const combinedString = url + searchParams;
  
  return DANGEROUS_PATTERNS.some(pattern => 
    combinedString.toLowerCase().includes(pattern.toLowerCase())
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ========================================
  // CVE-2025-55182 SECURITY CHECKS (Applied to ALL requests)
  // ========================================
  
  // Block requests with RSC payload indicators
  if (isRSCPayloadRequest(request)) {
    console.warn('[Security] Blocked RSC payload request:', {
      path: pathname,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });
    return new NextResponse(
      JSON.stringify({ 
        error: 'Forbidden', 
        message: 'Request blocked for security reasons' 
      }), 
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Block requests with dangerous patterns in URL/query
  if (hasDangerousPattern(request)) {
    console.warn('[Security] Blocked request with dangerous pattern:', {
      path: pathname,
      method: request.method,
    });
    return new NextResponse(
      JSON.stringify({ 
        error: 'Forbidden', 
        message: 'Request contains forbidden patterns' 
      }), 
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ========================================
  // EXISTING AUTH PROTECTION
  // ========================================
  
  // Check if the path is protected
  const isProtected = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Example: Check for a session cookie (customize as per your auth logic)
  const token = request.cookies.get('token')?.value;
  if (!token) {
    // Not logged in, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in, allow access (role-based content handled in page)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 