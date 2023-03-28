import { z } from "zod";

import { githubApiHandler } from "@/utils/api-handler";
import type { GitHubApiHandler } from "@/utils/api-handler";
import { updateGithubIssue } from "@/utils/github-api";

const deleteTaskQuerySchema = z.object({
    id: z.string().min(1).transform((value) => parseInt(value)),
});

const deleteTask: GitHubApiHandler = async ({ request, response }) => {
    const { id } = deleteTaskQuerySchema.parse(request.query);

    await updateGithubIssue(id, { state: "closed" });

    response.status(204).end();
};

export default githubApiHandler({
    DELETE: deleteTask,
});
