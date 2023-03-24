import type { ReactNode } from "react";
import Head from "next/head";

import Header from "@/components/layout/Header";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Head>
                <title>Gim</title>
                <meta name="description" content="GitHub issue 管理工具" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="absolute inset-0 flex flex-col overflow-hidden">
                <Header />

                <main className="flex min-h-0 flex-1 flex-col px-8 pt-3">
                    {children}
                </main>
            </div>
        </>
    );
};

export default Layout;
