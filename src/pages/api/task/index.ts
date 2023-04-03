import type { AxiosResponse } from "axios";
import { z } from "zod";

import { githubApiHandler } from "@/utils/api-handler";
import type { GitHubApiHandler, GithubApiHandlerErrorMessage } from "@/utils/api-handler";
import { convertGithubIssueToTask, searchGithubIssues, updateGithubIssue } from "@/utils/github-api";
import type { GithubIssue } from "@/utils/github-api";
import { TaskOrders, TaskStatuses } from "@/utils/task";
import type { Task } from "@/utils/task";

export interface TaskSearchApiSuccessResponse {
    totalCount: number;
    tasks: Task[];
}

type TaskSearchApiResponse = TaskSearchApiSuccessResponse | GithubApiHandlerErrorMessage;

const searchTaskQueryParamsSchema = z.object({
    keyword: z.string().optional(),
    status: z.string().min(1),
    order: z.enum(TaskOrders),
    page: z.string().min(1),
});

type SearchTaskQueryParams = z.infer<typeof searchTaskQueryParamsSchema>;

const searchTasks: GitHubApiHandler<TaskSearchApiResponse> = async ({
    request,
    response,
    githubApiClient,
}) => {
    const { username } = request.session;

    if (typeof username === "undefined") {
        return response.status(401).send({
            message: "Unauthorized",
        });
    }

    const parsedQueryParams = searchTaskQueryParamsSchema.parse(request.query);

    const params = new URLSearchParams({
        q: getQueryString(username, parsedQueryParams),
        sort: "created",
        order: parsedQueryParams.order,
        per_page: "10",
        page: parsedQueryParams.page,
    });

    const { totalCount, issues } = await searchGithubIssues(githubApiClient, params.toString());

    const tasks = issues.map<Task>((issue) => convertGithubIssueToTask(issue));

    response.status(200).send({
        totalCount,
        tasks,
    });
};

const getQueryString = (author: string, { keyword, status }: SearchTaskQueryParams) => {
    let queryString = `author:${author} is:open is:issue repo:justYu2001/gim-issues`;

    if (hasParam(keyword) && keyword !== "") {
        queryString += ` ${keyword} in:title,body`;
    }

    if (hasParam(status) && status.toLowerCase() !== "all") {
        queryString += ` label:"${status}"`;
    }

    return queryString;
};

const hasParam = (param: string | undefined): param is string => {
    return typeof param === "string";
};

const addTaskApiBodySchema = z.object({
    title: z.string().trim().min(1),
    body: z.string().trim().min(30),
});

export type AddTaskApiBody = z.infer<typeof addTaskApiBodySchema>;

interface GitHubCreateIssueApiBody {
    title: string;
    body: string;
}

const addTask: GitHubApiHandler<Task> = async ({ request, response, githubApiClient }) => {
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

const updateTaskApiBodySchema = z.object({
    id: z.number(),
    title: z.string().trim().min(1),
    body: z.string().trim().min(30),
    status: z.enum(TaskStatuses),
});

export type UpdateTaskApiBody = z.infer<typeof updateTaskApiBodySchema>;

const updateTask: GitHubApiHandler<Task> = async ({ request,response }) => {
    const { id, title, body, status } = updateTaskApiBodySchema.parse(request.body);

    const updatedTask = await updateGithubIssue(id, {
        title,
        body,
        state: "open",
        labels: [status],
    });

    response.status(200).send(updatedTask);
};

export default githubApiHandler({
    GET: searchTasks,
    POST: addTask,
    PATCH: updateTask,
});
