# Mikan Public Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public `/calendar/` page for MikanArchive with content-file-managed events, year/month/week/day views, public holidays, lunar labels, and no front-end event creation.

**Architecture:** Calendar data is copied from `content.example/calendar/events.json` or a private content repository into `src/data/content/calendar/events.json`, validated by the existing content validation script, then read through `src/data/mikan.ts`. Pure utilities in `src/utils/calendar-utils.ts` generate lunar labels, normalize events, expand recurring rules, merge post events, bucket events by date, and feed an Astro page with a client-side view switcher script. The page uses `ContentGridLayout` and `resources.css` to match existing focused pages while adding calendar-specific grid and timeline styles.

**Tech Stack:** Astro 7, TypeScript, Astro Icon / Iconify, Node.js `node:test`, existing content sync and validation scripts, browser visual verification through Playwright/Chrome.

---

## File Structure

- Modify `scripts/sync-content.mjs`: add `calendar` to generated content targets and sync mappings.
- Modify `scripts/validate-content.mjs`: validate `src/data/content/calendar/events.json`.
- Create `content.example/calendar/events.json`: public example events only.
- Modify `src/data/mikan.ts`: add calendar event types and `getMikanCalendarEvents()`.
- Create `src/utils/calendar-utils.ts`: date formatting, lunar labels, event normalization, recurrence expansion, post event building, date bucketing, year/month/week/day helpers.
- Modify `tests/mikan-data.test.ts`: TDD coverage for calendar data loading and utility behavior.
- Modify `tests/mikan-pages.test.ts`: TDD coverage for `/calendar/`, navigation, breadcrumb, scripts, and no front-end creation UI.
- Modify `src/config/navBarConfig.ts`: add `Calendar` preset and include it in the “我的” dropdown.
- Modify `src/utils/focused-breadcrumb.ts`: add `/calendar/`.
- Create `src/pages/calendar.astro`: focused calendar page.
- Modify `src/styles/resources.css`: add public calendar layout, view switcher, month grid, year grid, week/day timelines, event cards, and responsive rules.
- Modify `README.md`, `docs/content-repository.md`, `docs/next-tasks.md`, `CHANGELOG.md`, `development-log.md`: document the new data path, route, validation, and remaining handoff.

---

### Task 1: Content Sync And Validation

**Files:**
- Modify: `scripts/sync-content.mjs`
- Modify: `scripts/validate-content.mjs`
- Create: `content.example/calendar/events.json`
- Test: `tests/mikan-data.test.ts`

- [ ] **Step 1: Write failing data tests**

Add these tests to `tests/mikan-data.test.ts` after the existing archive group test:

```ts
test("公开日历示例数据可读取且只包含公开事件", () => {
	assert.equal(typeof mikanData.getMikanCalendarEvents, "function");
	const events = mikanData.getMikanCalendarEvents();

	assert.ok(events.length >= 6, "公开日历示例应提供足够事件验证视图");
	assert.ok(events.every((event) => event.visibility === "public"));
	assert.ok(events.some((event) => event.kind === "holiday" && event.recurring?.freq === "yearly"));
	assert.ok(events.some((event) => event.kind === "schedule" && event.start && event.end));
	assert.ok(events.some((event) => event.kind === "anniversary" && event.recurring?.freq === "yearly"));
	assert.ok(events.every((event) => !/身份证|住址|手机号|token|cookie/i.test(JSON.stringify(event))));
});

test("公开日历事件 id 唯一且时间范围有效", () => {
	const events = mikanData.getMikanCalendarEvents();
	const ids = new Set(events.map((event) => event.id));

	assert.equal(ids.size, events.length, "公开日历事件 id 不应重复");
	for (const event of events) {
		if (event.start && event.end) {
			assert.ok(event.end > event.start, `${event.id} 的结束时间应晚于开始时间`);
		}
	}
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm.cmd run test:content-model
```

Expected: FAIL because `getMikanCalendarEvents` is not defined.

- [ ] **Step 3: Add public example calendar events**

Create `content.example/calendar/events.json` with exactly:

```json
[
  {
    "id": "example-national-day",
    "title": "国庆节",
    "kind": "holiday",
    "date": "2026-10-01",
    "allDay": true,
    "note": "公开节日示例，用于展示年度重复节日。",
    "color": "pink",
    "icon": "material-symbols:festival-rounded",
    "recurring": {
      "freq": "yearly",
      "month": 10,
      "day": 1
    },
    "visibility": "public"
  },
  {
    "id": "example-site-anniversary",
    "title": "MikanArchive 建站纪念日",
    "kind": "anniversary",
    "date": "2026-06-26",
    "allDay": true,
    "note": "公开示例纪念日，用于展示年度重复事件。",
    "color": "mint",
    "icon": "material-symbols:celebration",
    "recurring": {
      "freq": "yearly",
      "month": 6,
      "day": 26
    },
    "visibility": "public"
  },
  {
    "id": "example-study-block",
    "title": "公开学习时段",
    "kind": "schedule",
    "start": "2026-06-29T19:30",
    "end": "2026-06-29T21:00",
    "note": "示例日程：用于验证周视图和日视图时间轴。",
    "color": "blue",
    "icon": "material-symbols:school",
    "visibility": "public"
  },
  {
    "id": "example-weekly-review",
    "title": "每周公开复盘",
    "kind": "schedule",
    "start": "2026-06-30T20:00",
    "end": "2026-06-30T21:00",
    "note": "示例重复日程，展示 weekly recurrence。",
    "color": "yellow",
    "icon": "material-symbols:edit-calendar",
    "recurring": {
      "freq": "weekly",
      "weekday": 2
    },
    "visibility": "public"
  },
  {
    "id": "example-project-maintenance",
    "title": "站点维护窗口",
    "kind": "site",
    "start": "2026-07-03T09:00",
    "end": "2026-07-03T10:30",
    "note": "公开示例维护安排，不代表真实服务中断。",
    "color": "pink",
    "icon": "material-symbols:build",
    "visibility": "public"
  },
  {
    "id": "example-monthly-summary",
    "title": "月度资料整理",
    "kind": "schedule",
    "date": "2026-07-01",
    "allDay": true,
    "note": "示例全天日程，展示月视图事件胶囊。",
    "color": "neutral",
    "icon": "material-symbols:inventory",
    "recurring": {
      "freq": "monthly",
      "day": 1
    },
    "visibility": "public"
  }
]
```

