import { Search, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

type SearchItem = {
  title: string;
  description: string;
  href: string;
  tags?: string[];
  category?: string;
};

export function SearchDialog({ items = [] }: { items?: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) return items.slice(0, 8);

    return items
      .filter((item) => {
        const text = [item.title, item.description, item.category, ...(item.tags ?? [])].join(" ").toLowerCase();
        return text.includes(normalized);
      })
      .slice(0, 12);
  }, [items, deferredQuery]);

  return (
    <>
      <button className="button-outline" type="button" onClick={() => setOpen(true)}>
        <Search size={16} aria-hidden="true" />
        搜索
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/45 p-4 pt-24" role="presentation">
          <section aria-modal="true" className="surface mx-auto w-full max-w-2xl bg-white p-4" role="dialog">
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="mikan-search-input">搜索关键词</label>
              <input
                autoFocus
                className="min-w-0 flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
                id="mikan-search-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题、摘要、分类或标签"
                type="search"
                value={query}
              />
              <button aria-label="关闭搜索" className="button-ghost shrink-0 p-2" type="button" onClick={() => setOpen(false)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 max-h-[58vh] space-y-2 overflow-auto">
              {results.length > 0 ? (
                results.map((item) => (
                  <a className="block rounded-md p-3 transition hover:bg-muted/70" href={item.href} key={item.href}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{item.title}</p>
                      {item.category ? <span className="badge">{item.category}</span> : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-foreground/60">{item.description}</p>
                  </a>
                ))
              ) : (
                <p className="rounded-md bg-muted/60 p-4 text-sm text-foreground/60">没有找到匹配内容。</p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
