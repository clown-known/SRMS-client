// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { store } from '@/store/store';
// import { fetchUserPermissions } from '@/store/userSlice';

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   console.log('Middleware executed for path:', request.nextUrl.pathname);
//   if (path.startsWith('/roles')) {
//     const path = request.nextUrl.pathname;

//   if (path.startsWith('/roles')) {
//     // Dispatch the fetchUserPermissions thunk
//     await store.dispatch(fetchUserPermissions());

//     // Get the updated state
//     const state = store.getState();
//     const { isLoggedIn, permissions } = state.user;

//     if (!isLoggedIn) {
//       // User is not authenticated, redirect to login page
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // Check for 'role:read' permission
//     if (!permissions.includes('role:read')) {
//       // User doesn't have the required permission, redirect to unauthorized page
//       return NextResponse.redirect(new URL('/unauthorized', request.url));
//     }
//   }

//   return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher:  ['/roles/:path*'],
// };