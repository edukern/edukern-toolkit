import { cn } from "./cn.js";

type Tone = "neutral" | "accent" | "danger" | "warning";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-ink-muted border border-line",
  accent: "bg-accent text-accent-ink",
  danger: "bg-danger text-accent-ink",
  warning: "bg-warning text-ink",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
