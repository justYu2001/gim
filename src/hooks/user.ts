import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
    return useQuery(["user"], {
        queryFn: fetchUser,
        staleTime: Infinity,
    });
};

export interface User {
    username: string;
    avatarUrl: string;
}

const fetchUser = async () => {
    const { data } = await axios.get<User>("/api/user");
    return data;
};
