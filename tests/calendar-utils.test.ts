import assert from "node:assert/strict";
import test from "node:test";
import type { MikanCalendarEvent } from "../src/data/mikan";
import {
	bucketCalendarEvents,
	buildCalendarEventInstances,
	buildPostCalendarEvents,
	formatCalendarDate,
	getCalendarRange,
	getDayTimelineEvents,
	getLunarDayLabel,
	getMonthCells,
	getWeekTimelineDays,
} from "../src/utils/calendar-utils";

const sampleEvents: MikanCalendarEvent[] = [
	{
		id: "study",
		title: "学习时段",
		kind: "schedule",
		start: "2026-06-29T19:30",
		end: "2026-06-29T21:00",
		visibility: "public",
		color: "blue",
	},
	{
		id: "weekly",
		title: "每周复盘",
		kind: "schedule",
		start: "2026-06-30T20:00",
		end: "2026-06-30T21:00",
		recurring: { freq: "weekly", weekday: 2 },
		visibility: "public",
		color: "yellow",
	},
	{
		id: "anniversary",
		title: "建站纪念日",
		kind: "anniversary",
		date: "2026-06-26",
		allDay: true,
		recurring: { freq: "yearly", month: 6, day: 26 },
		visibility: "public",
		color: "mint",
	},
];

test("formatCalendarDate 输出 YYYY-MM-DD", () => {
	assert.equal(formatCalendarDate(new Date(2026, 5, 9)), "2026-06-09");
});

test("getLunarDayLabel 输出农历日标签", () => {
	assert.ok(getLunarDayLabel("2026-06-29").length > 0);
});

test("buildCalendarEventInstances 展开一次性和重复事件", () => {
	const instances = buildCalendarEventInstances(sampleEvents, 2026, 2026);

	assert.ok(instances.some((event) => event.id === "study@2026-06-29"));
	assert.ok(instances.some((event) => event.id === "weekly@2026-06-30"));
	assert.ok(instances.some((event) => event.id === "weekly@2026-07-07"));
	assert.ok(instances.some((event) => event.id === "anniversary@2026-06-26"));
	assert.ok(instances.every((event) => event.visibility === "public"));
});

test("bucketCalendarEvents 按日期聚合并按类型排序", () => {
	const bucket = bucketCalendarEvents(buildCalendarEventInstances(sampleEvents, 2026, 2026));

	assert.ok(bucket["2026-06-29"].some((event) => event.title === "学习时段"));
	assert.ok(bucket["2026-06-26"].some((event) => event.kind === "anniversary"));
});

test("getMonthCells 生成固定 42 格月历", () => {
	const bucket = bucketCalendarEvents(buildCalendarEventInstances(sampleEvents, 2026, 2026));
	const cells = getMonthCells(2026, 5, bucket);

	assert.equal(cells.length, 42);
	assert.equal(cells[0].dateKey, "2026-05-31");
	assert.ok(cells.some((cell) => cell.dateKey === "2026-06-29" && cell.events.length > 0));
});

test("getWeekTimelineDays 从周一开始生成 7 天", () => {
	const days = getWeekTimelineDays("2026-06-29");

	assert.equal(days.length, 7);
	assert.equal(days[0].dateKey, "2026-06-29");
	assert.equal(days[6].dateKey, "2026-07-05");
});

test("getDayTimelineEvents 只返回定时事件并计算位置", () => {
	const instances = buildCalendarEventInstances(sampleEvents, 2026, 2026);
	const timeline = getDayTimelineEvents(instances, "2026-06-29");

	assert.equal(timeline.length, 1);
	assert.equal(timeline[0].topPercent, (19.5 / 24) * 100);
	assert.equal(timeline[0].heightPercent, (1.5 / 24) * 100);
});

test("buildPostCalendarEvents 将文章元数据转换为公开文章事件", () => {
	const events = buildPostCalendarEvents([
		{ id: "hello", title: "欢迎文章", published: new Date("2026-06-26T08:00:00.000Z") },
	]);

	assert.equal(events[0].kind, "post");
	assert.equal(events[0].visibility, "public");
	assert.equal(events[0].url, "/posts/hello/");
});

test("getCalendarRange 覆盖当前年和相邻一年", () => {
	assert.deepEqual(getCalendarRange(2026), { startYear: 2025, endYear: 2027 });
});
