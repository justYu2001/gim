import type { NextApiRequest, NextApiResponse } from "next";

import { AxiosError } from "axios";
import type { AxiosInstance, Method } from "axios";
import { ZodError } from "zod";

import { createGithubApiClient } from "@/utils/github-api";
import { withSessionRoute } from "@/utils/session";
import { formatZodErrors } from "@/utils/zod";

export interface GitHubApiHandler<T = unknown> {
    (context: {
        request: NextApiRequest;
        response: NextApiResponse<T>;
        githubApiClient: AxiosInstance,
    }): Promise<void>;
}

type HTTPMethod = Uppercase<Method>;

type GithubApiMethodHandler = {
    [key in HTTPMethod]?: GitHubApiHandler;
};

export const githubApiHandler = (handlers: GithubApiMethodHandler) => {
    const apiHandler = async (request: NextApiRequest, response: NextApiResponse) => {
        const method = request.method?.toUpperCase() as HTTPMethod;
        const handler = handlers[method];

        if (!method || !handler) {
            return response.status(405).send({ message: "Method Not Allowed" });
        }

        const { accessToken } = request.session;

        if (!accessToken) {
            return response.status(401).send({ message: "Unauthorized" });
        }

        const githubApiClient = createGithubApiClient(accessToken);

        try {
            await handler({ request, response, githubApiClient });
        } catch (error) {
            const { statusCode, message } = handleGithubApiHandlerError(error);
            console.error(message);
            response.status(statusCode).send({ message });
        }
    };

    return withSessionRoute(apiHandler);
};

interface GithubApiHandlerErrorMessage {
    message: string;
    documentation_url?: string;
}

const handleGithubApiHandlerError = (error: unknown) => {
    let statusCode = 500;
    let message: GithubApiHandlerErrorMessage = {
        message: "Unexpected Error",
    };

    if (error instanceof AxiosError && error.response) {
        statusCode = error.response.status;
        message = error.response.data as GithubApiHandlerErrorMessage;
    } else if (error instanceof ZodError) {
        statusCode = 422;
        const formattedZodErrors = formatZodErrors(error);
        message.message = `Invalid Parameters Format:\n${formattedZodErrors.join("")}`;
    } else if (error instanceof Error) {
        message.message = error.message;
    }

    return { statusCode, message };
};