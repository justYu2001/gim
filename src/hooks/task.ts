import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import type { AxiosResponse } from "axios";

import type { AddTaskApiBody, TaskSearchApiSuccessResponse } from "@/pages/api/task";
import type { Task } from "@/utils/task";

interface TaskFilter {
    author?: string;
}

export const useTasks = (filter: TaskFilter) => {
    return useInfiniteQuery({
        queryKey: taskQueryKeys.list(filter),
        queryFn: fetchTasks,
        enabled: Boolean(filter.author),
    });
};

type TaskListQueryKeys = QueryFunctionContext<ReturnType<(typeof taskQueryKeys)["list"]>, number>;

const fetchTasks = async ({ queryKey: [{ author }] }: TaskListQueryKeys) => {
    if (typeof author === "undefined") {
        throw new Error("author is required");
    }

    const params = new URLSearchParams({ author });

    const { data } = await axios.get<TaskSearchApiSuccessResponse>(`/api/task?${params.toString()}`);

    return data;
};

export const useAddTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: taskQueryKeys.lists(),
            });
        },
    });
};

const addTask = async ({ title, body }: AddTaskApiBody) => {
    const { data } = await axios.post<
        Task,
        AxiosResponse<Task>,
        AddTaskApiBody
    >("/api/task", { title, body });

    return data;
};

const taskQueryKeys = {
    all: () => [{ scope: "tasks" }] as const,
    lists: () => [{ ...taskQueryKeys.all()[0], entity: "list" }] as const,
    list: (filter: TaskFilter) => [{ ...taskQueryKeys.lists()[0], ...filter }] as const,
};
