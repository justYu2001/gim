import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import Form from "@/components/common/Form";
import type { FormSubmitHandler } from "@/components/common/Form";
import Modal from "@/components/common/Modal";
import TaskFormDropdown from "@/components/task/TaskFormDropdown";
import TaskFormInput from "@/components/task/TaskFormInput";
import TaskFormTextArea from "@/components/task//TaskFormTextArea";
import { useUpdateTask } from "@/hooks/task";
import { TaskStatuses } from "@/utils/task";
import type { Task, TaskStatus } from "@/utils/task";

const updatedTaskSchema = z.object({
    id: z.number(),
    title: z.string().trim().min(1),
    body: z.string().trim().min(30),
    status: z.enum(TaskStatuses),
});

export type UpdatedTask = z.infer<typeof updatedTaskSchema>;

interface EditTaskModalProps {
    isOpen: boolean;
    task: Task;
    onClose: () => void;
}

const EditTaskModal = ({ isOpen, task, onClose }: EditTaskModalProps) => {
    const formMethods = useForm<UpdatedTask>({
        resolver: zodResolver(updatedTaskSchema),
    });

    const handleModalClose = () => {
        onClose();
        formMethods.reset({
            id: task.id,
            title: task.title,
            body: task.body,
            status: task.status.name as TaskStatus,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            className="bottom-0 flex h-[90%] w-full flex-col rounded-t-[30px] px-6 pt-8 pb-6 duration-500 md:inset-0 md:m-auto md:h-4/5 md:w-4/5 md:rounded-md md:duration-300"
            enter="md:scale-1"
            leave="translate-y-full md:translate-y-0 md:scale-0"
            onClose={handleModalClose}
        >
            <h3 className="text-3xl font-medium tracking-wide">編輯任務</h3>

            <EditTaskForm formMethods={formMethods} task={task} onSubmit={onClose} />
        </Modal>
    );
};

export default EditTaskModal;

interface UpdateTaskFormProps {
    task: Task;
    formMethods: UseFormReturn<UpdatedTask>;
    onSubmit: () => void;
}

const EditTaskForm = ({ formMethods, task, onSubmit }: UpdateTaskFormProps) => {
    const {
        register,
        formState: { errors },
        setError,
        reset,
    } = formMethods;

    const { mutate, isLoading: isUpdating } = useUpdateTask();

    const handleFormSubmit: FormSubmitHandler<UpdatedTask> = (data) => {
        mutate(data, {
            onSuccess: () => {
                onSubmit();
                reset(undefined, {
                    keepErrors: false,
                })
            },
            onError: () => {
                setError("root", {
                    message: "喔不！發生了一些問題。工程師正在全力搶修中，請稍後重試。",
                });
            },
        });
    };

    return (
        <Form
            formMethods={formMethods}
            className="flex flex-1 flex-col"
            onSubmit={handleFormSubmit}
        >
            <input type="hidden" {...register("id", { value: task.id })} />

            <TaskFormInput<UpdatedTask>
                name="title"
                defaultValue={task.title}
                errorMessage="請填寫標題"
            >
                <TaskFormInput.Label htmlFor="title">
                    標題
                    <small className="text-xs text-slate-400">（必填）</small>
                </TaskFormInput.Label>
            </TaskFormInput>

            <TaskFormDropdown<UpdatedTask>
                name="status"
                options={TaskStatuses}
                defaultValue={task.status.name}
            >
                <TaskFormDropdown.Label htmlFor="status">
                    狀態
                </TaskFormDropdown.Label>
            </TaskFormDropdown>

            <TaskFormTextArea<UpdatedTask>
                name="body"
                defaultValue={task.body}
                errorMessage="內容至少需要 30 字"
            >
                <TaskFormTextArea.Label htmlFor="body">
                    內容
                    <small className="text-xs text-slate-400">
                        （至少需要 30 字）
                    </small>
                </TaskFormTextArea.Label>
            </TaskFormTextArea>

            <div
                className={`flex items-center ${
                    errors.root ? "justify-between" : "justify-end"
                }`}
            >
                {errors.root && (
                    <p className="tracking-wide text-red-500">
                        {errors.root.message}
                    </p>
                )}

                <SaveButton disabled={isUpdating} />
            </div>
        </Form>
    );
};

interface SaveButtonProps {
    disabled: boolean;
}

const SaveButton = ({ disabled }: SaveButtonProps) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="rounded-md bg-purple-400 py-1 px-4 font-medium tracking-wide text-white disabled:bg-purple-400/70"
        >
            儲存
        </button>
    );
};
