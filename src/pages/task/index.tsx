import type { NextPage } from "next";
import Link from "next/link";

import { HiOutlinePlus } from "react-icons/hi2";

import Title from "@/components/common/Title";

const TaskPage: NextPage = () => {
    return (
        <>
            <Title>任務列表</Title>

            <div className="flex justify-end pt-6 pb-4">
                <AddTaskButton />
            </div>
        </>
    );
};

export default TaskPage;

const AddTaskButton = () => {
    return (
        <Link
            href="/task/new"
            className="flex w-9 items-center justify-center rounded-md bg-purple-400 font-medium tracking-wide text-white md:inline md:w-auto md:py-2 md:px-4"
        >
            <span className="hidden md:inline">新增任務</span>
            <HiOutlinePlus className="text-2xl md:hidden" />
        </Link>
    );
};
