import { useState } from "react";
import type { AppType } from "next/dist/shared/lib/utils";

import { Hydrate, QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorBoundary } from "react-error-boundary";

import "@/styles/globals.css";
import SighOutButton from "@/components/auth/SignOutButton";
import Modal from "@/components/common/Modal";
import Layout from "@/components/layout/Layout";

interface AppProps {
    dehydratedState: DehydratedState;
}

const MyApp: AppType<AppProps> = ({ Component, pageProps }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry(failureCount, error) {
                            return !isLoggedOut(error);
                        },
                        useErrorBoundary: (error) => {
                            return isLoggedOut(error);
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <QueryErrorResetBoundary>
                    <ErrorBoundary fallback={<SignOutDialog />}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ErrorBoundary>
                </QueryErrorResetBoundary>
            </Hydrate>
        </QueryClientProvider>
    );
};

export default MyApp;

const isLoggedOut = (error: unknown) => {
    return error instanceof AxiosError && error.response?.status === 401;
};

const SignOutDialog = () => {
    return (
        <Modal
            isOpen={true}
            className="inset-0 m-auto flex h-44 w-10/12 flex-col rounded-md p-3 duration-300 md:w-96"
            enter="scale-1"
            leave="scale-0"
        >
            <div className="flex-1">
                <h3 className="border-b border-slate-400 pb-1 text-xl font-medium tracking-wide">
                    請重新登入
                </h3>

                <p className="pt-2.5">您已經登出，請重新登入。</p>
            </div>

            <div className="flex justify-end">
                <SighOutButton className="rounded-md border bg-purple-400 py-1.5 px-4 font-medium tracking-wide text-white">
                    重新登入
                </SighOutButton>
            </div>
        </Modal>
    );
};