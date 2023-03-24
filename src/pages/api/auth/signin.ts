import type { NextApiHandler } from "next";

import { ZodError, z } from "zod";

import { env } from "@/env.mjs";
import { formatZodErrors } from "@/utils/zod";

/**
 * An API to request a user's GitHub identity.
 * GitHub Docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
 */
const signInApiBodySchema = z.object({
    callbackUrl: z.string().url(),
});

const signInApiHandler: NextApiHandler = (request, response) => {
    if (request.method !== "POST") {
        return response.status(405).send({
            message: "Method Not Allowed",
        });
    }

    try {
        const { callbackUrl } = signInApiBodySchema.parse(request.body);

        const searchParameters = new URLSearchParams({
            client_id: env.CLIENT_ID,
            redirect_uri: callbackUrl,
            scope: "read:user public_repo",
        });

        const authorizationUrl = `https://github.com/login/oauth/authorize?${searchParameters.toString()}`;

        return response.redirect(302, authorizationUrl);
    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).send({
                message: formatZodErrors(error).join("\n"),
            });
        }

        return response.redirect("/error");
    }
};

export default signInApiHandler;
