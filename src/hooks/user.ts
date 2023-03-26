import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export const useUser = () => {
    return useQuery(["user"], {
        queryFn: fetchUser,
        staleTime: Infinity,
        retry: (failureCount, error) => {
            const isLoggedOut = error instanceof AxiosError && error.response?.status === 401;
            return !isLoggedOut;
        },
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
