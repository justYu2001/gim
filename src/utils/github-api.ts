import axios from "axios";

export const createGithubApiClient = (accessToken: string) => {
    return axios.create({
        baseURL: "https://api.github.com",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
};
