import { Check, Copy, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

type CopyState = Record<string, boolean>;

export function FriendApplyDialog() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<CopyState>({});

  const fields = [
    ["站点名称", siteConfig.friendInfo.name],
    ["站点描述", siteConfig.friendInfo.description],
    ["站点链接", siteConfig.friendInfo.url],
    ["头像链接", siteConfig.friendInfo.avatar]
  ] as const;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied((current) => ({ ...current, [label]: true }));
    window.setTimeout(() => {
      setCopied((current) => ({ ...current, [label]: false }));
    }, 1400);
  }

  return (
    <>
      <button className="button-primary" type="button" onClick={() => setOpen(true)}>
        <Mail size={16} aria-hidden="true" />
        申请友链
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="presentation">
          <section
            aria-modal="true"
            className="surface max-h-[88vh] w-full max-w-2xl overflow-auto bg-white p-5 sm:p-6"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">友链申请</h2>
                <p className="mt-2 text-sm leading-6 text-foreground/60">本站信息可直接复制到你的友链页面。</p>
              </div>
              <button aria-label="关闭友链申请弹窗" className="button-ghost shrink-0 p-2" type="button" onClick={() => setOpen(false)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {fields.map(([label, value]) => (
                <div className="surface-plain flex min-w-0 items-center justify-between gap-3 p-3" key={label}>
                  <div className="min-w-0">
                    <p className="text-xs text-foreground/50">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold">{value}</p>
                  </div>
                  <button aria-label={`复制${label}`} className="button-outline shrink-0 p-2" type="button" onClick={() => copy(label, value)}>
                    {copied[label] ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-border/70 bg-muted/50 p-4 text-sm leading-7 text-foreground/70">
              <p>申请时请先添加本站，再发送你的站点名称、描述、链接和头像。站点需要支持 HTTPS，内容健康可访问；长期不可达或包含不适内容时会暂时移除。</p>
            </div>

            <a className="button-outline mt-5" href="mailto:hello@example.com">
              <Mail size={16} aria-hidden="true" />
              发送申请邮件
            </a>
          </section>
        </div>
      ) : null}
    </>
  );
}
