import { githubApiHandler } from "@/utils/api-handler";
import type { GitHubApiHandler } from "@/utils/api-handler";

interface User {
    username: string;
    avatarUrl: string;
}

interface GitHubUserApiResponse {
    login: string;
    avatar_url: string;
}

const getUser: GitHubApiHandler<User> = async ({ response, githubApiClient }) => {
    const { data } = await githubApiClient.get<GitHubUserApiResponse>("/user");

    response.status(200).send({
        username: data.login,
        avatarUrl: data.avatar_url,
    });
};

export default githubApiHandler({
    GET: getUser,
});