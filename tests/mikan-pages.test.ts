import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function readSource(relativePath: string) {
	const fullPath = path.join(root, relativePath);
	assert.ok(existsSync(fullPath), `${relativePath} 应存在`);
	return readFileSync(fullPath, "utf8");
}

test("收藏总览提供工具导航和摘录收藏入口", () => {
	const source = readSource("src/pages/resources/index.astro");

	assert.match(source, /工具导航/);
	assert.match(source, /摘录收藏/);
	assert.match(source, /resources\/tools/);
	assert.match(source, /resources\/clips/);
});

test("工具导航页按 kind 和分类读取资源", () => {
	const source = readSource("src/pages/resources/tools.astro");

	assert.match(source, /getMikanResourcesByKind\("tool"\)/);
	assert.match(source, /groupMikanResourcesByCategory/);
});

test("摘录收藏页展示来源与适用场景", () => {
	const source = readSource("src/pages/resources/clips/index.astro");

	assert.match(source, /getMikanResourcesByKind\("clip"\)/);
	assert.match(source, /sourceName/);
	assert.match(source, /scenario/);
});

test("收藏导航保留主入口并提供两个子入口", () => {
	const source = readSource("src/config/navBarConfig.ts");

	assert.match(source, /收藏总览/);
	assert.match(source, /\/resources\/tools\//);
	assert.match(source, /\/resources\/clips\//);
});

test("足迹页使用三层归档分支结构", () => {
	const source = readSource("src/pages/records/index.astro");

	assert.match(source, /getMikanArchiveGroups\(\)/);
	assert.match(source, /archive-trunk/);
	assert.match(source, /archive-month-branch/);
	assert.match(source, /archive-record-branch/);
});
