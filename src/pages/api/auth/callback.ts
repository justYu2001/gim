import type { NextApiHandler, NextApiRequest } from "next";

import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { z } from "zod";

import { env } from "@/env.mjs";
import { withSessionRoute } from "@/utils/session";
import { formatZodErrors } from "@/utils/zod";

/**
 * An API to handle GitHub OAuth redirecting requests.
 * GitHub Docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
 */
const callbackApiHandler: NextApiHandler = async (request, response) => {
    if (request.method !== "GET") {
        return response.status(405).send({
            message: "Method Not Allowed",
        });
    }

    try {
        const authCode = getAuthCode(request.query);
        const accessToken = await getAccessToken(authCode);
        request.session.accessToken = accessToken;
        await request.session.save();
        return response.redirect("/task");
    } catch (error) {
        if (error instanceof GitHubAuthError) {
            console.error(error);
        } else if (error instanceof Error) {
            console.error(error);
        }

        return response.redirect("/error");
    }
};

export default withSessionRoute(callbackApiHandler);

const successfulAuthQueryParamsSchema = z.object({
    code: z.string().min(1),
});

export const getAuthCode = (searchParams: NextApiRequest["query"]) => {
    const parsedSearchParams = successfulAuthQueryParamsSchema.safeParse(searchParams);

    if (parsedSearchParams.success) {
        return parsedSearchParams.data.code;
    }

    throw new GitHubAuthError(searchParams);
};

const accessTokenAPISuccessResponseSchema = z.object({
    access_token: z.string().min(1),
    scope: z.string().min(1),
    token_type: z.string().min(1),
});

type AccessTokenAPISuccessResponse = z.infer<typeof accessTokenAPISuccessResponseSchema>;
type AccessTokenAPIResponseData = AccessTokenAPISuccessResponse | AuthErrorMessage;

export const getAccessToken = async (authorizationCode: string) => {
    const searchParameters = new URLSearchParams({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        code: authorizationCode,
    });

    const accessTokenAPiURL = `https://github.com/login/oauth/access_token?${searchParameters.toString()}`;

    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
        },
    };

    const { data } = await axios.post<AccessTokenAPIResponseData>(accessTokenAPiURL, {}, requestConfig);

    const parsedData = accessTokenAPISuccessResponseSchema.safeParse(data);

    if (parsedData.success) {
        return parsedData.data.access_token;
    }

    throw new GitHubAuthError(data);
};

const AuthErrorCodes = [
    "application_suspended",
    "redirect_uri_mismatch",
    "access_denied",
    "incorrect_client_credentials",
    "redirect_uri_mismatch",
    "bad_verification_code",
    "invalid_error_message_format",
] as const;

type AuthErrorCode = (typeof AuthErrorCodes)[number];

const authErrorMessageSchema = z.object({
    error: z.custom<AuthErrorCode>(),
    error_description: z.string().min(1),
    error_uri: z.string().min(1),
});

export type AuthErrorMessage = z.infer<typeof authErrorMessageSchema>;

/**
 * A class for handling GitHub OAuth Error Messages.
 * 
 * GitHub Docs:
 *     - Authorization request errors: https://docs.github.com/en/apps/oauth-apps/maintaining-oauth-apps/troubleshooting-authorization-request-errors
 *     - Access token request errors: https://docs.github.com/en/apps/oauth-apps/maintaining-oauth-apps/troubleshooting-oauth-app-access-token-request-errors
 */
class GitHubAuthError extends Error {
    public code: AuthErrorCode;
    public description: string;
    public documentationUrl: string | undefined;

    constructor(errorMessage: NextApiRequest["query"] | AuthErrorMessage) {
        super("");
        this.name = "GitHubAuthError";

        const parsedAuthErrorMessage =
            authErrorMessageSchema.safeParse(errorMessage);

        if (parsedAuthErrorMessage.success) {
            this.message = GitHubAuthError.getErrorLogMessage(parsedAuthErrorMessage.data);

            const {
                error: errorCode,
                error_description: errorDescription,
                error_uri: errorUri,
            } = parsedAuthErrorMessage.data;

            this.code = errorCode;
            this.description = GitHubAuthError.formatErrorDescription(errorDescription);
            this.documentationUrl = errorUri;
        } else {
            const formattedErrorMessage = formatZodErrors(parsedAuthErrorMessage.error).join("");
            this.message = `Invalid Error Message Format:\n${formattedErrorMessage})}`;
            this.code = "invalid_error_message_format";
            this.description = "Invalid error message format.";
        }
    }

    private static getErrorLogMessage = (error: AuthErrorMessage) => {
        const {
            error: errorCode,
            error_description: errorDescription,
            error_uri: errorUri,
        } = error;

        let errorMessage = `${this.formatErrorDescription(errorDescription)}\n`;
        errorMessage += `Error Code: ${errorCode}\n`;
        errorMessage += `More Information: ${errorUri}\n`;

        return errorMessage;
    };

    private static formatErrorDescription = (description: string) => {
        return description.split("+").join(" ");
    };
}
