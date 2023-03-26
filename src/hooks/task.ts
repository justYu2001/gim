import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { AxiosResponse } from "axios";

import type { AddTaskApiBody } from "@/pages/api/task";
import type { Task } from "@/utils/task";

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
};
