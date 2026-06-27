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
	kind: "tool" | "clip";
	category: string;
	tags: string[];
	note: string;
	featured?: boolean;
	cover?: string;
	source?: string;
	sourceName?: string;
	scenario?: string;
	addedAt?: string;
};

export type MikanTimelineItem = {
	title: string;
	date: string;
	description: string;
	type?: string;
	category?: string;
};

export type MikanResourceGroup = {
	category: string;
	count: number;
	items: MikanResource[];
};

export type MikanArchiveMonth = {
	month: string;
	label: string;
	count: number;
	items: MikanTimelineItem[];
};

export type MikanArchiveGroup = {
	year: string;
	count: number;
	months: MikanArchiveMonth[];
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

export function getMikanResourcesByKind(kind: MikanResource["kind"]) {
	return getMikanResources().filter((resource) => resource.kind === kind);
}

export function groupMikanResourcesByCategory(resources: MikanResource[]) {
	const groups = new Map<string, MikanResource[]>();

	for (const resource of resources) {
		const items = groups.get(resource.category) ?? [];
		items.push(resource);
		groups.set(resource.category, items);
	}

	return [...groups.entries()]
		.sort(([left], [right]) => left.localeCompare(right, "zh-CN"))
		.map(([category, items]): MikanResourceGroup => ({
			category,
			count: items.length,
			items,
		}));
}

export function getMikanTimeline() {
	return readJson<MikanTimelineItem[]>("records/timeline.json", []);
}

export function getMikanArchiveGroups() {
	const years = new Map<string, Map<string, MikanTimelineItem[]>>();
	const timeline = [...getMikanTimeline()].sort((left, right) => right.date.localeCompare(left.date));

	for (const item of timeline) {
		const match = /^(\d{4})-(\d{2})/.exec(item.date);
		if (!match) continue;

		const [, year, month] = match;
		const months = years.get(year) ?? new Map<string, MikanTimelineItem[]>();
		const items = months.get(month) ?? [];
		items.push(item);
		months.set(month, items);
		years.set(year, months);
	}

	return [...years.entries()]
		.sort(([left], [right]) => right.localeCompare(left))
		.map(([year, months]): MikanArchiveGroup => {
			const monthGroups = [...months.entries()]
				.sort(([left], [right]) => right.localeCompare(left))
				.map(([month, items]): MikanArchiveMonth => ({
					month,
					label: `${Number(month)} 月`,
					count: items.length,
					items,
				}));

			return {
				year,
				count: monthGroups.reduce((total, month) => total + month.count, 0),
				months: monthGroups,
			};
		});
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
