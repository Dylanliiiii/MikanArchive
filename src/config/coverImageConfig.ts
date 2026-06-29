import type { CoverImageConfig } from "../types/coverImageConfig";

export const coverImageConfig: CoverImageConfig = {
	enableInPost: true,
	randomCoverImage: {
		enable: false,
		apis: [],
		fallback: "/assets/images/welcome-cover.svg",
		showLoading: false,
	},
};
