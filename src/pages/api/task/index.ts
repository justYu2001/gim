import type { AxiosResponse } from "axios";
import { z } from "zod";

import { githubApiHandler } from "@/utils/api-handler";
import type { GitHubApiHandler } from "@/utils/api-handler";
import { updateGithubIssue } from "@/utils/github-api";
import type { GithubIssue } from "@/utils/github-api";
import type { Task } from "@/utils/task";

const addTaskApiBodySchema = z.object({
    title: z.string().min(1),
    body: z.string().min(30),
});

export type AddTaskApiBody = z.infer<typeof addTaskApiBodySchema>;

interface GitHubCreateIssueApiBody {
    title: string;
    body: string;
}

const addTask: GitHubApiHandler<Task> = async ({request, response, githubApiClient }) => {
    const parsedBody = addTaskApiBodySchema.parse(request.body);

    const { data } = await githubApiClient.post<
        GithubIssue,
        AxiosResponse<GithubIssue>,
        GitHubCreateIssueApiBody
    >("/repos/justYu2001/gim-issues/issues", parsedBody);

    const newTask = await updateGithubIssue(data.number, {
        state: data.state,
        labels: ["Open"],
    });

    response.status(201).send(newTask);
};

export default githubApiHandler({
    POST: addTask,
});
