import { Fragment, forwardRef, useEffect, useRef, useState } from "react";
import type { CompositionEvent, KeyboardEvent } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineArrowLongDown, HiOutlineArrowLongUp, HiOutlinePlus } from "react-icons/hi2";
import { TbReload } from "react-icons/tb";

import TabList from "@/components/common/TabList";
import Title from "@/components/common/Title";
import { useTasks } from "@/hooks/task";
import { TaskStatuses } from "@/utils/task";
import type { Task, TaskOrder } from "@/utils/task";
import ErrorImage from "public/images/error.png";

const TaskListPage: NextPage = () => {
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("All");
    const [order, setOrder] = useState<TaskOrder>("desc");

    return (
        <>
            <Title>任務列表</Title>

            <div className="flex items-center space-x-4 pt-6 pb-4 md:items-stretch">
                <SearchBar onChange={setKeyword} />
                <AddTaskButton />
            </div>

            <div className="relative">
                <TabList tabs={["All", ...TaskStatuses]} activeTab={status} onChange={setStatus} />

                <div className="absolute top-3 right-0.5">
                    <OrderButton order={order} onClick={setOrder} />
                </div>
            </div>

            <TaskList keyword={keyword} status={status} order={order} />
        </>
    );
};

export default TaskListPage;

const AddTaskButton = () => {
    return (
        <Link
            href="/task/new"
            className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-400 font-medium tracking-wide text-white md:inline md:h-auto md:w-auto md:py-2 md:px-4"
        >
            <span className="hidden md:inline">新增任務</span>
            <HiOutlinePlus className="text-2xl md:hidden" />
        </Link>
    );
};

interface SearchBarProps {
    onChange: (value: string) => void;
}

const SearchBar = ({ onChange }: SearchBarProps) => {
    const { compositionStatus, handleCompositionEvent } = useCompositionEvent();

    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const isCompositionEnd = compositionStatus.current === "compositionend";

        if (event.key === "Enter" && isCompositionEnd && buttonRef.current) {
            buttonRef.current.click();
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (inputRef.current) {
            onChange(inputRef.current.value);
        }
    };

    return (
        <div className="flex flex-1 rounded-md border border-slate-400 pl-2">
            <input
                type="text"
                ref={inputRef}
                className="flex-1 bg-transparent py-1 px-1 text-lg tracking-wide md:py-0"
                onKeyDown={handleInputKeyDown}
                onCompositionStart={handleCompositionEvent}
                onCompositionUpdate={handleCompositionEvent}
                onCompositionEnd={handleCompositionEvent}
            />

            <button
                ref={buttonRef}
                className="border-l border-slate-400 px-2 text-slate-400 hover:bg-black/5"
                onClick={handleButtonClick}
            >
                <AiOutlineSearch className="text-2xl" />
            </button>
        </div>
    );
};

type CompositionStatus = "compositionstart" | "compositionupdate" | "compositionend";

const useCompositionEvent = () => {
    /**
     * If we set default status to `compositionstart`, and the developer use the composition
     * status as a condition for some actions to be executed, the English user will not be
     * able to meet the condition until the `compositionend` event is triggered.
     * Therefore, we need to set the default status to `compositionend`.
     */
    const compositionStatus = useRef<CompositionStatus>("compositionend");

    const handleCompositionEvent = (event: CompositionEvent<HTMLInputElement>) => {
        compositionStatus.current = event.type as CompositionStatus;
    };

    return {
        compositionStatus,
        handleCompositionEvent,
    };
};

interface OrderButtonProps {
    order: TaskOrder;
    onClick: (order: TaskOrder) => void;
}

const OrderButton = ({ order, onClick }: OrderButtonProps) => {
    const handleButtonClick = () => {
        const newOrder = order === "desc" ? "asc" : "desc";
        onClick(newOrder);
    };

    return (
        <div className="flex items-center px-2 font-medium tracking-wide text-slate-400">
            <span className="hidden md:inline">建立時間</span>

            <button
                className="ml-0.5 rounded-md p-1 text-2xl hover:bg-black/10"
                onClick={handleButtonClick}
            >
                {order === "desc" ? (
                    <HiOutlineArrowLongDown />
                ) : (
                    <HiOutlineArrowLongUp />
                )}
            </button>
        </div>
    );
};

interface TaskListProps {
    keyword: string;
    status: string;
    order: TaskOrder;
}

