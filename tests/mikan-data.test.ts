import assert from "node:assert/strict";
import test from "node:test";
import * as mikanData from "../src/data/mikan";

type ResourceKind = "tool" | "clip";
type Resource = ReturnType<typeof mikanData.getMikanResources>[number];

function getResourcesByKind(kind: ResourceKind): Resource[] {
	assert.equal(typeof mikanData.getMikanResourcesByKind, "function");
	return mikanData.getMikanResourcesByKind(kind);
}

test("getMikanResourcesByKind('tool') 只返回工具导航", () => {
	const resources = getResourcesByKind("tool");

	assert.ok(resources.length > 0);
	assert.ok(resources.every((item) => item.kind === "tool"));
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
