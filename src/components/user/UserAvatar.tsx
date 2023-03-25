import Image from "next/image";

import { AxiosError } from "axios";

import SignOutDialog from "@/components/auth/SignOutDialog";
import { useUser } from "@/hooks/user";
import DefaultAvatar from "public/images/default-avatar.png";

const UserAvatar = () => {
    const { data: user, isLoading, isError, error } = useUser();

    if (isLoading || isError) {
        const isLoggedOut = error instanceof AxiosError && error.response?.status === 401;

        return (
            <>
                <SignOutDialog isOpen={isLoggedOut} />
                <Image
                    src={DefaultAvatar}
                    alt=""
                    className="w-11 rounded-full"
                />
            </>
        );
    }

    return (
        <div className="relative h-11 w-11">
            <Image
                src={user.avatarUrl}
                alt=""
                fill
                sizes="2.75rem"
                className="rounded-full outline-none"
            />
        </div>
    );
};

export default UserAvatar;
