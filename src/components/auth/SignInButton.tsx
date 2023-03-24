import { useEffect, useRef } from "react";
import Image from "next/image";

import GithubLogo from "public/images/github-logo.png";

const Themes = ["primary", "light"] as const;
type Theme = (typeof Themes)[number];

interface SignInButtonProps {
    theme: Theme;
}

const SignInButton = ({ theme }: SignInButtonProps) => {
    const callbackUrlRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (callbackUrlRef.current) {
            callbackUrlRef.current.value = `${window.location.origin}/api/auth/callback`;
        }
    }, []);

    const signInButtonRef = useRef<HTMLButtonElement>(null);

    const disableSignInButton = () => {
        if (signInButtonRef.current) {
            signInButtonRef.current.disabled = true;
        }
    };

    return (
        <form
            action="/api/auth/signin"
            method="POST"
            onSubmit={disableSignInButton}
        >
            <input type="hidden" name="callbackUrl" ref={callbackUrlRef} />

            <button
                type="submit"
                ref={signInButtonRef}
                className={`cursor-pointer font-medium tracking-wide ${styles[theme]}`}
            >
                {theme === "primary" && <Image src={GithubLogo} alt="" className="mr-2.5 h-6 w-6" />}
                使用 GitHub 帳號登入
            </button>
        </form>
    );
};

export default SignInButton;

const styles: Record<Theme, string> = {
    primary: "flex rounded-md bg-black py-3 px-5 text-white disabled:bg-black/50",
    light: "text-slate-400",
};
