import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const tmpRepoDir = path.join(root, ".tmp-content-repo");

const contentTargets = [
  "src/content/posts",
  "src/content/profile",
  "src/content/spec",
  "src/data/content",
  "public/assets"
];

const mappings = [
  { source: "posts", target: "src/content/posts", kind: "directory" },
  { source: "profile", target: "src/content/profile", kind: "markdown" },
  { source: "profile/about.md", target: "src/content/spec/about.md", kind: "file" },
  { source: "resources", target: "src/data/content/resources", kind: "directory" },
  { source: "links", target: "src/data/content/links", kind: "directory" },
  { source: "records", target: "src/data/content/records", kind: "directory" },
  { source: "profile/resume.json", target: "src/data/content/profile/resume.json", kind: "file" },
  { source: "assets", target: "public/assets", kind: "directory" }
];

function env(name, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

async function ensureSpecContent(sourceRoot) {
  const specDir = path.join(root, "src/content/spec");
  await mkdir(specDir, { recursive: true });

  const aboutSource = path.join(sourceRoot, "profile/about.md");
  const aboutTarget = path.join(specDir, "about.md");
  if (!existsSync(aboutTarget)) {
    const aboutBody = existsSync(aboutSource)
      ? await readFile(aboutSource, "utf8")
      : "# 关于 MikanArchive\n\n这里是个人资料示例内容。";
    await writeFile(aboutTarget, aboutBody, "utf8");
  }

  const friendsTarget = path.join(specDir, "friends.mdx");
  if (!existsSync(friendsTarget)) {
    await writeFile(
      friendsTarget,
      `---\ntitle: "友邻"\ndescription: "把值得常去的站点放在近处。"\n---\n\nexport const site = {\n  name: "MikanArchive",\n  desc: "一个记录教程、收藏资源和整理足迹的个人知识收藏博客。",\n  url: "https://example.com",\n  avatar: "/assets/avatars/example-maker.svg",\n  email: "hello@example.com",\n};\n\nexport const notes = [\n  { title: "互换原则", content: "请先将本站添加到您的友链页面，确认后会添加您的友链。" },\n  { title: "链接维护", content: "友链网站长期无法访问或内容违规，将会被移除。" },\n  { title: "内容要求", content: "内容积极向上，不包含违法或有害内容。" },\n  { title: "站点要求", content: "支持 HTTPS，以原创内容为主，能够正常访问且有持续更新。" },\n];\n\n<div class="not-prose my-4 rounded-2xl border border-(--line-divider) p-5 leading-7">\n  <h3 class="mb-3 text-lg font-bold">友链申请</h3>\n  <p>欢迎交换友链。请先添加本站信息，再通过邮件或评论发送你的站点名称、描述、链接和头像。</p>\n  <pre class="mt-4 overflow-x-auto rounded-xl bg-black/5 p-4 text-xs dark:bg-white/10">站点名称：你的站点名称\n站点描述：你的站点描述\n站点链接：https://example.com\n头像链接：https://example.com/avatar.png</pre>\n</div>\n`,
      "utf8"
    );
  }
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

  await ensureSpecContent(contentRoot);

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
