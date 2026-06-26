import { Flame } from "lucide-react";

type HeatmapItem = {
  date: string;
  count?: number;
};

function colorClass(value: number) {
  if (value >= 4) return "bg-primary";
  if (value >= 2) return "bg-emerald-300";
  if (value >= 1) return "bg-sky-200";
  return "bg-muted";
}

export function WritingHeatmap({ items = [] }: { items?: HeatmapItem[] }) {
  const countByDate = new Map(items.map((item) => [item.date, item.count ?? 1]));
  const today = new Date();
  const cells = Array.from({ length: 84 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (83 - index));
    const key = day.toISOString().slice(0, 10);
    return { key, value: countByDate.get(key) ?? 0 };
  });

  return (
    <section className="surface p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-base font-bold">
          <Flame size={18} aria-hidden="true" />
          写作热力图
        </h2>
        <span className="text-xs text-foreground/55">最近 12 周</span>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
          {cells.map((cell) => (
            <span
              aria-label={`${cell.key} 写作记录 ${cell.value} 条`}
              className={`h-3 w-3 rounded-sm ${colorClass(cell.value)}`}
              key={cell.key}
              title={`${cell.key}: ${cell.value}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-foreground/50">
        <span>少</span>
        {[0, 1, 2, 4].map((value) => (
          <span className={`h-3 w-3 rounded-sm ${colorClass(value)}`} key={value} />
        ))}
        <span>多</span>
      </div>
    </section>
  );
}
