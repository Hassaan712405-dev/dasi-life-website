import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ Sirf protected routes par Supabase call karein
  const needsAuth =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/wishlist') ||
    pathname.startsWith('/checkout');

  if (!needsAuth) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ============================================
  // ✅ ADMIN ROUTES PROTECTION
  // ============================================
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin-login')
  ) {
    // Not logged in → admin-login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin-login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Logged in but NOT admin → homepage
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!adminData) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // ============================================
  // ✅ ACCOUNT / WISHLIST / CHECKOUT PROTECTION
  // ============================================
  if (
    (pathname.startsWith('/account') ||
      pathname.startsWith('/wishlist') ||
      pathname.startsWith('/checkout')) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};