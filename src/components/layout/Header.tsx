import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import SignInButton from "@/components/auth/SignInButton";
import SighOutButton from "@/components/auth/SignOutButton";
import UserAvatar from "@/components/user/UserAvatar";
import Logo from "public/images/logo.png";

const Header = () => {
    const router = useRouter();

    return (
        <header className="flex items-center justify-between py-6 px-8 md:mb-2">
            <Link
                href="/"
                className="flex items-center text-2xl font-medium tracking-wide"
            >
                <div className="relative mr-2 h-11 w-11">
                    <Image src={Logo} alt="Gim Logo" />
                </div>
                Gim
            </Link>

            {router.pathname === "/" && <SignInButton theme="light" />}

            {router.pathname.startsWith("/task") && (
                <div className="flex items-center space-x-4">
                    <UserAvatar />
                    <SighOutButton className="font-medium tracking-wide text-slate-400">
                        登出
                    </SighOutButton>
                </div>
            )}
        </header>
    );
};

export default Header;
