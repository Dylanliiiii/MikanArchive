import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const dataRoot = path.join(process.cwd(), "src/data/content");

function readJson<T>(relativePath: string, fallback: T): T {
	const fullPath = path.join(dataRoot, relativePath);
	if (!existsSync(fullPath)) return fallback;
	return JSON.parse(readFileSync(fullPath, "utf8")) as T;
}

export type MikanFriend = {
	name: string;
	url: string;
	avatar: string;
	description: string;
	category: string;
	tags: string[];
	featured?: boolean;
	status?: string;
};

export type MikanResource = {
	title: string;
	url: string;
	category: string;
	tags: string[];
	note: string;
	featured?: boolean;
	cover?: string;
	source?: string;
	addedAt?: string;
};

export type MikanTimelineItem = {
	title: string;
	date: string;
	description: string;
	type?: string;
};

export type MikanUpdateItem = {
	title: string;
	date: string;
	type: string;
	description?: string;
};

export type MikanResume = {
	name: string;
	headline: string;
	summary?: string;
	skills: string[];
	contacts: Array<{ label: string; value: string; href?: string }>;
	projects?: Array<{ name: string; description: string; url?: string }>;
};

export function getMikanFriends() {
	return readJson<MikanFriend[]>("links/friends.json", []);
}

export function getMikanResources() {
	return readJson<MikanResource[]>("resources/resources.json", []);
}

export function getMikanTimeline() {
	return readJson<MikanTimelineItem[]>("records/timeline.json", []);
}

export function getMikanUpdates() {
	return readJson<MikanUpdateItem[]>("records/updates.json", []);
}

export function getMikanResume() {
	return readJson<MikanResume>("profile/resume.json", {
		name: "MikanArchive",
		headline: "个人知识收藏博客",
		skills: [],
		contacts: [],
	});
}
