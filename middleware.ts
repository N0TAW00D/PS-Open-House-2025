// import { type NextRequest } from "next/server";
// import { updateSession } from "@/utils/supabase/middleware";

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
//      * Feel free to modify this pattern to include more paths.
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Define protected routes and their requirements
const PROTECTED_ROUTES = {
  '/home': { requiresAuth: true, requiresForm: true },
  '/form': { requiresAuth: true, requiresForm: false },
  '/staff': { requiresAuth: true, requiresRole: 'staff' },
  '/dashboard': { requiresAuth: true, requiresRole: 'staff' }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware if route isn't protected
  if (!Object.keys(PROTECTED_ROUTES).includes(pathname)) {
    return NextResponse.next()
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Handle authentication errors
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Fetch user role data
    const { data: roleData, error: roleError } = await supabase
      .from('role')
      .select('form, role')
      .eq('email', user.email)
      .single()

    // Handle role fetch errors
    if (roleError) {
      console.error('Role fetch error:', roleError)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Handle missing role data
    if (!roleData) {
      console.error('No role data found for user:', user.email)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Staff-specific routing
    if (roleData.role === 'staff') {
      // If staff member is accessing a non-staff route, redirect to /staff
      if (!pathname.startsWith('/staff') && !pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/staff', request.url))
      }
      // Allow staff to access both /staff and /dashboard
      if (pathname === '/staff' || pathname === '/dashboard') {
        return NextResponse.next()
      }
    } else {
      // Non-staff users can't access staff routes
      if (pathname === '/staff' || pathname === '/dashboard') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Regular user routing based on form status
      if (!roleData.form && pathname !== '/form') {
        return NextResponse.redirect(new URL('/form', request.url))
      }

      if (roleData.form && pathname !== '/home') {
        return NextResponse.redirect(new URL('/home', request.url))
      }
    }

    // Allow the request to proceed
    return NextResponse.next()

  } catch (error) {
    console.error('Unexpected middleware error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Define which routes this middleware should run on
export const config = {
  matcher: ['/home', '/form', '/staff', '/dashboard']
}