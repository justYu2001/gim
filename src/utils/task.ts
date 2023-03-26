import type { GithubIssueState } from "@/utils/github-api";

interface Status {
    name: string;
    color: string;
}

export interface Task {
    id: number;
    state: GithubIssueState;
    title: string;
    body: string;
    status: Status;
}