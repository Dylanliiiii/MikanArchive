import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: NavBarLink[] = [
		LinkPresets.Home,
	];

	links.push({
		name: "文库",
		url: "#",
		icon: "material-symbols:article",
		children: [
			LinkPresets.Posts,
			LinkPresets.Archive,
			LinkPresets.Categories,
			LinkPresets.Tags,
		],
	});

	links.push({
		name: "收藏",
		url: "#",
		icon: "material-symbols:bookmark-heart",
		children: [
			LinkPresets.Resources,
			LinkPresets.ResourceTools,
			LinkPresets.ResourceClips,
		],
	});
	links.push({
		name: "联系我",
		url: "#",
		icon: "material-symbols:mail-rounded",
		children: [
			LinkPresets.Friends,
			LinkPresets.Guestbook,
			LinkPresets.QQGroup,
		],
	});
	links.push(LinkPresets.Records);
	links.push({
		name: "我的",
		url: "#",
		icon: "material-symbols:person",
		children: [
			LinkPresets.About,
			{
				name: "GitHub",
				url: "https://github.com/",
				external: true,
				icon: "fa7-brands:github",
			},
			{
				name: "RSS",
				url: "/rss.xml",
				icon: "fa7-solid:rss",
			},
		],
	});

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设 - 可自由自定义导航栏链接的名称、图标和URL
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "主页",
		url: "/",
		icon: "material-symbols:home",
	},
	Posts: {
		name: "文章",
		url: "/posts/",
		icon: "material-symbols:article",
	},
	Archive: {
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	Categories: {
		name: "分类",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "标签",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Friends: {
		name: "友链",
		url: "/friends/",
		icon: "material-symbols:group",
		pageKey: "friends",
	},
	QQGroup: {
		name: "QQ群",
		url: "https://qm.qq.com/",
		external: true,
		icon: "material-symbols:groups-rounded",
	},
	Resources: {
		name: "收藏总览",
		url: "/resources/",
		icon: "material-symbols:bookmark-heart",
	},
	ResourceTools: {
		name: "工具导航",
		url: "/resources/tools/",
		icon: "material-symbols:rocket-launch-rounded",
	},
	ResourceClips: {
		name: "摘录收藏",
		url: "/resources/clips/",
		icon: "material-symbols:bookmarks-rounded",
	},
	Records: {
		name: "足迹",
		url: "/records/",
		icon: "material-symbols:timeline",
	},
	Sponsor: {
		name: "打赏",
		url: "/sponsor/",
		icon: "material-symbols:favorite",
		pageKey: "sponsor",
	},
	Guestbook: {
		name: "留言",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	About: {
		name: "我的",
		url: "/about/",
		icon: "material-symbols:person",
	},
	Bangumi: {
		name: "番组计划",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	Gallery: {
		name: "相册",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Anime: {
		name: "追番",
		url: "/anime/",
		icon: "material-symbols:live-tv",
		pageKey: "anime",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
