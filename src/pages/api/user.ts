import { githubApiHandler } from "@/utils/api-handler";
import type { GitHubApiHandler } from "@/utils/api-handler";
import { getGithubUser } from "@/utils/github-api";

interface User {
    username: string;
    avatarUrl: string;
}

const getUser: GitHubApiHandler<User> = async ({ request, response, githubApiClient }) => {
    const { session } = request;

    const user = await getGithubUser(githubApiClient);

    response.status(200).send({
        username: session.username as string,
        avatarUrl: user.avatarUrl,
    });
};

export default githubApiHandler({
    GET: getUser,
});
