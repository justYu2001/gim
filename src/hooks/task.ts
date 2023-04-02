import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetNextPageParamFunction, QueryFunctionContext } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

import type { AddTaskApiBody, TaskSearchApiSuccessResponse, UpdateTaskApiBody } from "@/pages/api/task";
import type { Task, TaskOrder } from "@/utils/task";

export const useTask = (id: number | string | undefined) => {
    let taskId: number | undefined = undefined;

    if (typeof id === "string") {
        taskId = parseInt(id);
    }

    return useQuery({
        queryKey: taskQueryKeys.detail(taskId),
        queryFn: fetchTask,
        enabled: typeof taskId === "number",
        retry: (failureCount, error) => {
            if (error instanceof AxiosError && error.response?.status === 404) {
                return false;
            }

            if (taskId) {
                return !isNaN(taskId);
            }

            return false;
        },
    });
};

type TaskDetailQueryKey = QueryFunctionContext<ReturnType<(typeof taskQueryKeys)["detail"]>>;

const fetchTask = async ({ queryKey: [{ id }] }: TaskDetailQueryKey): Promise<Task> => {
    if (typeof id === "undefined") {
        throw new Error("id is required");
    }

    const { data } = await axios.get<Task>(`/api/task/${id}`);

    return data;
};

interface TaskFilter {
    keyword: string;
    status: string;
    order: TaskOrder;
}

export const useTasks = (filter: TaskFilter) => {
    return useInfiniteQuery({
        queryKey: taskQueryKeys.list(filter),
        queryFn: fetchTasks,
        getNextPageParam,
    });
};

type TaskListQueryKeys = QueryFunctionContext<ReturnType<(typeof taskQueryKeys)["list"]>, number>;

const fetchTasks = async ({
    queryKey: [{ keyword, status, order }],
    pageParam = 1 
}: TaskListQueryKeys) => {
    const params = new URLSearchParams({
        keyword,
        status,
        order,
        page: pageParam.toString(),
    });

    const { data } = await axios.get<TaskSearchApiSuccessResponse>(`/api/task?${params.toString()}`);

    return data;
};

const getNextPageParam: GetNextPageParamFunction<TaskSearchApiSuccessResponse> = (lastPages, allPages) => {
    if (lastPages.totalCount - allPages.length * 10 > 0) {
        return allPages.length + 1;
    }

    return undefined;
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

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTask,
        onSuccess: (data) => {
            queryClient.setQueryData(taskQueryKeys.detail(data.id), data);

            void queryClient.invalidateQueries({
                queryKey: taskQueryKeys.detail(data.id),
            });

            void queryClient.invalidateQueries({
                queryKey: taskQueryKeys.lists(),
            });
        },
    });
};

const updateTask = async (payload: UpdateTaskApiBody) => {
    const { data } = await axios.patch<
        Task,
        AxiosResponse<Task>,
        UpdateTaskApiBody
    >("/api/task", payload);

    return data;
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: taskQueryKeys.lists(),
            });
        },
    });
};

const deleteTask = async (id: number) => axios.delete(`/api/task/${id}`);

const taskQueryKeys = {
    all: () => [{ scope: "tasks" }] as const,
    lists: () => [{ ...taskQueryKeys.all()[0], entity: "list" }] as const,
    list: (filter: TaskFilter) => [{ ...taskQueryKeys.lists()[0], ...filter }] as const,
    details: () => [{ ...taskQueryKeys.all()[0], entity: "detail" }] as const,
    detail: (id: number | undefined) => [{ ...taskQueryKeys.details()[0], id }] as const,
};
