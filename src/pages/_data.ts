import type { CollectionEntry } from "astro:content";
import {
  getFriends,
  getResources,
  getResume,
  getSites,
  getTimeline,
  getUpdates
} from "@/data/loaders";
import { withBase } from "@/utils/paths";

export type PostEntry = CollectionEntry<"posts">;

export function postHref(post: PostEntry) {
  return withBase(`/posts/${post.id}/`);
}

export function formatDate(value?: string | Date) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function sortPosts(posts: PostEntry[]) {
  return posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.published).getTime() - new Date(a.data.published).getTime()
    );
}

export function readingTimeFromContent(content = "") {
  const words = content.trim().replace(/\s+/g, "").length;
  return `约 ${Math.max(1, Math.ceil(words / 420))} 分钟`;
}

export { getFriends, getResources, getResume, getSites, getTimeline, getUpdates };
