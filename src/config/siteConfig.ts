import type { SiteConfig } from "@/types/siteConfig";

const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	title: "MikanArchive",
	subtitle: "知识收藏馆",
	site_url: "https://dylanliiiii.github.io/MikanArchive/",
	description: "一个记录教程、收藏资源和整理足迹的个人知识收藏博客。",
	keywords: ["MikanArchive", "Astro", "Firefly", "知识收藏", "技术博客", "教程", "资源收藏"],
	themeColor: {
		hue: 205,
		fixed: false,
		defaultMode: "system",
	},
	pageWidth: 104,
	card: {
		border: true,
		followTheme: false,
	},
	favicon: [
		{
			src: "/favicon/favicon.ico",
		},
	],
	navbar: {
		logo: {
			type: "icon",
			value: "material-symbols:auto-stories-rounded",
			alt: "MikanArchive",
		},
		title: "MikanArchive",
		widthFull: false,
		menuAlign: "center",
		followTheme: false,
		stickyNavbar: true,
	},
	siteStartDate: "2026-06-26",
	timezone: "Asia/Shanghai",
	pages: {
		friends: true,
		sponsor: false,
		guestbook: true,
		bangumi: false,
		gallery: false,
		anime: false,
	},
	categoryBar: true,
	foldArticle: true,
	postListLayout: {
		defaultMode: "grid",
		mobileDefaultMode: "list",
		showTags: true,
		descriptionLines: 2,
		allowSwitch: true,
		grid: {
			masonry: false,
			columnWidth: 320,
		},
	},
	post: {
		rehypeCallouts: {
			theme: "github",
			enablePythonMarkdownAdmonitions: false,
		},
		showLastModified: true,
		outdatedThreshold: 120,
		sharePoster: false,
		generateOgImages: false,
	},
	bangumi: {
		userId: "",
		mode: "dynamic",
		apiUrl: "https://bgmapi.anibt.net",
		subjectBaseUrl: "https://bgm.tv/subject/",
		categoryOrder: ["anime", "book", "music", "game"],
	},
	anime: {
		bilibili: {
			uid: "",
		},
	},
	pagination: {
		postsPerPage: 10,
	},
	imageOptimization: {
		formats: "webp",
		quality: 85,
		noReferrerDomains: [],
	},
	lang: SITE_LANG,
};
