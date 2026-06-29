import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	avatar: "/assets/avatars/example-maker.svg",
	name: "MikanArchive",
	bio: "教程、资源、友链和个人介绍的知识收藏馆。",
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Dylanliiiii",
			showName: false,
		},
		{
			name: "B站",
			icon: "simple-icons:bilibili",
			url: "https://space.bilibili.com/37007345?spm_id_from=333.1387.0.0",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			url: "mailto:hello@example.com",
			showName: false,
		},
	],
};
