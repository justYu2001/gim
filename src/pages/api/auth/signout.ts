import type { NextApiHandler } from "next";

import * as Sentry from "@sentry/nextjs";

import { withSessionRoute } from "@/utils/session";

const signOutApiHandler: NextApiHandler = (request, response) => {
    if (request.method !== "POST") {
        return response.status(405).send({ message: "Method Not Allowed" });
    }

    try {
        request.session.destroy();
        return response.redirect(302, "/");
    } catch (error) {
        Sentry.captureException(error);
        return response.redirect(302, "/error");
    }
};

export default withSessionRoute(signOutApiHandler);