- [ ] **Step 4: Sync calendar content**

Modify `scripts/sync-content.mjs`:

```js
const contentTargets = [
  "src/content/posts",
  "src/content/profile",
  "src/content/spec",
  "src/data/content",
  "public/assets"
];
```

stays as-is because `src/data/content` is reset wholesale.

In `mappings`, add after `records`:

```js
  { source: "calendar", target: "src/data/content/calendar", kind: "directory" },
```

In `hasSupportedContent`, change the array to:

```js
  return ["posts", "resources", "links", "profile", "records", "calendar", "assets"].some((name) =>
    existsSync(path.join(sourceRoot, name))
  );
```

- [ ] **Step 5: Add calendar validation**

In `scripts/validate-content.mjs`, add helper validators near `isResourceKind`:

```js
function isCalendarEventKind(value) {
  return ["holiday", "anniversary", "schedule", "site", "post"].includes(value);
}

function isCalendarColor(value) {
  return ["pink", "blue", "mint", "yellow", "neutral"].includes(value);
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isIsoDateTime(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
}

function isCalendarVisibility(value) {
  return value === "public";
}
```

Add this function before `validateDataContent`:

```js
function validateCalendarEvents(relativePath, data) {
  if (!Array.isArray(data)) {
    addError(relativePath, "file must contain an array");
    return;
  }

  const ids = new Set();
  for (const [index, event] of data.entries()) {
    const file = `${relativePath}[${index}]`;
    requireFields(file, event, {
      id: isNonEmptyString,
      title: isNonEmptyString,
      kind: isCalendarEventKind,
      visibility: isCalendarVisibility
    });

    if (!isPlainObject(event)) continue;

    if (ids.has(event.id)) {
      addError(file, `duplicate id "${event.id}"`);
    }
    ids.add(event.id);

    const hasDate = "date" in event;
    const hasStart = "start" in event;
    const hasEnd = "end" in event;
    if (!hasDate && !hasStart) {
      addError(file, 'missing "date" or "start"');
    }
    if (hasDate && !isIsoDate(event.date)) {
      addError(file, 'invalid optional field "date"');
    }
    if (hasStart && !isIsoDateTime(event.start)) {
      addError(file, 'invalid optional field "start"');
    }
    if (hasEnd && !isIsoDateTime(event.end)) {
      addError(file, 'invalid optional field "end"');
    }
    if (hasStart && hasEnd && event.end <= event.start) {
      addError(file, '"end" must be later than "start"');
    }
    if ("allDay" in event && typeof event.allDay !== "boolean") {
      addError(file, 'invalid optional field "allDay"');
    }
    if ("note" in event && !isNonEmptyString(event.note)) {
      addError(file, 'invalid optional field "note"');
    }
    if ("color" in event && !isCalendarColor(event.color)) {
      addError(file, 'invalid optional field "color"');
    }
    if ("icon" in event && !isNonEmptyString(event.icon)) {
      addError(file, 'invalid optional field "icon"');
    }
    if ("url" in event && !isNonEmptyString(event.url)) {
      addError(file, 'invalid optional field "url"');
    }
    if ("recurring" in event) {
      const recurring = event.recurring;
      if (!isPlainObject(recurring)) {
        addError(file, 'invalid optional field "recurring"');
      } else if (!["weekly", "monthly", "yearly"].includes(recurring.freq)) {
        addError(file, 'invalid recurring field "freq"');
      } else {
        if (recurring.freq === "weekly" && ![0, 1, 2, 3, 4, 5, 6].includes(recurring.weekday)) {
          addError(file, 'weekly recurring requires "weekday" 0-6');
        }
        if (recurring.freq === "monthly" && (!Number.isInteger(recurring.day) || recurring.day < 1 || recurring.day > 31)) {
          addError(file, 'monthly recurring requires "day" 1-31');
        }
        if (recurring.freq === "yearly") {
          if (!Number.isInteger(recurring.month) || recurring.month < 1 || recurring.month > 12) {
            addError(file, 'yearly recurring requires "month" 1-12');
          }
          if (!Number.isInteger(recurring.day) || recurring.day < 1 || recurring.day > 31) {
            addError(file, 'yearly recurring requires "day" 1-31');
          }
          if ("lunar" in recurring && typeof recurring.lunar !== "boolean") {
            addError(file, 'invalid recurring field "lunar"');
          }
        }
      }
    }
  }
}
```

In `validateDataContent`, after records validation, add:

```js
  validateCalendarEvents(
    "src/data/content/calendar/events.json",
    await readJson("src/data/content/calendar/events.json", [])
  );
```

- [ ] **Step 6: Add data reader type**

In `src/data/mikan.ts`, add types after `MikanUpdateItem`:

