import { Octokit } from "@octokit/rest";

/**
 * Create an authenticated Octokit instance using environment variables.
 */
function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO env vars"
    );
  }

  return new Octokit({ auth: token });
}

function getConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) throw new Error("Missing GITHUB_OWNER or GITHUB_REPO");
  return { owner, repo };
}

/**
 * Get the content of a file from the repository.
 * Returns the decoded content string, or null if the file doesn't exist.
 */
export async function getFileContent(path: string): Promise<string | null> {
  const octokit = getOctokit();
  const { owner, repo } = getConfig();

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data) || data.type !== "file" || !("content" in data)) {
      return null;
    }

    // content is base64-encoded
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch (err: unknown) {
    // 404 = file not found
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      (err as { status: number }).status === 404
    ) {
      return null;
    }
    throw err;
  }
}

/**
 * Get the SHA of a file (required for updates and deletes).
 * Returns null if the file doesn't exist.
 */
async function getFileSha(path: string): Promise<string | null> {
  const octokit = getOctokit();
  const { owner, repo } = getConfig();

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data) || data.type !== "file" || !("sha" in data)) {
      return null;
    }

    return data.sha;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      (err as { status: number }).status === 404
    ) {
      return null;
    }
    throw err;
  }
}

/**
 * Create or update a file in the repository.
 * If the file exists, it will be updated; otherwise, it will be created.
 */
export async function updateFileContent(
  path: string,
  content: string,
  message: string
): Promise<{ commit: { sha: string } }> {
  const octokit = getOctokit();
  const { owner, repo } = getConfig();

  const sha = await getFileSha(path);

  const encodedContent = Buffer.from(content, "utf-8").toString("base64");

  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: encodedContent,
    ...(sha ? { sha } : {}),
  });

  return { commit: { sha: data.commit.sha ?? "" } };
}

/**
 * Delete a file from the repository.
 */
export async function deleteFile(
  path: string,
  message: string
): Promise<void> {
  const octokit = getOctokit();
  const { owner, repo } = getConfig();

  const sha = await getFileSha(path);
  if (!sha) {
    throw new Error(`File not found: ${path}`);
  }

  await octokit.repos.deleteFile({
    owner,
    repo,
    path,
    message,
    sha,
  });
}

/**
 * List all files in a directory matching a pattern.
 */
export async function listFiles(
  dir: string,
  pattern?: string
): Promise<string[]> {
  const octokit = getOctokit();
  const { owner, repo } = getConfig();

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: dir,
    });

    if (!Array.isArray(data)) return [];

    const files = data
      .filter((item) => item.type === "file")
      .map((item) => item.name)
      .filter((name) => !pattern || name.includes(pattern));

    return files;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      (err as { status: number }).status === 404
    ) {
      return [];
    }
    throw err;
  }
}

/**
 * List all directories in a given path.
 */
export async function listDirectories(dir: string): Promise<string[]> {
  const octokit = getOctokit();
  const { owner, repo } = getConfig();

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: dir,
    });

    if (!Array.isArray(data)) return [];

    return data.filter((item) => item.type === "dir").map((item) => item.name);
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      (err as { status: number }).status === 404
    ) {
      return [];
    }
    throw err;
  }
}
