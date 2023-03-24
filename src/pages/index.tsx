import type { NextPage } from "next";
import Image from "next/image";

import SignInButton from "@/components/auth/SignInButton";
import LifeImage from "public/images/life.png";

const HomePage: NextPage = () => {
    return (
        <div className="flex flex-1 flex-col items-center">
            <Image
                src={LifeImage}
                alt=""
                priority
                className="mt-10 lg:mt-10 lg:w-3/5 xl:mt-20 xl:w-2/5"
            />

            <h1 className="-mt-5 mb-5 text-2xl font-medium tracking-wide md:-mt-10 md:mb-7 md:text-6xl lg:mb-8 lg:text-5xl xl:mb-10 xl:text-6xl">
                完成更多，輕鬆生活
            </h1>

            <SignInButton theme="primary" />
        </div>
    );
};

export default HomePage;