```ts
export type MikanCalendarEventKind = "holiday" | "anniversary" | "schedule" | "site" | "post";
export type MikanCalendarEventColor = "pink" | "blue" | "mint" | "yellow" | "neutral";

export type MikanCalendarEvent = {
	id: string;
	title: string;
	kind: MikanCalendarEventKind;
	date?: string;
	start?: string;
	end?: string;
	allDay?: boolean;
	note?: string;
	color?: MikanCalendarEventColor;
	icon?: string;
	url?: string;
	recurring?: {
		freq: "weekly" | "monthly" | "yearly";
		weekday?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		month?: number;
		day?: number;
		lunar?: boolean;
	};
	visibility: "public";
};
```

Add export function near other getters:

```ts
export function getMikanCalendarEvents() {
	return readJson<MikanCalendarEvent[]>("calendar/events.json", []);
}
```

- [ ] **Step 7: Run sync, validation, and tests**

Run:

```powershell
npm.cmd run sync:content
npm.cmd run validate:content
npm.cmd run test:content-model
```

Expected: sync copies `calendar -> src/data/content/calendar`, validation passes, content-model tests pass.

- [ ] **Step 8: Commit**

Run:

```powershell
git add scripts/sync-content.mjs scripts/validate-content.mjs content.example/calendar/events.json src/data/mikan.ts tests/mikan-data.test.ts
git commit -m "feat: add public calendar content model"
```

---

### Task 2: Calendar Utilities

**Files:**
- Create: `src/utils/calendar-utils.ts`
- Test: `tests/calendar-utils.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Add calendar utility tests**

Create `tests/calendar-utils.test.ts`:

```ts
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
```

- [ ] **Step 2: Add script and verify red**

In `package.json` scripts, add:

```json
"test:calendar": "tsx tests/calendar-utils.test.ts",
```

Install the lunar calendar dependency before implementing the utility:

```powershell
npm.cmd install lunar-typescript --save --registry=https://registry.npmjs.org
```

Run:

```powershell
npm.cmd run test:calendar
```

Expected: FAIL because `src/utils/calendar-utils.ts` does not exist.

- [ ] **Step 3: Implement utilities**

Create `src/utils/calendar-utils.ts`:

```ts
import { Solar } from "lunar-typescript";
import type { MikanCalendarEvent, MikanCalendarEventKind } from "@/data/mikan";

export type CalendarEventInstance = MikanCalendarEvent & {
	id: string;
	sourceId: string;
	dateKey: string;
	startDate?: Date;
	endDate?: Date;
};

export type CalendarEventBucket = Record<string, CalendarEventInstance[]>;

export type CalendarMonthCell = {
	dateKey: string;
	day: number;
	isCurrentMonth: boolean;
	events: CalendarEventInstance[];
};

export type CalendarTimelineEvent = CalendarEventInstance & {
	topPercent: number;
	heightPercent: number;
};

export type CalendarPostMeta = {
	id: string;
	title: string;
	published: Date;
};

const eventOrder: Record<MikanCalendarEventKind, number> = {
	holiday: 0,
	anniversary: 1,
	schedule: 2,
	site: 3,
	post: 4,
};

