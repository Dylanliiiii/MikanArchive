import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    mdx(),
    react(),
    tailwind({
      applyBaseStyles: false
    }),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
