export type FocusedBreadcrumbItem = {
	label: string;
	href: string;
	icon: string;
	isCurrent?: boolean;
};

const pageMap: Record<string, Omit<FocusedBreadcrumbItem, "href" | "isCurrent">> = {
	"/posts/": {
		label: "文章",
		icon: "material-symbols:article-rounded",
	},
	"/archive/": {
		label: "归档",
		icon: "material-symbols:archive-rounded",
	},
	"/categories/": {
		label: "分类标签",
		icon: "material-symbols:category-rounded",
	},
	"/resources/tools/": {
		label: "工具导航",
		icon: "material-symbols:rocket-launch-rounded",
	},
	"/resources/clips/": {
		label: "摘录收藏",
		icon: "material-symbols:bookmarks-rounded",
	},
	"/friends/": {
		label: "友链",
		icon: "material-symbols:group-rounded",
	},
	"/guestbook/": {
		label: "留言",
		icon: "material-symbols:mode-comment-rounded",
	},
	"/records/": {
		label: "足迹",
		icon: "material-symbols:timeline",
	},
	"/about/": {
		label: "我的",
		icon: "material-symbols:person-rounded",
	},
	"/rss.xml": {
		label: "RSS",
		icon: "fa7-solid:rss",
	},
	"/search/": {
		label: "搜索",
		icon: "material-symbols:search-rounded",
	},
};

function normalizePath(pathname: string) {
	if (pathname === "/rss.xml") return pathname;
	const cleanPath = pathname.split("?")[0]?.replace(/\\/g, "/").replace(/\/+/g, "/") || "/";
	if (cleanPath === "/") return "/";
	return cleanPath.endsWith("/") ? cleanPath : cleanPath + "/";
}

export function getFocusedBreadcrumb(
	pathname: string,
	pageTitle = "",
): FocusedBreadcrumbItem[] {
	const normalizedPath = normalizePath(pathname);
	if (normalizedPath === "/") return [];

	const home: FocusedBreadcrumbItem = {
		label: "主页",
		href: "/",
		icon: "material-symbols:home-rounded",
	};

	if (normalizedPath.startsWith("/posts/") && normalizedPath !== "/posts/") {
		return [
			home,
			{
				label: pageTitle || "文章",
				href: normalizedPath,
				icon: "material-symbols:article-rounded",
				isCurrent: true,
			},
		];
	}

	const page = pageMap[normalizedPath];
	return [
		home,
		{
			label: pageTitle || page?.label || "页面",
			href: normalizedPath,
			icon: page?.icon || "material-symbols:description-rounded",
			isCurrent: true,
		},
	];
}
