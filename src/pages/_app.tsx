import { useState } from "react";
import type { AppType } from "next/dist/shared/lib/utils";

import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";

import "@/styles/globals.css";
import Layout from "@/components/layout/Layout";

interface AppProps {
    dehydratedState: DehydratedState;
}

const MyApp: AppType<AppProps> = ({ Component, pageProps }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Hydrate>
        </QueryClientProvider>
    );
};

export default MyApp;
