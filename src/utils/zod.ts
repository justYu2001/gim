import type { ZodError } from "zod";

export const formatZodErrors = (error: ZodError) => {
    const fieldErrors = Object.entries(error.flatten().fieldErrors);

    const formattedErrors = fieldErrors.map(([field, errors]) => {
        if (errors) {
            return `${field}: ${errors.join(". ")}\n`;
        }
    });

    return formattedErrors.filter(
        (error): error is string => typeof error === "string"
    );
};
