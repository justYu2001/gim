import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent, ReactNode } from "react";

import { useFormContext } from "react-hook-form";
import type { FieldValues, Path, PathValue } from "react-hook-form";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface TaskFormDropdownProps<T extends FieldValues> {
    name: Path<T>;
    defaultValue?: PathValue<T, Path<T>>;
    options: readonly PathValue<T, Path<T>>[];
    children?: ReactNode;
}

const TaskFormDropdown = <T extends FieldValues>({
    name,
    options,
    defaultValue,
    children,
}: TaskFormDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
        setIsOpen(true);
        event.target.blur();
    };

    const { register, setValue } = useFormContext<T>();

    const handleOptionClick = (event: MouseEvent<HTMLLIElement>) => {
        setValue(name, event.currentTarget.textContent as PathValue<T, Path<T>>);
        setIsOpen(false);
    };

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (dropdownRef.current?.contains(event.target as Node)) {
                return;
            }

            setIsOpen(false);
        };

        document.addEventListener("click", handleClickOutside);

        return () => document.removeEventListener("click", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="my-4">
            {children}

            <div ref={dropdownRef} className="relative">
                <div className="mt-2 flex items-center rounded-md border-2 border-slate-300 px-2 text-lg">
                    <input
                        type="text"
                        id={name}
                        {...register(name, {
                            value: defaultValue ?? options[0],
                        })}
                        className="flex-1 py-1 outline-none hover:cursor-pointer"
                        onFocus={handleInputFocus}
                    />

                    {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>

                <ul
                    className={`absolute inset-x-0 top-11 rounded-md bg-white shadow-lg ${
                        isOpen ? "" : "hidden"
                    }`}
                >
                    {options.map((option) => (
                        <Option key={option} onClick={handleOptionClick}>{option}</Option>
                    ))}
                </ul>
            </div>
        </div>
    );
};

interface OptionProps {
    onClick: (event: MouseEvent<HTMLLIElement>) => void;
    children: ReactNode;
}

const Option = ({ onClick, children }: OptionProps) => {
    return (
        <li
            className="px-2 py-1.5 hover:cursor-pointer hover:bg-slate-100"
            onClick={onClick}
        >
            {children}
        </li>
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

export default Object.assign(TaskFormDropdown, {
    Label,
});
