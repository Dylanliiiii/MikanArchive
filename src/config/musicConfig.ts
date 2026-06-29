import type { MusicPlayerConfig } from "../types/musicConfig";

export const musicPlayerConfig: MusicPlayerConfig = {
	showInNavbar: false,
	mode: "local",
	volume: 0.5,
	playMode: "list",
	showLyrics: false,
	meting: {
		api: "",
		server: "netease",
		type: "playlist",
		id: "",
		auth: "",
		fallbackApis: [],
	},
	local: {
		playlist: [],
	},
};
