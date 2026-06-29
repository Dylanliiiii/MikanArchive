import { setMaxListeners } from "node:events";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { pluginCollapsible } from "expressive-code-collapsible";
import { pluginLanguageBadge } from "expressive-code-language-badge";
import katex from "katex";
import "katex/dist/contrib/mhchem.mjs";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCallouts from "rehype-callouts";
import rehypeComponents from "rehype-components";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkAdmonitionToBlockquoteCallout from "remark-admonition-to-blockquote-callout";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig, plantumlConfig, siteConfig } from "./src/config";
import I18nKey from "./src/i18n/i18nKey";
import { i18n } from "./src/i18n/translation";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import rehypeEmailProtection from "./src/plugins/rehype-email-protection.mjs";
import rehypeExternalLinks from "./src/plugins/rehype-external-links.mjs";
import rehypeFigure from "./src/plugins/rehype-figure.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { rehypePlantuml } from "./src/plugins/rehype-plantuml.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkImageGrid } from "./src/plugins/remark-image-grid.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkPlantuml } from "./src/plugins/remark-plantuml.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

const site = process.env.SITE_URL ?? "https://example.com";
const base = process.env.BASE_PATH ?? "/";

if (process.env.NODE_ENV === "development") {
	setMaxListeners(20);
}

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  image: {
    layout: "constrained"
  },
  integrations: [
    icon({
      include: {
        "material-symbols": ["*"],
        "fa7-brands": ["*"],
        "fa7-regular": ["*"],
        "fa7-solid": ["*"],
        "simple-icons": ["*"],
        mdi: ["*"],
        mingcute: ["*"]
      }
    }),
    expressiveCode({
      themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
      plugins: [
        ...(expressiveCodeConfig.pluginLanguageBadge?.enable === true
          ? [pluginLanguageBadge()]
          : []),
        pluginCollapsibleSections(),
        pluginLineNumbers(),
        ...(expressiveCodeConfig.pluginCollapsible?.enable === true
          ? [
              pluginCollapsible({
                lineThreshold: expressiveCodeConfig.pluginCollapsible.lineThreshold || 15,
                previewLines: expressiveCodeConfig.pluginCollapsible.previewLines || 8,
                defaultCollapsed:
                  expressiveCodeConfig.pluginCollapsible.defaultCollapsed ?? true,
                expandButtonText: i18n(I18nKey.codeCollapsibleShowMore),
                collapseButtonText: i18n(I18nKey.codeCollapsibleShowLess),
                expandedAnnouncement: i18n(I18nKey.codeCollapsibleExpanded),
                collapsedAnnouncement: i18n(I18nKey.codeCollapsibleCollapsed)
              })
            ]
          : [])
      ],
      defaultProps: {
        wrap: false,
        overridesByLang: {
          shellsession: {
            showLineNumbers: false
          }
        }
      },
      styleOverrides: {
        borderRadius: "0.75rem",
        codeFontSize: "0.875rem",
        codeFontFamily:
          "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        codeLineHeight: "1.5rem",
        frames: {},
        textMarkers: {
          delHue: 0,
          insHue: 180,
          markHue: 250
        },
        languageBadge: {
          fontSize: "0.75rem",
          fontWeight: "bold",
          borderRadius: "0.25rem",
          opacity: "1",
          borderWidth: "0px",
          borderColor: "transparent"
        }
      },
      frames: {
        showCopyToClipboardButton: true
      }
    }),
    svelte(),
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const { pathname } = url;

        if (pathname === "/friends/" && !siteConfig.pages.friends) return false;
        if (pathname === "/sponsor/" && !siteConfig.pages.sponsor) return false;
        if (pathname === "/guestbook/" && !siteConfig.pages.guestbook) return false;
        if (pathname === "/bangumi/" && !siteConfig.pages.bangumi) return false;
        if (pathname === "/gallery/" && !siteConfig.pages.gallery) return false;
        if (pathname === "/anime/" && !siteConfig.pages.anime) return false;

        return true;
      }
    }),
    mdx()
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [
        ...(siteConfig.post.rehypeCallouts.enablePythonMarkdownAdmonitions !== false
          ? [remarkAdmonitionToBlockquoteCallout]
          : []),
        remarkMath,
        remarkReadingTime,
        remarkImageGrid,
        remarkExcerpt,
        remarkDirective,
        remarkSectionize,
        parseDirectiveNode,
        remarkMermaid,
        [remarkPlantuml, plantumlConfig]
      ],
      rehypePlugins: [
        [rehypeKatex, { katex }],
        [rehypeCallouts, { theme: siteConfig.post.rehypeCallouts.theme }],
        rehypeSlug,
        rehypeMermaid,
        rehypePlantuml,
        rehypeFigure,
        [rehypeExternalLinks, { siteUrl: site }],
        [rehypeEmailProtection, { method: "base64" }],
        [
          rehypeComponents,
          {
            components: {
              github: GithubCardComponent
            }
          }
        ],
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: ["anchor"]
            },
            content: {
              type: "element",
              tagName: "span",
              properties: {
                className: ["anchor-icon"],
                "data-pagefind-ignore": true
              },
              children: [
                {
                  type: "text",
                  value: "#"
                }
              ]
            }
          }
        ]
      ]
    })
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/.tmp/**", "**/.superpowers/**"]
      }
    },
    resolve: {
      alias: {
        "@rehype-callouts-theme": `rehype-callouts/theme/${siteConfig.post.rehypeCallouts.theme}`
      }
    },
    build: {
      minify: "esbuild",
      esbuildOptions: {
        minify: true,
        drop: ["debugger"],
        pure: ["console.log", "console.debug"]
      },
      cssCodeSplit: true,
      cssMinify: "esbuild",
      assetsInlineLimit: 4096
    }
  }
});
