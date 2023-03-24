import type { ReactNode } from "react";

interface TitleProps {
    children: ReactNode;
}

const Title = ({ children }: TitleProps) => {
    return <h1 className="text-3xl font-medium tracking-wide">{children}</h1>;
};

export default Title;
