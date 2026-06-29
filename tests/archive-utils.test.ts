import assert from "node:assert/strict";
import test from "node:test";
import {
	buildArchiveHeatmaps,
	filterArchivePosts,
	getArchiveActivityDate,
	groupArchivePosts,
	summarizeArchiveTags,
} from "../src/utils/archive-utils";

const posts = [
	{
		id: "new",
		data: {
			title: "新文章",
			tags: ["Astro", "博客"],
			category: "教程",
			published: new Date("2026-06-20"),
			updated: new Date("2026-06-29"),
		},
	},
	{
		id: "old",
		data: {
			title: "旧文章",
			tags: ["Astro"],
			category: "笔记",
			published: new Date("2026-05-03"),
		},
	},
	{
		id: "last-year",
		data: {
			title: "去年文章",
			tags: ["收藏"],
			category: "收藏",
			published: new Date("2025-12-18"),
		},
	},
];

test("标签汇总按数量降序并在同数量时按名称稳定排序", () => {
	assert.deepEqual(summarizeArchiveTags(posts), [
		{ name: "Astro", count: 2 },
		{ name: "博客", count: 1 },
		{ name: "收藏", count: 1 },
	]);
});

test("单标签筛选保持发布时间倒序且未知标签为空", () => {
	assert.deepEqual(
		filterArchivePosts(posts, "Astro").map((post) => post.id),
		["new", "old"],
	);
	assert.deepEqual(filterArchivePosts(posts, "missing"), []);
});

test("年月分组提供总数、年份数和月份数", () => {
	const result = groupArchivePosts(posts);

	assert.equal(result.postCount, 3);
	assert.equal(result.yearCount, 2);
	assert.equal(result.years[0].year, 2026);
	assert.equal(result.years[0].totalCount, 2);
	assert.deepEqual(
		result.years[0].months.map((month) => [month.month, month.count]),
		[
			[6, 1],
			[5, 1],
		],
	);
});

test("热力图优先使用更新日期并回退发布时间", () => {
	assert.equal(
		getArchiveActivityDate(posts[0]).toISOString().slice(0, 10),
		"2026-06-29",
	);
	assert.equal(
		getArchiveActivityDate(posts[1]).toISOString().slice(0, 10),
		"2026-05-03",
	);

	const heatmaps = buildArchiveHeatmaps(posts);
	assert.deepEqual(
		heatmaps.map((item) => item.year),
		[2026, 2025],
	);
	assert.equal(heatmaps[0].grid[3][5].count, 1);
	assert.equal(heatmaps[0].grid[0][4].count, 1);
});
