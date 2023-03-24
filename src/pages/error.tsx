import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import ErrorImage from "public/images/error.png";

const ErrorPage: NextPage = () => {
    return (
        <div className="flex flex-1 flex-col items-center">
            <Image src={ErrorImage} alt="" priority className="lg:w-2/5" />

            <h1 className="-mt-6 mb-2 text-3xl font-medium tracking-wide md:-mt-12 md:mb-4 md:text-5xl lg:-mt-5 xl:mb-6 xl:-mt-10 xl:text-6xl">
                喔不！發生了一些問題
            </h1>

            <p className="mb-3 tracking-wide md:text-2xl lg:text-xl">
                工程師正在全力修復，請稍後重試
            </p>

            <Link href="/" className="font-medium tracking-wide text-slate-400">
                回首頁
            </Link>
        </div>
    );
};

export default ErrorPage;
