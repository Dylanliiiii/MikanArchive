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

function pushIfInRange(
	out: CalendarEventInstance[],
	event: MikanCalendarEvent,
	date: Date,
	startYear: number,
	endYear: number,
) {
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
			pushIfInRange(out, event, parseLocalDate(dateKey), startYear, endYear);
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
	const start = addDays(first, -first.getDay());

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
	const start = addDays(date, -mondayOffset);
	const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

	return weekdays.map((weekday, index) => {
		const day = addDays(start, index);
		return {
			dateKey: formatCalendarDate(day),
			weekday,
			label: `${day.getMonth() + 1}/${day.getDate()}`,
		};
	});
}

export function getDayTimelineEvents(events: CalendarEventInstance[], dateKey: string): CalendarTimelineEvent[] {
	return events
		.filter((event) => event.dateKey === dateKey && event.startDate && event.endDate)
		.map((event) => {
			const start = event.startDate as Date;
			const end = event.endDate as Date;
			const startMinutes = start.getHours() * 60 + start.getMinutes();
			const endMinutes = end.getHours() * 60 + end.getMinutes();
			return {
				...event,
				topPercent: (startMinutes / 1440) * 100,
				heightPercent: (Math.max(endMinutes - startMinutes, 30) / 1440) * 100,
			};
		});
}

export function buildPostCalendarEvents(posts: CalendarPostMeta[]): MikanCalendarEvent[] {
	return posts.map((post) => ({
		id: `post-${post.id}`,
		title: `发布：${post.title}`,
		kind: "post",
		date: formatCalendarDate(post.published),
		allDay: true,
		color: "neutral",
		icon: "material-symbols:article-rounded",
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