export function formatCalendarDate(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate(),
	).padStart(2, "0")}`;
}

export function getLunarDayLabel(dateKey: string) {
	const [year, month, day] = dateKey.split("-").map(Number);
	return Solar.fromYmd(year, month, day).getLunar().getDayInChinese();
}

function parseLocalDate(dateKey: string) {
	const [year, month, day] = dateKey.split("-").map(Number);
	return new Date(year, month - 1, day);
}

function parseLocalDateTime(value: string) {
	const [date, time] = value.split("T");
	const [year, month, day] = date.split("-").map(Number);
	const [hour, minute] = time.split(":").map(Number);
	return new Date(year, month - 1, day, hour, minute);
}

function addDays(date: Date, days: number) {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}

function instanceFromEvent(event: MikanCalendarEvent, dateKey: string, suffix = dateKey): CalendarEventInstance {
	const startDate = event.start ? parseLocalDateTime(event.start.replace(/^\d{4}-\d{2}-\d{2}/, dateKey)) : undefined;
	const endDate = event.end ? parseLocalDateTime(event.end.replace(/^\d{4}-\d{2}-\d{2}/, dateKey)) : undefined;

	return {
		...event,
		id: `${event.id}@${suffix}`,
		sourceId: event.id,
		dateKey,
		startDate,
		endDate,
	};
}

function pushIfInRange(out: CalendarEventInstance[], event: MikanCalendarEvent, date: Date, startYear: number, endYear: number) {
	const year = date.getFullYear();
	if (year < startYear || year > endYear) return;
	out.push(instanceFromEvent(event, formatCalendarDate(date)));
}

export function buildCalendarEventInstances(events: MikanCalendarEvent[], startYear: number, endYear: number) {
	const out: CalendarEventInstance[] = [];

	for (const event of events) {
		if (event.visibility !== "public") continue;
		if (!event.recurring) {
			const dateKey = event.date || event.start?.slice(0, 10);
			if (!dateKey) continue;
			const date = parseLocalDate(dateKey);
			pushIfInRange(out, event, date, startYear, endYear);
			continue;
		}

		for (let year = startYear; year <= endYear; year++) {
			if (event.recurring.freq === "yearly") {
				if (!event.recurring.month || !event.recurring.day) continue;
				pushIfInRange(out, event, new Date(year, event.recurring.month - 1, event.recurring.day), startYear, endYear);
			}

			if (event.recurring.freq === "monthly") {
				if (!event.recurring.day) continue;
				for (let month = 0; month < 12; month++) {
					const date = new Date(year, month, event.recurring.day);
					if (date.getMonth() !== month) continue;
					pushIfInRange(out, event, date, startYear, endYear);
				}
			}

			if (event.recurring.freq === "weekly") {
				if (event.recurring.weekday == null) continue;
				const first = new Date(year, 0, 1);
				const offset = (event.recurring.weekday - first.getDay() + 7) % 7;
				for (let current = new Date(year, 0, 1 + offset); current.getFullYear() === year; current = addDays(current, 7)) {
					pushIfInRange(out, event, current, startYear, endYear);
				}
			}
		}
	}

	return out.sort((left, right) => left.dateKey.localeCompare(right.dateKey) || eventOrder[left.kind] - eventOrder[right.kind]);
}

export function bucketCalendarEvents(events: CalendarEventInstance[]): CalendarEventBucket {
	const bucket: CalendarEventBucket = {};
	for (const event of events) {
		const items = bucket[event.dateKey] ?? [];
		items.push(event);
		bucket[event.dateKey] = items;
	}
	for (const dateKey of Object.keys(bucket)) {
		bucket[dateKey].sort((left, right) => eventOrder[left.kind] - eventOrder[right.kind] || left.title.localeCompare(right.title, "zh-CN"));
	}
	return bucket;
}

export function getMonthCells(year: number, monthIndex: number, bucket: CalendarEventBucket): CalendarMonthCell[] {
	const first = new Date(year, monthIndex, 1);
	const firstWeekday = first.getDay();
	const start = addDays(first, -firstWeekday);
	return Array.from({ length: 42 }, (_, index) => {
		const date = addDays(start, index);
		const dateKey = formatCalendarDate(date);
		return {
			dateKey,
			day: date.getDate(),
			isCurrentMonth: date.getMonth() === monthIndex,
			events: bucket[dateKey] ?? [],
		};
	});
}

export function getWeekTimelineDays(dateKey: string) {
	const date = parseLocalDate(dateKey);
	const mondayOffset = (date.getDay() + 6) % 7;
	const monday = addDays(date, -mondayOffset);
	return Array.from({ length: 7 }, (_, index) => {
		const day = addDays(monday, index);
		return {
			dateKey: formatCalendarDate(day),
			label: `${day.getMonth() + 1}/${day.getDate()}`,
			weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][day.getDay()],
		};
	});
}

export function getDayTimelineEvents(events: CalendarEventInstance[], dateKey: string): CalendarTimelineEvent[] {
	return events
		.filter((event) => event.dateKey === dateKey && event.startDate && event.endDate && !event.allDay)
		.map((event) => {
			const startMinutes = event.startDate!.getHours() * 60 + event.startDate!.getMinutes();
			const endMinutes = event.endDate!.getHours() * 60 + event.endDate!.getMinutes();
			return {
				...event,
				topPercent: (startMinutes / 1440) * 100,
				heightPercent: (Math.max(30, endMinutes - startMinutes) / 1440) * 100,
			};
		});
}

export function buildPostCalendarEvents(posts: CalendarPostMeta[]): MikanCalendarEvent[] {
	return posts.map((post) => ({
		id: `post-${post.id}`,
		title: post.title,
		kind: "post",
		date: formatCalendarDate(post.published),
		allDay: true,
		color: "neutral",
		icon: "material-symbols:article",
		url: `/posts/${post.id}/`,
		visibility: "public",
	}));
}

export function getCalendarRange(currentYear: number) {
	return {
		startYear: currentYear - 1,
		endYear: currentYear + 1,
	};
}
```

- [ ] **Step 4: Run utility tests**

Run:

```powershell
npm.cmd run test:calendar
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add package.json tests/calendar-utils.test.ts src/utils/calendar-utils.ts
git commit -m "feat: add public calendar utilities"
```

---

### Task 3: Navigation And Page Contracts

**Files:**
- Modify: `tests/mikan-pages.test.ts`
- Modify: `src/config/navBarConfig.ts`
- Modify: `src/utils/focused-breadcrumb.ts`
- Create: `src/pages/calendar.astro`

- [ ] **Step 1: Write failing page tests**

In `tests/mikan-pages.test.ts`, add `"src/pages/calendar.astro"` to the `focusedPages` array.

Add tests near the “我的下拉” test:

```ts
test("我的下拉包含日历入口，公开日历页面使用聚焦布局", () => {
	const navSource = readSource("src/config/navBarConfig.ts");
	const pageSource = readSource("src/pages/calendar.astro");
	const breadcrumbSource = readSource("src/utils/focused-breadcrumb.ts");

	assert.match(navSource, /LinkPresets\.Calendar/);
	assert.match(navSource, /Calendar:\s*\{[\s\S]*name:\s*"日历"/);
	assert.match(navSource, /url:\s*"\/calendar\/"/);
	assert.match(pageSource, /import ContentGridLayout/);
	assert.match(pageSource, /<ContentGridLayout title=\{title\}/);
	assert.match(pageSource, /MIKAN CALENDAR/);
	assert.match(pageSource, /data-calendar-view/);
	assert.match(pageSource, /data-calendar-view-button="year"/);
	assert.match(pageSource, /data-calendar-view-button="month"/);
	assert.match(pageSource, /data-calendar-view-button="week"/);
	assert.match(pageSource, /data-calendar-view-button="day"/);
	assert.match(breadcrumbSource, /\/calendar\/[\s\S]*label:\s*"日历"/);
});

test("公开日历页面不提供前台创建或后台编辑入口", () => {
	const pageSource = readSource("src/pages/calendar.astro");

	assert.doesNotMatch(pageSource, /新建日程|创建日程|编辑日程|删除日程/);
	assert.doesNotMatch(pageSource, /<form/);
	assert.doesNotMatch(pageSource, /contenteditable/);
	assert.doesNotMatch(pageSource, /fetch\(["'`]\/api\/calendar/);
});
```

- [ ] **Step 2: Run page tests to verify red**

Run:

```powershell
npm.cmd run test:pages
```

Expected: FAIL because `src/pages/calendar.astro` and `LinkPresets.Calendar` do not exist.

- [ ] **Step 3: Update navigation config**

In `src/config/navBarConfig.ts`, add `LinkPresets.Calendar` to the “我的” children after `SiteOverview`:

```ts
children: [
	LinkPresets.About,
	LinkPresets.SiteOverview,
	LinkPresets.Calendar,
],
```

Add preset:

```ts
Calendar: {
	name: "日历",
	url: "/calendar/",
	icon: "material-symbols:calendar-month-rounded",
},
```

- [ ] **Step 4: Update breadcrumb**

In `src/utils/focused-breadcrumb.ts`, add:

```ts
	"/calendar/": {
		label: "日历",
		icon: "material-symbols:calendar-month-rounded",
	},
