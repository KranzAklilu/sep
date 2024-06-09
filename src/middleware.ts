import { Session } from "next-auth";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });

    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");

    console.log(token, "heres");

    // if user is not authenticated
    if (!isAuth) {
      if (!isAuthPage) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return null;
    }

    // if user is authenticated but tries to go to authpages
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const tokenWithUser = token as Session["user"];

    console.log({ token });

    if (!tokenWithUser.finishedRegistration) {
      return NextResponse.redirect(new URL("/finish-registration", req.url));
    }
    if (
      tokenWithUser.finishedRegistration &&
      req.nextUrl.pathname.startsWith("/finish-registration")
    ) {
      return NextResponse.redirect(new URL("/dashboard/inquires", req.url));
    }
  },

  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
