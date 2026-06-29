import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	mode: "banner",
	switchable: true,
	playerEnable: false,
	src: {
		desktop: "/assets/backgrounds/archive-bg.svg",
		mobile: "/assets/backgrounds/archive-bg.svg",
	},
	common: {
		dimOpacity: 0.18,
		playerMode: "order",
		homeText: {
			enable: true,
			switchable: true,
			title: "MikanArchive",
			titleSize: "3.8rem",
			subtitle: [
				"把教程、资源和个人资料放回能被再次找到的地方。",
				"收藏不是堆积，是给未来的自己留下坐标。",
				"一个轻二次元气质的个人知识收藏馆。",
			],
			subtitleSize: "1.35rem",
			typewriter: {
				enable: true,
				speed: 72,
				deleteSpeed: 36,
				pauseTime: 2200,
			},
		},
		navbar: {
			transparentMode: "semifull",
			enableBlur: true,
			blur: 10,
		},
		waves: {
			enable: { desktop: true, mobile: true },
			switchable: true,
		},
		gradient: {
			enable: { desktop: true, mobile: true },
			height: "18%",
			switchable: true,
		},
		carousel: {
			enable: false,
			interval: 6000,
			transitionEffect: "fade",
			switchable: false,
		},
	},
	banner: {
		position: "center",
	},
	overlay: {
		switchable: { opacity: true, blur: true, cardOpacity: true },
		zIndex: -1,
		opacity: 0.82,
		blur: 8,
		cardOpacity: 0.58,
	},
	fullscreen: {
		position: "center",
	},
};
