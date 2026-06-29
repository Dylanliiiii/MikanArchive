import assert from "node:assert/strict";
import test from "node:test";
import {
	buildArchiveHeatmaps,
	filterArchivePosts,
	getArchiveActivityLevel,
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

test("既有分类和未分类归档查询继续过滤同一份文章数据", () => {
	const uncategorizedPost = {
		id: "uncategorized",
		data: {
			title: "未分类文章",
			tags: ["随笔"],
			category: null,
			published: new Date("2026-04-08"),
		},
	};
	const compatiblePosts = [...posts, uncategorizedPost];

	assert.deepEqual(
		filterArchivePosts(compatiblePosts, null, "教程").map(
			(post) => post.id,
		),
		["new"],
	);
	assert.deepEqual(
		filterArchivePosts(compatiblePosts, null, null, true).map(
			(post) => post.id,
		),
		["uncategorized"],
	);
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

test("周度文章热力图使用固定阈值，六篇才进入最高色阶", () => {
	assert.equal(getArchiveActivityLevel(0), 0);
	assert.equal(getArchiveActivityLevel(1), 1);
	assert.equal(getArchiveActivityLevel(3), 2);
	assert.equal(getArchiveActivityLevel(5), 3);
	assert.equal(getArchiveActivityLevel(6), 4);

	const weeklyPosts = Array.from({ length: 6 }, (_, index) => ({
		id: `weekly-${index}`,
		data: {
			title: `第 ${index + 1} 篇`,
			tags: ["Astro"],
			category: "教程",
			published: new Date("2026-06-24"),
		},
	}));

	const singlePostHeatmap = buildArchiveHeatmaps([weeklyPosts[0]]);
	const sixPostHeatmap = buildArchiveHeatmaps(weeklyPosts);

	assert.equal(singlePostHeatmap[0].grid[3][5].level, 1);
	assert.equal(sixPostHeatmap[0].grid[3][5].count, 6);
	assert.equal(sixPostHeatmap[0].grid[3][5].level, 4);
});