const TaskList = ({ keyword, status, order }: TaskListProps) => {
    const {
        data,
        isLoading,
        isRefetching,
        isFetchingNextPage,
        isError,
        hasNextPage,
        fetchNextPage,
    } = useTasks({
        keyword,
        status,
        order,
    });

    const lastTaskListItemRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const observerOptions: IntersectionObserverInit = {
            threshold: 1,
        };

        const callback: IntersectionObserverCallback = (entries) => {
            const entry = entries[0];

            if (entry && entry.isIntersecting) {
                void fetchNextPage();
            }
        };

        const observer = new IntersectionObserver(callback, observerOptions);

        /**
         * The Ref of the last task should only be updated when there are
         * more tasks to be loaded ,and after new tasks are loaded or the
         * page is switched back to the homepage after the user updates data.
         */
        if (lastTaskListItemRef.current && hasNextPage && (!isFetchingNextPage || isRefetching)) {
            const lastTaskListItem = lastTaskListItemRef.current;

            observer.observe(lastTaskListItem);

            return () => observer.unobserve(lastTaskListItem);
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching]);

    if (isLoading || isRefetching) {
        return (
            <ul className="flex-1 bg-slate-100">
                <TaskListItemSkeletons length={8} />
            </ul>
        );
    }

    if (isError && !data) {
        return <TaskListInitialLoadingErrorMessage />;
    }

    return (
        <ul className="h-full flex-1 overflow-y-scroll bg-slate-100">
            {data.pages.map((page, pageIndex, pages) => (
                <Fragment key={pageIndex}>
                    {page.tasks.map((task, taskIndex) => {
                        const isLastTask = pageIndex === pages.length - 1 && taskIndex === 9;
                        const ref = isLastTask ? { ref: lastTaskListItemRef } : {};

                        return (
                            <TaskListItem key={task.id} task={task} {...ref} />
                        );
                    })}
                </Fragment>
            ))}

            {isFetchingNextPage && <TaskListItemSkeletons length={3} />}

            {isError && <NewTaskLoadingErrorMessage onReload={() => void fetchNextPage()} />}
        </ul>
    );
};

interface TaskListItemSkeletonsProps {
    length: number;
}

const TaskListItemSkeletons = ({ length }: TaskListItemSkeletonsProps) => {
    return (
        <>
            {[...Array(length).keys()].map((value) => (
                <TaskListItemSkeleton key={value} />
            ))}
        </>
    );
};

const TaskListItemSkeleton = () => {
    return (
        <li className="border-b border-slate-300 bg-white py-3 pl-3 pr-4 last:border-none hover:cursor-pointer hover:bg-gray-100">
            <div className="animate-pulse">
                <div className="my-2 h-4 rounded-full bg-slate-300 md:w-96" />
                <div className="mt-3 h-5 w-16 rounded-full bg-slate-300 py-0.5 px-3" />
            </div>
        </li>
    );
};

interface TaskListItemProps {
    task: Task;
}

const TaskListItem = forwardRef<HTMLLIElement, TaskListItemProps>(({ task }, ref) => (
    <li
        ref={ref}
        className="border-b border-slate-300 bg-white last:border-none hover:cursor-pointer hover:bg-gray-100"
    >
        <Link href={`/task/${task.id}`} className="block p-3">
            <h3 className="break-all text-xl font-medium">{task.title}</h3>

            <span
                style={{ backgroundColor: `#${task.status.color}` }}
                className="-ml-1 mt-2 inline-block rounded-full py-0.5 px-3 text-sm font-medium text-white"
            >
                {task.status.name}
            </span>
        </Link>
    </li>
));

TaskListItem.displayName = "TaskListItem";

interface NewTaskLoadingErrorMessageProps {
    onReload: () => void;
}

const NewTaskLoadingErrorMessage = ({ onReload }: NewTaskLoadingErrorMessageProps) => {
    return (
        <li className="flex flex-col items-center bg-white py-4 tracking-wide">
            <p className="mb-1 text-xl">喔不！發生了一些問題</p>

            <button
                className="flex items-center font-medium text-slate-400"
                onClick={onReload}
            >
                重新載入
                <TbReload />
            </button>
        </li>
    );
};

const TaskListInitialLoadingErrorMessage = () => {
    return (
        <div className="flex flex-1 flex-col items-center pt-8 md:justify-center md:pt-0">
            <Image
                src={ErrorImage}
                alt=""
                priority
                className="w-4/5 md:w-3/5 lg:w-80 xl:w-96"
            />

            <h1 className="-mt-4 mb-0.5 text-3xl font-medium tracking-wide md:mb-1 md:-mt-8 md:text-3xl lg:-mt-5 xl:mb-4 xl:-mt-6 xl:text-4xl">
                喔不！發生了一些問題
            </h1>

            <p className="tracking-wide xl:text-xl">
                工程師正在全力修復，請稍後重試
            </p>
        </div>
    );
};
