import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const tmpRepoDir = path.join(root, ".tmp-content-repo");

const contentTargets = [
  "src/content/posts",
  "src/content/profile",
  "src/data/content",
  "public/assets"
];

const mappings = [
  { source: "posts", target: "src/content/posts", kind: "directory" },
  { source: "profile", target: "src/content/profile", kind: "markdown" },
  { source: "resources", target: "src/data/content/resources", kind: "directory" },
  { source: "links", target: "src/data/content/links", kind: "directory" },
  { source: "records", target: "src/data/content/records", kind: "directory" },
  { source: "profile/resume.json", target: "src/data/content/profile/resume.json", kind: "file" },
  { source: "assets", target: "public/assets", kind: "directory" }
];

function env(name, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function isEnabled(value) {
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

async function resetGeneratedContent() {
  await Promise.all(
    contentTargets.map((target) =>
      rm(path.join(root, target), { recursive: true, force: true })
    )
  );
}

function hasSupportedContent(sourceRoot) {
  return ["posts", "resources", "links", "profile", "records", "assets"].some((name) =>
    existsSync(path.join(sourceRoot, name))
  );
}

function resolveContentRoot(sourceRoot) {
  const resolved = path.resolve(root, sourceRoot);
  if (hasSupportedContent(resolved)) {
    return resolved;
  }

  const nestedContent = path.join(resolved, "content");
  if (hasSupportedContent(nestedContent)) {
    return nestedContent;
  }

  return resolved;
}

async function copyPathIfExists(sourceRoot, relativeSource, relativeTarget) {
  const source = path.join(sourceRoot, relativeSource);
  const target = path.join(root, relativeTarget);

  if (!existsSync(source)) {
    return false;
  }

  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true, force: true });
  return true;
}

async function copyMarkdownDirIfExists(sourceRoot, relativeSource, relativeTarget) {
  const source = path.join(sourceRoot, relativeSource);
  const target = path.join(root, relativeTarget);

  if (!existsSync(source)) {
    return false;
  }

  async function copyMarkdown(currentSource, currentTarget) {
    await mkdir(currentTarget, { recursive: true });
    const entries = await readdir(currentSource, { withFileTypes: true });

    for (const entry of entries) {
      const nextSource = path.join(currentSource, entry.name);
      const nextTarget = path.join(currentTarget, entry.name);

      if (entry.isDirectory()) {
        await copyMarkdown(nextSource, nextTarget);
        continue;
      }

      if ([".md", ".mdx"].includes(path.extname(entry.name).toLowerCase())) {
        await cp(nextSource, nextTarget, { force: true });
      }
    }
  }

  await copyMarkdown(source, target);
  return true;
}

async function syncFrom(sourceRoot) {
  const contentRoot = resolveContentRoot(sourceRoot);

  if (!existsSync(contentRoot)) {
    throw new Error(`Content source does not exist: ${contentRoot}`);
  }

  await resetGeneratedContent();

  const copied = [];
  for (const mapping of mappings) {
    const didCopy =
      mapping.kind === "markdown"
        ? await copyMarkdownDirIfExists(contentRoot, mapping.source, mapping.target)
        : await copyPathIfExists(contentRoot, mapping.source, mapping.target);

    if (didCopy) {
      copied.push(`${mapping.source} -> ${mapping.target}`);
    }
  }

  if (copied.length === 0) {
    throw new Error(`No supported content files found in: ${contentRoot}`);
  }

  console.log("Content synced successfully.");
  for (const item of copied) {
    console.log(`- ${item}`);
  }
}

async function cloneContentRepository(repoUrl, branch) {
  await rm(tmpRepoDir, { recursive: true, force: true });

  const result = spawnSync(
    "git",
    ["clone", "--depth", "1", "--branch", branch, repoUrl, tmpRepoDir],
    {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32"
    }
  );

  if (result.status !== 0) {
    throw new Error("Failed to clone content repository.");
  }

  return tmpRepoDir;
}

async function main() {
  const syncEnabled = isEnabled(env("ENABLE_CONTENT_SYNC", "false"));

  if (!syncEnabled) {
    await syncFrom(path.join(root, "content.example"));
    return;
  }

  const localPath = env("CONTENT_LOCAL_PATH");
  if (localPath) {
    await syncFrom(path.resolve(root, localPath));
    return;
  }

  const repoUrl = env("CONTENT_REPO_URL");
  const branch = env("CONTENT_BRANCH", "main");

  if (!repoUrl) {
    throw new Error(
      "CONTENT_REPO_URL is required when ENABLE_CONTENT_SYNC=true and CONTENT_LOCAL_PATH is empty."
    );
  }

  const sourceRoot = await cloneContentRepository(repoUrl, branch);
  try {
    await syncFrom(sourceRoot);
  } finally {
    await rm(tmpRepoDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
