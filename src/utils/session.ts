import type { NextApiHandler } from "next";

import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";

import { env } from "@/env.mjs";

const sessionOptions: IronSessionOptions = {
    password: env.SECRET_COOKIE_PASSWORD,
    cookieName: "gim-session",
    cookieOptions: {
        secure: env.NODE_ENV === "production",
    },
};

export const withSessionRoute = (handler: NextApiHandler) => {
    return withIronSessionApiRoute(handler, sessionOptions);
}
