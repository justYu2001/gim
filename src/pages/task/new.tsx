import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import Form from "@/components/common/Form";
import type { FormSubmitHandler } from "@/components/common/Form";
import Title from "@/components/common/Title";
import TaskFormInput from "@/components/task/TaskFormInput";
import TaskFormTextArea from "@/components/task/TaskFormTextArea";
import { useAddTask } from "@/hooks/task";

const newTaskSchema = z.object({
    title: z.string().trim().min(1),
    body: z.string().trim().min(30),
});

type NewTask = z.infer<typeof newTaskSchema>;

const NewTaskPage: NextPage = () => {
    const formMethods = useForm<NewTask>({
        resolver: zodResolver(newTaskSchema),
    });

    const { setError } = formMethods;

    const router = useRouter();

    const { mutate, isLoading } = useAddTask();

    const handleFormSubmit: FormSubmitHandler<NewTask> = (data) => {
        mutate(data, {
            onSuccess: () => {
                void router.push("/");
            },
            onError: () => {
                setError("root", {
                    message:
                        "喔不！發生了一些問題。工程師正在全力搶修中，請稍後重試。",
                });
            },
        });
    };

    return (
        <>
            <Title>建立任務</Title>
            <AddTaskForm
                formMethods={formMethods}
                isSubmitting={isLoading}
                onSubmit={handleFormSubmit}
            />
        </>
    );
};

export default NewTaskPage;

interface AddTaskFormProps {
    formMethods: UseFormReturn<NewTask>;
    isSubmitting: boolean;
    onSubmit: FormSubmitHandler<NewTask>;
}

const AddTaskForm = ({ formMethods, isSubmitting, onSubmit }: AddTaskFormProps) => {
    const { formState: { errors } } = formMethods;

    return (
        <Form
            formMethods={formMethods}
            className="flex flex-1 flex-col pb-4"
            onSubmit={onSubmit}
        >
            <TaskFormInput<NewTask> name="title" errorMessage="請填寫標題">
                <TaskFormInput.Label htmlFor="title">
                    標題
                    <small className="text-xs text-slate-400">（必填）</small>
                </TaskFormInput.Label>
            </TaskFormInput>

            <TaskFormTextArea name="body" errorMessage="內容至少需要 30 字">
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

                <div>
                    <SubmitButton disabled={isSubmitting} />
                    <CancelButton />
                </div>
            </div>
        </Form>
    );
};

interface SubmitButtonProps {
    disabled: boolean;
}

const SubmitButton = ({ disabled }: SubmitButtonProps) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="mr-2 rounded-md bg-purple-400 py-1.5 px-5 font-medium tracking-wide text-white disabled:bg-purple-400/70"
        >
            新增
        </button>
    );
};

const CancelButton = () => {
    return (
        <Link
            href="/"
            className="rounded-md border border-slate-400 py-2 px-5 font-medium tracking-wide text-slate-400 hover:bg-black/5"
        >
            取消
        </Link>
    );
};
