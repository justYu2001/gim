import { useRouter } from "next/router";

import Modal from "@/components/common/Modal";
import { useDeleteTask } from "@/hooks/task";

interface DeleteTaskDialogProps {
    isOpen: boolean;
    taskId: number;
    onClose: () => void;
}

const DeleteTaskDialog = ({ isOpen, taskId, onClose }: DeleteTaskDialogProps) => {
    const { mutate, isLoading, isSuccess } = useDeleteTask();

    const router = useRouter();

    const handleDeleteButtonClick = () => {
        mutate(taskId, {
            onSuccess: () => {
                void router.push("/task");
            },
            onError: () => {
                void router.push("/error");
            },
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            className="inset-0 m-auto flex h-44 w-10/12 flex-col rounded-md p-3 duration-300 md:w-96"
            enter="scale-1"
            leave="scale-0"
            onClose={onClose}
        >
            <div className="flex-1">
                <h3 className="border-b border-slate-400 pb-1 text-xl font-medium tracking-wide">
                    刪除任務
                </h3>

                <p className="pt-2">是否要刪除任務？</p>
            </div>

            <div className="flex justify-end space-x-2">
                <DeleteButton disabled={isLoading || isSuccess} onClick={handleDeleteButtonClick} />
                <CancelButton onClick={onClose} />
            </div>
        </Modal>
    );
};

export default DeleteTaskDialog;

interface DeleteButtonProps {
    disabled: boolean;
    onClick: () => void;
}

const DeleteButton = ({ disabled, onClick }: DeleteButtonProps) => {
    return (
        <button
            className="rounded-md border border-red-500 bg-red-500 py-1.5 px-4 font-medium tracking-wide text-white disabled:bg-red-500/70"
            disabled={disabled}
            onClick={onClick}
        >
            刪除
        </button>
    );
};

interface CancelButtonProps {
    onClick: () => void;
}

const CancelButton = ({ onClick }: CancelButtonProps) => {
    return (
        <button
            className="rounded-md border border-slate-400 py-1.5 px-4 font-medium tracking-wide text-slate-400 hover:bg-black/5"
            onClick={onClick}
        >
            取消
        </button>
    );
};
