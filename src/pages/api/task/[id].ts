import { z } from "zod";

import { githubApiHandler } from "@/utils/api-handler";
import type { GitHubApiHandler } from "@/utils/api-handler";
import { convertGithubIssueToTask, searchGithubIssues, updateGithubIssue } from "@/utils/github-api";

const getTaskQuerySchema = z.object({
    id: z.string().regex(/^[0-9]+$/),
});

const getTask: GitHubApiHandler = async ({ request, githubApiClient, response }) => {
    const author = request.session.username;

    if (typeof author === "undefined") {
        return response.status(401).send({
            message: "Unauthorized",
        });
    }

    const { id } = getTaskQuerySchema.parse(request.query);

    const queryString = `author:${author} is:open is:issue issue: ${id} repo:justYu2001/gim-issues`;

    const params = new URLSearchParams({
        q: queryString,
    });

    const { issues } = await searchGithubIssues(githubApiClient, params.toString());
    const issue = issues[0];

    if (!issue) {
        return response.status(404).send({
            message: "Task Not Found",
        });
    }

    const task = convertGithubIssueToTask(issue);

    response.status(200).send(task);
};

const deleteTaskQuerySchema = z.object({
    id: z.string().min(1).transform((value) => parseInt(value)),
});

const deleteTask: GitHubApiHandler = async ({ request, response }) => {
    const { id } = deleteTaskQuerySchema.parse(request.query);

    await updateGithubIssue(id, { state: "closed" });

    response.status(204).end();
};

export default githubApiHandler({
    GET: getTask,
    DELETE: deleteTask,
});
