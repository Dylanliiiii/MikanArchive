import type { FriendLink, FriendsPageConfig } from "../types/friendsConfig";

export const friendsPageConfig: FriendsPageConfig = {
	title: "友邻",
	description: "把值得常去的站点放在近处。",
	showCustomContent: true,
	showComment: false,
	randomizeSort: false,
};

export const friendsConfig: FriendLink[] = [];

export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);
	if (friendsPageConfig.randomizeSort) return friends.sort(() => Math.random() - 0.5);
	return friends.sort((a, b) => b.weight - a.weight);
};
