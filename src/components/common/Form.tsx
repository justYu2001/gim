import type { FormEvent, ReactNode } from "react";

import { FormProvider } from "react-hook-form";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export type FormSubmitHandler<T extends FieldValues> = (data: T) => void;

interface FormProps<T extends FieldValues> {
    formMethods: UseFormReturn<T>;
    className?: string;
    onSubmit: FormSubmitHandler<T>;
    children: ReactNode;
}

const Form = <T extends FieldValues>({
    formMethods,
    className = "",
    onSubmit,
    children,
}: FormProps<T>) => {
    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        void formMethods.handleSubmit((data) => onSubmit(data))();
    };

    return (
        <FormProvider {...formMethods}>
            <form className={className} onSubmit={handleFormSubmit}>
                {children}
            </form>
        </FormProvider>
    );
};

export default Form;
