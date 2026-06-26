import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];

function addError(file, message) {
  errors.push(`${file}: ${message}`);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function parseScalar(raw) {
  const value = raw.trim();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    try {
      return JSON.parse(value.replaceAll("'", '"'));
    } catch {
      return value;
    }
  }

  return value;
}

function parseFrontmatter(content, file) {
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    addError(file, "missing frontmatter block");
    return {};
  }

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    addError(file, "frontmatter block is not closed");
    return {};
  }

  const data = {};
  for (const [index, line] of match[1].split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) {
      addError(file, `invalid frontmatter line ${index + 1}`);
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1);
    data[key] = parseScalar(value);
  }

  return data;
}

async function listFiles(dir, extensions) {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath, extensions)));
      continue;
    }

    if (extensions.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function readJson(relativePath, fallback) {
  const fullPath = path.join(root, relativePath);
  if (!existsSync(fullPath)) {
    addError(relativePath, "file is missing");
    return fallback;
  }

  try {
    return JSON.parse(await readFile(fullPath, "utf8"));
  } catch (error) {
    addError(relativePath, `invalid JSON: ${error.message}`);
    return fallback;
  }
}

function requireFields(file, value, rules) {
  if (!isPlainObject(value)) {
    addError(file, "entry must be an object");
    return;
  }

  for (const [field, validator] of Object.entries(rules)) {
    if (!(field in value)) {
      addError(file, `missing required field "${field}"`);
      continue;
    }

    if (!validator(value[field])) {
      addError(file, `invalid field "${field}"`);
    }
  }
}

function validateArrayFile(relativePath, data, rules) {
  if (!Array.isArray(data)) {
    addError(relativePath, "file must contain an array");
    return;
  }

  for (const [index, item] of data.entries()) {
    requireFields(`${relativePath}[${index}]`, item, rules);
  }
}

function validateObjectArray(file, field, value, rules) {
  if (!Array.isArray(value)) {
    addError(file, `invalid field "${field}"`);
    return;
  }

  for (const [index, item] of value.entries()) {
    requireFields(`${file}.${field}[${index}]`, item, rules);
  }
}

async function validatePosts() {
  const postsDir = path.join(root, "src/content/posts");
  if (!existsSync(postsDir)) {
    addError("src/content/posts", "directory is missing; run npm run sync:content first");
    return;
  }

  const files = await listFiles(postsDir, [".md", ".mdx"]);
  if (files.length === 0) {
    addError("src/content/posts", "no Markdown or MDX posts found");
    return;
  }

  for (const filePath of files) {
    const relativePath = path.relative(root, filePath).replaceAll("\\", "/");
    const frontmatter = parseFrontmatter(await readFile(filePath, "utf8"), relativePath);

    requireFields(relativePath, frontmatter, {
      title: isNonEmptyString,
      description: isNonEmptyString,
      published: isNonEmptyString,
      category: isNonEmptyString,
      tags: isStringArray,
      draft: (value) => typeof value === "boolean"
    });

    if ("cover" in frontmatter && !("image" in frontmatter)) {
      continue;
    }
  }
}

async function validateProfileContent() {
  const aboutPath = "src/content/profile/about.md";
  const fullAboutPath = path.join(root, aboutPath);

  if (!existsSync(fullAboutPath)) {
    addError(aboutPath, "file is missing");
  } else {
    const aboutStats = await stat(fullAboutPath);
    if (!aboutStats.isFile() || aboutStats.size === 0) {
      addError(aboutPath, "file must not be empty");
    }
  }

  const resume = await readJson("src/data/content/profile/resume.json", {});
  requireFields("src/data/content/profile/resume.json", resume, {
    name: isNonEmptyString,
    headline: isNonEmptyString,
    skills: isStringArray,
    contacts: Array.isArray
  });

  if (isPlainObject(resume)) {
    validateObjectArray("src/data/content/profile/resume.json", "contacts", resume.contacts, {
      label: isNonEmptyString,
      value: isNonEmptyString
    });
  }
}

async function validateDataContent() {
  validateArrayFile(
    "src/data/content/resources/resources.json",
    await readJson("src/data/content/resources/resources.json", []),
    {
      title: isNonEmptyString,
      url: isNonEmptyString,
      category: isNonEmptyString,
      tags: isStringArray,
      note: isNonEmptyString
    }
  );

  validateArrayFile(
    "src/data/content/links/friends.json",
    await readJson("src/data/content/links/friends.json", []),
    {
      name: isNonEmptyString,
      url: isNonEmptyString,
      avatar: isNonEmptyString,
      description: isNonEmptyString,
      category: isNonEmptyString,
      tags: isStringArray
    }
  );

  validateArrayFile(
    "src/data/content/links/sites.json",
    await readJson("src/data/content/links/sites.json", []),
    {
      name: isNonEmptyString,
      url: isNonEmptyString,
      description: isNonEmptyString,
      category: isNonEmptyString,
      tags: isStringArray
    }
  );

  validateArrayFile(
    "src/data/content/records/timeline.json",
    await readJson("src/data/content/records/timeline.json", []),
    {
      title: isNonEmptyString,
      date: isNonEmptyString,
      description: isNonEmptyString
    }
  );

  validateArrayFile(
    "src/data/content/records/updates.json",
    await readJson("src/data/content/records/updates.json", []),
    {
      title: isNonEmptyString,
      date: isNonEmptyString,
      type: isNonEmptyString
    }
  );
}

async function main() {
  await validatePosts();
  await validateProfileContent();
  await validateDataContent();

  if (errors.length > 0) {
    console.error("Content validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Content validation passed.");
}

main().catch((error) => {
  console.error(`Content validation failed: ${error.message}`);
  process.exit(1);
});
