import type { MouseEvent, ReactNode } from "react";

interface TabListProps {
    activeTab: string;
    tabs: string[];
    onChange: (tab: string) => void;
}

const TabList = ({ activeTab, tabs, onChange }: TabListProps) => {
    return (
        <ul className="mt-2 flex border-b border-slate-300">
            {tabs.map((tab) => (
                <Tab key={tab} isActive={activeTab === tab} onClick={onChange}>
                    {tab}
                </Tab>
            ))}
        </ul>
    );
};

export default TabList;

interface TabProps {
    isActive: boolean;
    onClick: (tab: string) => void;
    children: ReactNode;
}

const Tab = ({ isActive, onClick, children }: TabProps) => {
    const handleClick = (event: MouseEvent<HTMLLIElement>) => {
        const tab = event.currentTarget.textContent;

        if (tab) {
            onClick(tab);
        }
    };

    return (
        <li
            className={`relative cursor-pointer text-lg font-medium tracking-wide ${
                isActive ? "text-purple-400" : "text-slate-400"
            } py-1.5 px-2.5 after:absolute md:px-4 ${
                isActive
                    ? "after:bg-purple-400 after:opacity-100"
                    : "after:bg-slate-400 after:opacity-0"
            } after:inset-x-0 after:-bottom-0.5 after:block after:h-0.5 after:rounded-full after:transition after:duration-300 after:hover:opacity-100`}
            onClick={handleClick}
        >
            {children}
        </li>
    );
};
