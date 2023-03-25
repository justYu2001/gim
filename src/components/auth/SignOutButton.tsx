import type { ReactNode } from "react";

interface SighOutButtonProps {
    className?: string;
    children: ReactNode;
}

const SighOutButton = ({ className = "", children }: SighOutButtonProps) => {
    return (
        <form action="/api/auth/signout" method="POST">
            <button
                type="submit"
                className={className}
            >
                {children}
            </button>
        </form>
    );
};

export default SighOutButton;
