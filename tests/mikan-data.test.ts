import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import * as mikanData from "../src/data/mikan";

type ResourceKind = "tool" | "clip";
type Resource = ReturnType<typeof mikanData.getMikanResources>[number];
const require = createRequire(import.meta.url);

function getResourcesByKind(kind: ResourceKind): Resource[] {
	assert.equal(typeof mikanData.getMikanResourcesByKind, "function");
	return mikanData.getMikanResourcesByKind(kind);
}

test("getMikanResourcesByKind('tool') 只返回工具导航", () => {
	const resources = getResourcesByKind("tool");

	assert.ok(resources.length > 0);
	assert.ok(resources.every((item) => item.kind === "tool"));
});

test("公开工具示例提供多分类和可渲染图标", () => {
	const resources = getResourcesByKind("tool");
	const categories = new Set(resources.map((item) => item.category));

	assert.ok(categories.size >= 3, "工具示例应至少覆盖 3 个分类");
	assert.ok(
		resources.every(
			(item) =>
				"icon" in item &&
				typeof item.icon === "string" &&
				item.icon.trim().length > 0,
		),
		"每个公开工具示例都应提供非空 icon",
	);
});

test("工具配置引用的 Iconify 图标均存在于已安装图标集", () => {
	const installedSets = new Map<string, { icons: Record<string, unknown> }>();
	for (const setName of ["simple-icons", "material-symbols"]) {
		const iconFile = require.resolve(`@iconify-json/${setName}/icons.json`);
		installedSets.set(setName, JSON.parse(readFileSync(iconFile, "utf8")));
	}

	for (const item of getResourcesByKind("tool")) {
		if (!item.icon || item.icon.startsWith("http")) continue;
		const separator = item.icon.indexOf(":");
		const setName = item.icon.slice(0, separator);
		const iconName = item.icon.slice(separator + 1);
		const iconSet = installedSets.get(setName);

		assert.ok(iconSet, `${item.icon} 应使用已安装且允许的图标集`);
		assert.ok(iconName in iconSet.icons, `${item.icon} 应存在于已安装图标集`);
	}
});

test("getMikanResourcesByKind('clip') 只返回摘录收藏", () => {
	const resources = getResourcesByKind("clip");

	assert.ok(resources.length > 0);
	assert.ok(resources.every((item) => item.kind === "clip"));
});

test("groupMikanResourcesByCategory 的 count 与条目数量一致", () => {
	assert.equal(typeof mikanData.groupMikanResourcesByCategory, "function");
	const groups = mikanData.groupMikanResourcesByCategory(mikanData.getMikanResources());

	assert.ok(groups.length > 0);
	assert.ok(groups.every((group) => group.count === group.items.length));
	assert.equal(
		groups.reduce((total, group) => total + group.count, 0),
		mikanData.getMikanResources().length,
	);
});

test("getMikanArchiveGroups 能生成年份和月份分组", () => {
	assert.equal(typeof mikanData.getMikanArchiveGroups, "function");
	const groups = mikanData.getMikanArchiveGroups();

	assert.ok(groups.length > 0);
	assert.match(groups[0].year, /^\d{4}$/);
	assert.ok(groups[0].months.length > 0);
	assert.match(groups[0].months[0].month, /^\d{2}$/);
	assert.ok(groups[0].months[0].items.length > 0);
});
