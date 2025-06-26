import { NextResponse } from "next/server";
import { authenticated } from "@/controllers/auth.js";

const appRoutes = ["/home", "/tournaments"];
const siteRoutes = ["/login", "/signup", "/", "/admin"];
const adminRoutes = ["/adminpanel"];

export async function middleware(req) {
  if (
    !appRoutes.some((route) =>
      route === "/"
        ? req.nextUrl.pathname === "/"
        : req.nextUrl.pathname.startsWith(route)
    ) &&
    !siteRoutes.some((route) =>
      route === "/"
        ? req.nextUrl.pathname === "/"
        : req.nextUrl.pathname.startsWith(route)
    ) &&
    !adminRoutes.some((route) =>
      route === "/"
        ? req.nextUrl.pathname === "/"
        : req.nextUrl.pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  const isAuth = await authenticated(req);

  if (isAuth.admin) {
    if (
      adminRoutes.some((route) =>
        route === "/"
          ? req.nextUrl.pathname === "/"
          : req.nextUrl.pathname.startsWith(route)
      )
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/adminpanel", req.url));
  }

  if (
    ((!isAuth &&
      siteRoutes.some((route) =>
        route === "/"
          ? req.nextUrl.pathname === "/"
          : req.nextUrl.pathname.startsWith(route)
      )) ||
      (isAuth &&
        !siteRoutes.some((route) =>
          route === "/"
            ? req.nextUrl.pathname === "/"
            : req.nextUrl.pathname.startsWith(route)
        ))) &&
    !adminRoutes.some((route) =>
      route === "/"
        ? req.nextUrl.pathname === "/"
        : req.nextUrl.pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}
