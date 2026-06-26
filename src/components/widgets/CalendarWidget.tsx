import { CalendarDays } from "lucide-react";

type CalendarEvent = {
  date: string;
  title?: string;
};

const dayLabels = ["一", "二", "三", "四", "五", "六", "日"];

export function CalendarWidget({ events = [] }: { events?: CalendarEvent[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const eventDates = new Set(events.map((event) => event.date));
  const cells = Array.from({ length: Math.ceil((startOffset + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - startOffset + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  return (
    <section className="surface p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-base font-bold">
          <CalendarDays size={18} aria-hidden="true" />
          记录日历
        </h2>
        <span className="text-xs text-foreground/55">
          {year}.{String(month + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-foreground/50">
        {dayLabels.map((label) => (
          <span className="py-1" key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          const dateKey = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
          const active = eventDates.has(dateKey);
          return (
            <div
              aria-label={day ? `${dateKey}${active ? " 有记录" : ""}` : "空白日期"}
              className={[
                "grid aspect-square place-items-center rounded-md text-xs",
                day ? "bg-muted/70 text-foreground/70" : "bg-transparent",
                active ? "bg-primary text-primary-foreground" : ""
              ].join(" ")}
              key={`${index}-${day ?? "empty"}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </section>
  );
}
