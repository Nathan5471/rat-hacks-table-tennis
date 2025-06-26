import { NextResponse } from "next/server";
import { authenticated } from "@/controllers/auth.js";

const appRoutes = ["/home"];
const siteRoutes = ["/login", "/signup", "/", "/admin"];
const adminRoutes = ["/adminpanel", "/adminpanel/create"];

export async function middleware(req) {
  if (
    !appRoutes.includes(req.nextUrl.pathname) &&
    !siteRoutes.includes(req.nextUrl.pathname) &&
    !adminRoutes.includes(req.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  const isAuth = await authenticated(req);

  if (isAuth.admin) {
    if (adminRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/adminpanel", req.url));
  }

  if (
    ((!isAuth && siteRoutes.includes(req.nextUrl.pathname)) ||
      (isAuth && !siteRoutes.includes(req.nextUrl.pathname))) &&
    !adminRoutes.includes(req.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}