```

- [ ] **Step 5: Create minimal calendar page**

Create `src/pages/calendar.astro`:

```astro
---
import { Icon } from "astro-icon/components";
import { getSortedPosts } from "@/utils/content-utils";
import { getMikanCalendarEvents } from "@/data/mikan";
import {
	bucketCalendarEvents,
	buildCalendarEventInstances,
	buildPostCalendarEvents,
	getCalendarRange,
	getMonthCells,
	getWeekTimelineDays,
	getDayTimelineEvents,
} from "@/utils/calendar-utils";
import ContentGridLayout from "@/layouts/ContentGridLayout.astro";
import "@/styles/resources.css";

const title = "日历";
const description = "公开节日、纪念日、学习安排和文章发布日。";
const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const { startYear, endYear } = getCalendarRange(today.getFullYear());
const posts = await getSortedPosts();
const postEvents = buildPostCalendarEvents(posts.map((post) => ({
	id: post.id,
	title: post.data.title,
	published: post.data.published,
})));
const baseEvents = [...getMikanCalendarEvents(), ...postEvents];
const instances = buildCalendarEventInstances(baseEvents, startYear, endYear);
const bucket = bucketCalendarEvents(instances);
const monthCells = getMonthCells(today.getFullYear(), today.getMonth(), bucket);
const weekDays = getWeekTimelineDays(todayKey);
const dayTimelineEvents = getDayTimelineEvents(instances, todayKey);
const todayEvents = bucket[todayKey] ?? [];
const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
const colorClassMap = {
	pink: "calendar-event--pink",
	blue: "calendar-event--blue",
	mint: "calendar-event--mint",
	yellow: "calendar-event--yellow",
	neutral: "calendar-event--neutral",
};
function eventClass(event: { color?: keyof typeof colorClassMap }) {
	return colorClassMap[event.color || "neutral"];
}
---

