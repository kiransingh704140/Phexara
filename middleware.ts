// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

// helper to build 401 response which triggers browser login prompt
function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="PromptGallery Admin"',
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only protect /admin and its subpaths
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // allow static files (css, js, images) to pass through
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // read env vars on the server
  const adminUser = process.env.ADMIN_USER || '';
  const adminPass = process.env.ADMIN_PASS || '';

  // If no creds set, deny access (safe default)
  if (!adminUser || !adminPass) return unauthorized();

  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) {
    return unauthorized();
  }

  // decode Basic auth
  const base64 = auth.replace('Basic ', '');
  let decoded = '';
  try {
    decoded = Buffer.from(base64, 'base64').toString('utf8'); // user:pass
  } catch (e) {
    return unauthorized();
  }

  const [user, pass] = decoded.split(':');
  if (user === adminUser && pass === adminPass) {
    return NextResponse.next();
  }

  return unauthorized();
}

// Apply middleware to /admin paths
export const config = {
  matcher: ['/admin/:path*'],
};
