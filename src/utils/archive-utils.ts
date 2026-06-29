export type ArchivePost = {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
		updated?: Date;
	};
};

export type ArchiveTagSummary = {
	name: string;
	count: number;
};

export type ArchiveMonthGroup = {
	month: number;
	count: number;
	posts: ArchivePost[];
};

export type ArchiveYearGroup = {
	year: number;
	totalCount: number;
	months: ArchiveMonthGroup[];
};

export type ArchiveTimeline = {
	postCount: number;
	yearCount: number;
	years: ArchiveYearGroup[];
};

export type ArchiveHeatmapCell = {
	month: number;
	period: number;
	count: number;
	level: number;
};

export type ArchiveHeatmapYear = {
	year: number;
	grid: ArchiveHeatmapCell[][];
};

export function summarizeArchiveTags(
	posts: ArchivePost[],
): ArchiveTagSummary[] {
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return [...counts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort(
			(left, right) =>
				right.count - left.count ||
				left.name.localeCompare(right.name, "zh-CN"),
		);
}

export function filterArchivePosts(
	posts: ArchivePost[],
	tag: string | null,
): ArchivePost[] {
	return posts
		.filter((post) => !tag || post.data.tags.includes(tag))
		.slice()
		.sort(
			(left, right) =>
				right.data.published.getTime() - left.data.published.getTime(),
		);
}

export function groupArchivePosts(posts: ArchivePost[]): ArchiveTimeline {
	const yearMap = new Map<number, Map<number, ArchivePost[]>>();

	for (const post of filterArchivePosts(posts, null)) {
		const year = post.data.published.getFullYear();
		const month = post.data.published.getMonth() + 1;
		const monthMap = yearMap.get(year) ?? new Map<number, ArchivePost[]>();
		const monthPosts = monthMap.get(month) ?? [];

		monthPosts.push(post);
		monthMap.set(month, monthPosts);
		yearMap.set(year, monthMap);
	}

	const years = [...yearMap.entries()]
		.sort(([left], [right]) => right - left)
		.map(([year, monthMap]): ArchiveYearGroup => {
			const months = [...monthMap.entries()]
				.sort(([left], [right]) => right - left)
				.map(([month, monthPosts]): ArchiveMonthGroup => ({
					month,
					count: monthPosts.length,
					posts: monthPosts,
				}));

			return {
				year,
				totalCount: months.reduce(
					(total, month) => total + month.count,
					0,
				),
				months,
			};
		});

	return {
		postCount: posts.length,
		yearCount: years.length,
		years,
	};
}

export function getArchiveActivityDate(post: ArchivePost): Date {
	return post.data.updated ?? post.data.published;
}

export function buildArchiveHeatmaps(
	posts: ArchivePost[],
): ArchiveHeatmapYear[] {
	const countsByYear = new Map<number, number[][]>();

	for (const post of posts) {
		const activityDate = getArchiveActivityDate(post);
		const year = activityDate.getFullYear();
		const grid =
			countsByYear.get(year) ??
			Array.from({ length: 4 }, () => Array<number>(12).fill(0));
		const period = Math.min(
			3,
			Math.floor((activityDate.getDate() - 1) / 7),
		);

		grid[period][activityDate.getMonth()] += 1;
		countsByYear.set(year, grid);
	}

	return [...countsByYear.entries()]
		.sort(([left], [right]) => right - left)
		.map(([year, counts]): ArchiveHeatmapYear => {
			const maxCount = Math.max(1, ...counts.flat());
			const grid = counts.map((row, period) =>
				row.map((count, month): ArchiveHeatmapCell => ({
					month,
					period,
					count,
					level:
						count === 0
							? 0
							: Math.max(1, Math.ceil((count / maxCount) * 4)),
				})),
			);

			return { year, grid };
		});
}
