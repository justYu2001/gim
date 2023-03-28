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

export const TaskStatuses = ["Open", "In Progress", "Done"] as const;
export type TaskStatus = typeof TaskStatuses[number];
