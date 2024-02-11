import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getIronSession } from "iron-session/edge";
import type { IronSessionOptions } from "iron-session/edge";

import { env } from "@/env.mjs";

/**
 * We cannot import iron-session's non-edge version into the middleware file,
 * even transitively, so we must place a copy of iron-session's options here.
 * See https://github.com/vvo/iron-session/issues/543#issuecomment-1248886435
 */
const sessionOptions: IronSessionOptions = {
    password: env.SECRET_COOKIE_PASSWORD,
    cookieName: "gim-session",
    cookieOptions: {
        secure: env.NODE_ENV === "production",
    },
};

export const middleware = async (request: NextRequest) => {
    const response = NextResponse.next();

    const { accessToken } = await getIronSession(request, response, sessionOptions);

    if (request.nextUrl.pathname === "/error") {
        return response;
    }

    const isIndexPage = request.nextUrl.pathname === "/";

    if (accessToken && isIndexPage) {
        return NextResponse.redirect(new URL("/task", request.url));
    }

    if (!accessToken && !isIndexPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
}

export const config = {
    matcher: ["/task/:path*", "/", "/error"],
};