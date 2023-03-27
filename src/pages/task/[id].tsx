import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTask } from "@/hooks/task";
import type { Task } from "@/utils/task";
import EmptyImage from "public/images/empty.png";
import ErrorImage from "public/images/error.png";

const TaskDetailPage: NextPage = () => {
    const router = useRouter();
    const taskId = router.query.id as string | undefined;

    const { data: task, isLoading } = useTask(taskId);

    if (isLoading) {
        return <TaskDetailSkeleton />;
    }

    if (task) {
        if (task.state === "closed") {
            return <NoTaskPage />;
        }

        return <TaskDetail task={task} />;
    }

    return <TaskLoadingErrorMessage />;
};

export default TaskDetailPage;

const TaskDetailSkeleton = () => {
    return (
        <>
            <div className="flex items-end justify-between border-b border-slate-300 pb-2 pr-2">
                <div className="flex items-end">
                    <div className="mt-1 h-8 w-36 rounded-full bg-slate-300" />
                    <span className="ml-2 h-6 w-16 rounded-full bg-slate-300" />
                </div>
            </div>

            <div className="animate-pulse px-0.5 py-4">
                {[...Array(8).fill(0).keys()].map((value) => (
                    <div
                        key={value}
                        className="my-3 h-3.5 rounded-full bg-slate-300"
                    />
                ))}
            </div>
        </>
    );
};

const NoTaskPage = () => {
    return (
        <div className="flex flex-1 flex-col items-center md:justify-center">
            <Image
                src={EmptyImage}
                alt=""
                priority
                className="mt-32 md:mt-0 lg:w-2/5"
            />

            <h1 className="-mt-4 mb-2 text-3xl font-medium tracking-wide md:-mt-10 md:mb-4 md:text-5xl lg:-mt-5 xl:mb-5 xl:-mt-7 xl:text-6xl">
                此任務不存在
            </h1>

            <Link href="/" className="font-medium tracking-wide text-slate-400">
                回首頁
            </Link>
        </div>
    );
};

interface TaskDetailProps {
    task: Task;
}

const TaskDetail = ({ task }: TaskDetailProps) => {
    return (
        <>
            <div className="flex items-end justify-between border-b border-slate-300 pb-2 pr-2">
                <div className="flex items-end">
                    <h1 className="text-4xl font-medium tracking-wide">
                        {task.title}
                    </h1>

                    <span
                        style={{ backgroundColor: `#${task.status.color}` }}
                        className="ml-2 inline-block -translate-y-1 rounded-full py-0.5 px-3 text-sm font-medium text-white"
                    >
                        {task.status.name}
                    </span>
                </div>
            </div>

            <pre className="whitespace-pre-wrap px-0.5 py-4">{task.body}</pre>
        </>
    );
};

const TaskLoadingErrorMessage = () => {
    return (
        <div className="flex flex-1 flex-col items-center">
            <Image src={ErrorImage} alt="" priority className="lg:w-2/5" />

            <h1 className="-mt-6 mb-2 text-3xl font-medium tracking-wide md:-mt-12 md:mb-4 md:text-5xl lg:-mt-5 xl:mb-6 xl:-mt-10 xl:text-6xl">
                喔不！發生了一些問題
            </h1>

            <p className="mb-3 tracking-wide md:text-2xl lg:text-xl">
                工程師正在全力修復，請稍後重試
            </p>

            <Link href="/" className="font-medium tracking-wide text-slate-400">
                回首頁
            </Link>
        </div>
    );
};
