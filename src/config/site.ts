export const siteConfig = {
  name: "MikanArchive",
  description: "一个记录教程、收藏资源和整理足迹的个人知识收藏博客。",
  nav: [
    { label: "主页", href: "/" },
    { label: "文库", href: "/posts/" },
    { label: "收藏", href: "/resources/" },
    { label: "友邻", href: "/friends/" },
    { label: "足迹", href: "/records/" },
    { label: "我的", href: "/about/" }
  ],
  friendInfo: {
    name: "MikanArchive",
    description: "一个记录教程、收藏资源和整理足迹的个人知识收藏博客。",
    url: "https://example.com",
    avatar: "https://example.com/assets/avatar.png"
  },
  socialLinks: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "RSS", href: "" }
  ],
  theme: {
    accentNames: ["sakura", "sky", "honey", "mint", "ink"],
    backgroundImage: "",
    defaultMode: "light"
  }
} as const;

export type SiteConfig = typeof siteConfig;