<ContentGridLayout title={title} description={description}>
	<section class="calendar-page resources-page card-base relative overflow-hidden px-5 py-7 sm:px-8 sm:py-9" data-calendar-page data-selected-date={todayKey}>
		<header class="tools-page-header relative z-10 mb-7">
			<div class="tools-eyebrow-row">
				<Icon is:inline name="material-symbols:calendar-month-rounded" />
				<p class="tools-eyebrow">MIKAN CALENDAR</p>
			</div>
			<h1 class="tools-page-title">{title}</h1>
			<p class="tools-page-description">{description}</p>
		</header>

		<div class="calendar-shell relative z-10">
			<aside class="calendar-overview-panel">
				<div class="site-overview-section-heading">
					<Icon is:inline name="material-symbols:today-rounded" />
					<h2>今日摘要</h2>
				</div>
				<p class="calendar-date-label">{todayKey}</p>
				<div class="calendar-mini-list">
					{todayEvents.length > 0 ? todayEvents.slice(0, 5).map((event) => (
						<a href={event.url || `#date-${event.dateKey}`} class={`calendar-mini-item ${eventClass(event)}`}>
							<span>{event.title}</span>
							<small>{event.kind}</small>
						</a>
					)) : <p class="calendar-empty-text">今天没有公开日程。</p>}
				</div>
			</aside>

			<main class="calendar-main-panel">
				<div class="calendar-toolbar">
					<div>
						<p class="calendar-toolbar-kicker">Public Calendar</p>
						<h2>{today.getFullYear()} 年 {today.getMonth() + 1} 月</h2>
					</div>
					<div class="calendar-view-switch" role="tablist" aria-label="日历视图">
						<button type="button" class="calendar-view-button" data-calendar-view-button="year">年</button>
						<button type="button" class="calendar-view-button is-active" data-calendar-view-button="month">月</button>
						<button type="button" class="calendar-view-button" data-calendar-view-button="week">周</button>
						<button type="button" class="calendar-view-button" data-calendar-view-button="day">日</button>
					</div>
				</div>

				<section class="calendar-view is-active" data-calendar-view="month" aria-label="月视图">
					<div class="calendar-weekday-row">
						{["日", "一", "二", "三", "四", "五", "六"].map((day) => <span>{day}</span>)}
					</div>
					<div class="calendar-month-grid">
						{monthCells.map((cell) => (
							<button type="button" class:list={["calendar-month-cell", { "is-muted": !cell.isCurrentMonth, "is-today": cell.dateKey === todayKey }]} data-calendar-date={cell.dateKey} id={`date-${cell.dateKey}`}>
								<span class="calendar-cell-day">{cell.day}</span>
								<div class="calendar-cell-events">
									{cell.events.slice(0, 3).map((event) => (
										<span class={`calendar-event-chip ${eventClass(event)}`}>{event.title}</span>
									))}
									{cell.events.length > 3 && <span class="calendar-more-chip">+{cell.events.length - 3}</span>}
								</div>
							</button>
						))}
					</div>
				</section>

				<section class="calendar-view" data-calendar-view="year" aria-label="年视图">
					<div class="calendar-year-grid">
						{years.map((year) => (
							<div class="calendar-year-card">
								<strong>{year}</strong>
								<span>{instances.filter((event) => event.dateKey.startsWith(String(year))).length} 个公开事件</span>
							</div>
						))}
					</div>
				</section>

				<section class="calendar-view" data-calendar-view="week" aria-label="周视图">
					<div class="calendar-week-timeline">
						<div class="calendar-time-axis">{Array.from({ length: 24 }, (_, hour) => <span>{String(hour).padStart(2, "0")}:00</span>)}</div>
						<div class="calendar-week-columns">
							{weekDays.map((day) => (
								<div class="calendar-week-column">
									<header>{day.weekday}<span>{day.label}</span></header>
									<div class="calendar-day-lane">
										{getDayTimelineEvents(instances, day.dateKey).map((event) => (
											<a href={event.url || `#date-${event.dateKey}`} class={`calendar-timeline-event ${eventClass(event)}`} style={`top:${event.topPercent}%;height:${event.heightPercent}%`}>
												{event.title}
											</a>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section class="calendar-view" data-calendar-view="day" aria-label="日视图">
					<div class="calendar-day-view">
						<div class="calendar-time-axis">{Array.from({ length: 24 }, (_, hour) => <span>{String(hour).padStart(2, "0")}:00</span>)}</div>
						<div class="calendar-day-lane">
							{dayTimelineEvents.map((event) => (
								<a href={event.url || `#date-${event.dateKey}`} class={`calendar-timeline-event ${eventClass(event)}`} style={`top:${event.topPercent}%;height:${event.heightPercent}%`}>
									{event.title}
								</a>
							))}
						</div>
					</div>
				</section>
			</main>

			<aside class="calendar-detail-panel">
				<div class="site-overview-section-heading">
					<Icon is:inline name="material-symbols:event-note-rounded" />
					<h2>日期详情</h2>
				</div>
				<div data-calendar-detail>
					{todayEvents.length > 0 ? todayEvents.map((event) => (
						<a href={event.url || `#date-${event.dateKey}`} class={`calendar-detail-item ${eventClass(event)}`}>
							<strong>{event.title}</strong>
							<span>{event.note || event.kind}</span>
						</a>
					)) : <p class="calendar-empty-text">选择有事件的日期查看详情。</p>}
				</div>
			</aside>
		</div>
	</section>

	<script is:inline>
		(function () {
			function initCalendarPage() {
				var root = document.querySelector("[data-calendar-page]");
				if (!root) return;
				var buttons = root.querySelectorAll("[data-calendar-view-button]");
				var views = root.querySelectorAll("[data-calendar-view]");
				buttons.forEach(function (button) {
					button.addEventListener("click", function () {
						var target = button.getAttribute("data-calendar-view-button");
						buttons.forEach(function (item) { item.classList.toggle("is-active", item === button); });
						views.forEach(function (view) {
							view.classList.toggle("is-active", view.getAttribute("data-calendar-view") === target);
						});
					});
				});
			}
			document.addEventListener("astro:page-load", initCalendarPage);
			document.addEventListener("swup:contentReplaced", initCalendarPage);
			initCalendarPage();
		})();
	</script>
</ContentGridLayout>
```

- [ ] **Step 6: Run page tests**

Run:

```powershell
npm.cmd run test:pages
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```powershell
git add tests/mikan-pages.test.ts src/config/navBarConfig.ts src/utils/focused-breadcrumb.ts src/pages/calendar.astro
git commit -m "feat: add public calendar route"
```

---

### Task 4: Calendar Styling And Responsive Layout

**Files:**
- Modify: `src/styles/resources.css`
- Test: `tests/mikan-pages.test.ts`

- [ ] **Step 1: Add style contract test**

Add to `tests/mikan-pages.test.ts`:

```ts
test("公开日历样式包含多视图、时间轴和移动端防溢出规则", () => {
	const source = readSource("src/styles/resources.css");

	assert.match(source, /\.calendar-shell/);
	assert.match(source, /\.calendar-view-switch/);
	assert.match(source, /\.calendar-month-grid/);
	assert.match(source, /\.calendar-year-grid/);
	assert.match(source, /\.calendar-week-timeline/);
	assert.match(source, /\.calendar-day-view/);
	assert.match(source, /\.calendar-timeline-event/);
	assert.match(source, /grid-template-columns:\s*minmax\(12rem,\s*0\.72fr\)\s*minmax\(0,\s*1\.8fr\)\s*minmax\(14rem,\s*0\.8fr\)/);
	assert.match(source, /@media\s*\(max-width:\s*1100px\)/);
	assert.match(source, /@media\s*\(max-width:\s*640px\)/);
	assert.match(source, /overflow-x:\s*auto/);
	assert.doesNotMatch(source, /letter-spacing:\s*-/);
});
```

- [ ] **Step 2: Run page tests to verify red**

Run:

```powershell
npm.cmd run test:pages
```

Expected: FAIL because calendar styles do not exist.

- [ ] **Step 3: Add calendar styles**

Append to `src/styles/resources.css`:

```css
/* ============ Public Calendar ============ */

.calendar-page {
	--calendar-line: color-mix(in oklab, var(--line-divider), transparent 10%);
}

.calendar-shell {
	display: grid;
	grid-template-columns: minmax(12rem, 0.72fr) minmax(0, 1.8fr) minmax(14rem, 0.8fr);
	gap: 1rem;
	align-items: start;
}

.calendar-overview-panel,
.calendar-main-panel,
.calendar-detail-panel {
	min-width: 0;
	border: 1px solid var(--calendar-line);
	border-radius: 1rem;
	background: color-mix(in oklab, white, transparent 16%);
	padding: 1rem;
}

.dark .calendar-overview-panel,
.dark .calendar-main-panel,
.dark .calendar-detail-panel {
	background: color-mix(in oklab, black, transparent 72%);
}

.calendar-date-label,
.calendar-toolbar-kicker {
	margin: 0;
	color: var(--content-meta);
	font-size: 0.78rem;
	font-weight: 700;
	text-transform: uppercase;
}

.calendar-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;
}

.calendar-toolbar h2 {
	margin: 0.2rem 0 0;
	font-size: clamp(1.25rem, 2vw, 1.8rem);
	font-weight: 800;
	color: var(--deep-text);
}

.calendar-view-switch {
	display: inline-flex;
	gap: 0.25rem;
	border: 1px solid var(--calendar-line);
	border-radius: 999px;
	padding: 0.25rem;
	background: color-mix(in oklab, var(--btn-plain-bg-hover), transparent 18%);
}

.calendar-view-button {
	border: 0;
	border-radius: 999px;
	padding: 0.45rem 0.75rem;
	background: transparent;
	color: var(--content-meta);
	font-size: 0.85rem;
	font-weight: 800;
	cursor: pointer;
}

.calendar-view-button.is-active {
	background: var(--deep-text);
	color: var(--page-bg);
}

.calendar-view {
	display: none;
}

.calendar-view.is-active {
	display: block;
}

.calendar-weekday-row,
.calendar-month-grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
}

.calendar-weekday-row span {
	padding: 0.5rem;
	color: var(--content-meta);
	text-align: center;
	font-size: 0.78rem;
	font-weight: 800;
}

.calendar-month-grid {
	border: 1px solid var(--calendar-line);
	border-radius: 0.85rem;
	overflow: hidden;
}

.calendar-month-cell {
	min-height: 7rem;
	border: 0;
	border-right: 1px solid var(--calendar-line);
	border-bottom: 1px solid var(--calendar-line);
	background: transparent;
	padding: 0.45rem;
	text-align: left;
	cursor: pointer;
}

.calendar-month-cell:nth-child(7n) {
	border-right: 0;
}

.calendar-month-cell:nth-last-child(-n + 7) {
	border-bottom: 0;
}

.calendar-month-cell:hover,
.calendar-month-cell.is-today {
	background: var(--btn-plain-bg-hover);
}

.calendar-month-cell.is-muted {
	color: var(--content-meta);
	opacity: 0.56;
}

.calendar-cell-day {
	display: block;
	font-size: 0.9rem;
	font-weight: 900;
	color: var(--deep-text);
}

.calendar-cell-events {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	margin-top: 0.45rem;
}

.calendar-event-chip,
.calendar-more-chip,
.calendar-mini-item,
.calendar-detail-item,
.calendar-timeline-event {
	border-radius: 0.45rem;
	font-weight: 800;
}

.calendar-event-chip,
.calendar-more-chip {
	overflow: hidden;
	padding: 0.15rem 0.35rem;
	font-size: 0.68rem;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.calendar-mini-list,
.calendar-detail-panel [data-calendar-detail] {
	display: grid;
	gap: 0.55rem;
	margin-top: 0.85rem;
}

.calendar-mini-item,
.calendar-detail-item {
	display: grid;
	gap: 0.15rem;
	padding: 0.65rem 0.75rem;
	border: 1px solid var(--calendar-line);
	text-decoration: none;
}

.calendar-mini-item small,
.calendar-detail-item span,
.calendar-empty-text {
	color: var(--content-meta);
	font-size: 0.78rem;
}

.calendar-year-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.75rem;
}

.calendar-year-card {
	display: grid;
	gap: 0.35rem;
	min-height: 6rem;
	border: 1px solid var(--calendar-line);
	border-radius: 0.85rem;
	padding: 0.9rem;
	background: color-mix(in oklab, var(--btn-plain-bg-hover), transparent 24%);
}

.calendar-year-card strong {
	color: var(--deep-text);
	font-size: 1.25rem;
}

.calendar-year-card span {
	color: var(--content-meta);
	font-size: 0.82rem;
}

.calendar-week-timeline,
.calendar-day-view {
	display: grid;
	grid-template-columns: 3.5rem minmax(38rem, 1fr);
	min-height: 48rem;
	overflow-x: auto;
}

.calendar-time-axis {
	display: grid;
	grid-template-rows: repeat(24, 2rem);
	color: var(--content-meta);
	font-size: 0.68rem;
}

.calendar-week-columns {
	display: grid;
	grid-template-columns: repeat(7, minmax(8rem, 1fr));
}

.calendar-week-column {
	border-left: 1px solid var(--calendar-line);
}

.calendar-week-column header {
	display: grid;
	gap: 0.15rem;
	min-height: 3rem;
	border-bottom: 1px solid var(--calendar-line);
	padding: 0.4rem;
	color: var(--deep-text);
	font-size: 0.78rem;
	font-weight: 900;
	text-align: center;
}

.calendar-week-column header span {
	color: var(--content-meta);
	font-size: 0.72rem;
}

.calendar-day-lane {
	position: relative;
	min-height: 48rem;
	background-image: linear-gradient(to bottom, var(--calendar-line) 1px, transparent 1px);
	background-size: 100% 2rem;
}

.calendar-timeline-event {
	position: absolute;
	left: 0.25rem;
	right: 0.25rem;
	display: block;
	overflow: hidden;
	padding: 0.35rem 0.45rem;
	color: var(--deep-text);
	font-size: 0.72rem;
	text-decoration: none;
	box-shadow: 0 8px 18px rgb(15 23 42 / 0.08);
}

.calendar-event--pink {
	background: color-mix(in oklab, #f9a8d4, white 35%);
	color: #9d174d;
}

.calendar-event--blue {
	background: color-mix(in oklab, #93c5fd, white 35%);
	color: #1d4ed8;
}

.calendar-event--mint {
	background: color-mix(in oklab, #86efac, white 35%);
	color: #047857;
}

.calendar-event--yellow {
	background: color-mix(in oklab, #fde68a, white 30%);
	color: #92400e;
}

.calendar-event--neutral {
	background: color-mix(in oklab, #e2e8f0, white 18%);
	color: #334155;
}

@media (max-width: 1100px) {
	.calendar-shell {
		grid-template-columns: minmax(0, 1fr);
	}

	.calendar-overview-panel,
	.calendar-detail-panel {
		position: static;
	}

	.calendar-year-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 640px) {
	.calendar-toolbar {
		align-items: stretch;
		flex-direction: column;
	}

	.calendar-view-switch {
		width: 100%;
		justify-content: space-between;
	}

	.calendar-view-button {
		flex: 1;
		padding-inline: 0.4rem;
	}

	.calendar-month-cell {
		min-height: 4.6rem;
		padding: 0.3rem;
	}

	.calendar-event-chip {
		max-width: 100%;
		font-size: 0.58rem;
	}

	.calendar-year-grid {
		grid-template-columns: minmax(0, 1fr);
	}

	.calendar-week-timeline,
	.calendar-day-view {
		grid-template-columns: 3rem minmax(34rem, 1fr);
	}
}
```

- [ ] **Step 4: Run page tests**

Run:

```powershell
npm.cmd run test:pages
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add tests/mikan-pages.test.ts src/styles/resources.css
git commit -m "feat: style public calendar views"
```

---

### Task 5: Documentation And Handoff

**Files:**
- Modify: `README.md`
- Modify: `docs/content-repository.md`
- Modify: `docs/next-tasks.md`
- Modify: `CHANGELOG.md`
- Modify: `development-log.md`

- [ ] **Step 1: Update README**

Add a short bullet in the feature list mentioning `/calendar/` as a public calendar page. Add `content.example/calendar/events.json` to the content example description.

- [ ] **Step 2: Update content repository docs**

Add `content/calendar/events.json` to the private content repository structure and document required fields: `id`, `title`, `kind`, `visibility`, plus `date` or `start`; optional `end`, `allDay`, `note`, `color`, `icon`, `url`, `recurring`.

- [ ] **Step 3: Update next tasks**

If implementation is complete, remove the public calendar current task from `docs/next-tasks.md` or mark it completed pending final push.

- [ ] **Step 4: Update development log**

Add a new top entry with the current time. Include modified files, behavior, and verification commands run.

- [ ] **Step 5: Update CHANGELOG**

Under `Unreleased`, add:

```md
- 新增 `/calendar/` 公开日历页，支持内容文件维护的公开日程、年/月/周/日视图和周/日 24 小时时间轴展示。
```

- [ ] **Step 6: Commit docs**

Run:

```powershell
git add README.md docs/content-repository.md docs/next-tasks.md CHANGELOG.md development-log.md
git commit -m "docs: document public calendar"
```

---

### Task 6: Full Verification And Browser Check

**Files:**
- No production edits expected unless verification finds issues.

- [ ] **Step 1: Run full automatic validation**

Run:

```powershell
npm.cmd run sync:content
npm.cmd run validate:content
npm.cmd run test:content-model
npm.cmd run test:calendar
npm.cmd run test:archive
npm.cmd run test:pages
npm.cmd run check
npm.cmd run build
```

Expected: all commands exit 0. Existing build warnings may remain if already present, but no new errors.

- [ ] **Step 2: Start local dev server**

Run:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

Keep it running for browser checks.

- [ ] **Step 3: Browser visual verification**

Use Playwright/system Chrome to inspect:

- `http://127.0.0.1:4321/calendar/` at `1440×900`.
- `http://127.0.0.1:4321/calendar/` at `390×844`.
- `http://127.0.0.1:4321/` “我的” dropdown contains “日历”.

Check:

- No horizontal overflow.
- Calendar view buttons switch year/month/week/day.
- Month grid, year cards, week timeline, and day timeline render.
- No console errors except known dev-only favicon/Pagefind noise.

- [ ] **Step 4: Fix issues if found**

If any verification fails, write a failing test for the issue first, then fix and rerun the relevant command.

- [ ] **Step 5: Final commit if fixes were needed**

If Step 4 changed files, commit:

```powershell
git add .
git commit -m "fix: polish public calendar"
```

---

### Task 7: Push

**Files:**
- No file edits.

- [ ] **Step 1: Check final status**

Run:

```powershell
git status --short
git log --oneline -5
```

Expected: clean worktree.

- [ ] **Step 2: Push current branch**

Run:

```powershell
git push origin codex/firefly-rebuild
```

Expected: push succeeds.

---

## Self-Review

- Spec coverage: The plan covers content file maintenance, no front-end creation, `/calendar/` route, “我的” navigation, year/month/week/day views, week/day timelines, event bucketing, validation, docs, and browser visual checks.
- Placeholder scan: No `TBD`, `TODO`, or “implement later” placeholders are used.
- Type consistency: `MikanCalendarEvent`, `CalendarEventInstance`, `getMikanCalendarEvents`, `buildCalendarEventInstances`, and view data attributes are consistently named across tasks.
