import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { z } from "zod";

const dataRoot = path.join(process.cwd(), "src", "data", "content");

export const resourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  category: z.string(),
  tags: z.array(z.string()),
  note: z.string(),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
  source: z.string().optional(),
  addedAt: z.string().optional()
});

export const friendSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  avatar: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  status: z.enum(["active", "featured", "unavailable"]).default("active"),
  lastCheckedAt: z.string().optional(),
  addedAt: z.string().optional()
});

export const siteLinkSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string())
});

export const timelineItemSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string().optional()
});

export const updateItemSchema = z.object({
  date: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string()
});

export const resumeSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  headline: z.string(),
  location: z.string().optional(),
  bio: z.string().optional(),
  summary: z.string().optional(),
  links: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url()
      })
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        url: z.string().url().optional()
      })
    )
    .default([]),
  contacts: z
    .array(
      z.object({
        label: z.string(),
        value: z.string()
      })
    )
    .default([])
});

async function readJson<T extends z.ZodTypeAny>(relativePath: string, schema: T): Promise<z.infer<T>> {
  const filePath = path.join(dataRoot, relativePath);
  return readJsonFile(filePath, `src/data/content/${relativePath}`, schema);
}

async function readJsonFile<T extends z.ZodTypeAny>(filePath: string, displayPath: string, schema: T): Promise<z.infer<T>> {

  try {
    const raw = await readFile(filePath, "utf-8");
    return schema.parse(JSON.parse(raw));
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`内容数据格式不正确：${displayPath}\n${error.message}`);
    }

    if (error instanceof SyntaxError) {
      throw new Error(`内容 JSON 解析失败：${displayPath}\n${error.message}`);
    }

    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`未找到内容数据：${displayPath}。请先运行内容同步脚本，例如 npm run sync:content。`);
    }

    throw error;
  }
}

async function readResume(): Promise<z.infer<typeof resumeSchema>> {
  return readJson("profile/resume.json", resumeSchema);
}

export async function getResources() {
  return readJson("resources/resources.json", z.array(resourceSchema));
}

export async function getFriends() {
  return readJson("links/friends.json", z.array(friendSchema));
}

export async function getSites() {
  return readJson("links/sites.json", z.array(siteLinkSchema));
}

export async function getTimeline() {
  return readJson("records/timeline.json", z.array(timelineItemSchema));
}

export async function getUpdates() {
  return readJson("records/updates.json", z.array(updateItemSchema));
}

export async function getResume() {
  return readResume();
}
