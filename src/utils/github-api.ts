import axios from "axios";
import type { AxiosResponse } from "axios";

import { env } from "@/env.mjs";
import type { Task } from "@/utils/task";

export const createGithubApiClient = (accessToken = env.ADMIN_ACCESS_TOKEN) => {
    return axios.create({
        baseURL: "https://api.github.com",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
}

const GithubIssueStates = ["open", "closed"] as const;
export type GithubIssueState = typeof GithubIssueStates[number];

interface GithubIssueLabel {
    name: string;
    color: string;
}

export interface GithubIssue {
    number: number;
    title: string;
    body: string;
    state: GithubIssueState;
    labels: [GithubIssueLabel];
}

interface GithubUpdateIssueApiBody {
    title?: string;
    body?: string;
    state: GithubIssueState;
    labels?: string[];
}

export const updateGithubIssue = async (id: number, payload: GithubUpdateIssueApiBody) => {
    const githubApiClient = createGithubApiClient();

    const { data } = await githubApiClient.patch<
        GithubIssue,
        AxiosResponse<GithubIssue>,
        GithubUpdateIssueApiBody
    >(`/repos/justYu2001/gim-issues/issues/${id}`, payload);

    return convertGithubIssueToTask(data);
};

const convertGithubIssueToTask = (issue: GithubIssue): Task => {
    return {
        id: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        status: issue.labels[0],
    };
};