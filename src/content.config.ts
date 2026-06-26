import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    type: z.enum(["tutorial", "note", "reference"]).default("note"),
    featured: z.boolean().default(false),
    series: z.string().optional()
  })
});

const profile = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/profile" }),
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
});

export const collections = { posts, profile };
