import type { AxiosResponse } from "axios";
import { z } from "zod";

import { githubApiHandler } from "@/utils/api-handler";
import type { GitHubApiHandler, GithubApiHandlerErrorMessage } from "@/utils/api-handler";
import { convertGithubIssueToTask, updateGithubIssue } from "@/utils/github-api";
import type { GithubIssue } from "@/utils/github-api";
import { TaskStatuses } from "@/utils/task";
import type { Task } from "@/utils/task";

export interface TaskSearchApiSuccessResponse {
    totalCount: number;
    tasks: Task[];
}

type TaskSearchApiResponse = TaskSearchApiSuccessResponse | GithubApiHandlerErrorMessage;

const searchTaskQueryParamsSchema = z.object({
    author: z.string().min(1).optional(),
    id: z.string().regex(/^[0-9]+$/).optional(),
});

type SearchTaskQueryParams = z.infer<typeof searchTaskQueryParamsSchema>;

interface GithubSearchIssueApiResponse {
    total_count: number;
    items: GithubIssue[];
}

const searchTasks: GitHubApiHandler<TaskSearchApiResponse> = async ({
    request,
    response,
    githubApiClient,
}) => {
    const parsedQueryParams = searchTaskQueryParamsSchema.parse(request.query);

    const parameters = new URLSearchParams({
        q: getQueryString(parsedQueryParams),
        sort: "created",
        order: "desc",
        per_page: "10",
    });

    const { data } = await githubApiClient.get<GithubSearchIssueApiResponse>(
        `/search/issues?${parameters.toString()}`
    );

    const tasks = data.items.map<Task>((issue) => convertGithubIssueToTask(issue));

    response.status(200).send({
        totalCount: data.total_count,
        tasks,
    });
};

const getQueryString = ({ author, id }: SearchTaskQueryParams) => {
    let queryString = `is:issue repo:justYu2001/gim-issues`;

    if (hasParam(author)) {
        queryString += ` author:${author} is:open`;
    }

    if (hasParam(id)) {
        queryString += ` issue: ${id}`;
    }

    return queryString;
};

const hasParam = (param: string | undefined): param is string => {
    return typeof param === "string";
};

const addTaskApiBodySchema = z.object({
    title: z.string().min(1),
    body: z.string().min(30),
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
    title: z.string().min(1),
    body: z.string().min(30),
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
