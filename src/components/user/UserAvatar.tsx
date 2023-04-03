import Image from "next/image";

import { useUser } from "@/hooks/user";
import DefaultAvatar from "public/images/default-avatar.png";

const UserAvatar = () => {
    const { data: user, isLoading, isError } = useUser();

    if (isLoading || isError) {
        return <Image src={DefaultAvatar} alt="" className="w-11 rounded-full" />;
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
