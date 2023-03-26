import type { ReactNode } from "react";

import { useFormContext } from "react-hook-form";
import type { FieldValues, Path, PathValue } from "react-hook-form";

interface TaskFormTextAreaProps<T extends FieldValues> {
    name: Path<T>;
    defaultValue?: PathValue<T, Path<T>>;
    errorMessage: string;
    children: ReactNode;
}

const TaskFormTextArea = <T extends FieldValues>({
    name,
    defaultValue,
    errorMessage,
    children,
}: TaskFormTextAreaProps<T>) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="my-4 flex flex-1 flex-col">
            {children}

            <textarea
                id={name}
                {...register(name, { value: defaultValue })}
                className={`mt-2 flex-1 resize-none rounded-md border-2 border-slate-300 p-2 text-lg outline-none transition duration-300 ${
                    errors[name]
                        ? "focus:border-red-500"
                        : "focus:border-purple-400"
                }`}
            />

            <p className="mt-1.5 h-4 pl-0.5 text-sm text-red-500">
                {errors[name] && errorMessage}
            </p>
        </div>
    );
};

interface LabelProps {
    htmlFor: string;
    children: ReactNode;
}

const Label = ({ htmlFor, children }: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className="text-lg tracking-wide hover:cursor-pointer"
        >
            {children}
        </label>
    );
};

export default Object.assign(TaskFormTextArea, {
    Label,
});
