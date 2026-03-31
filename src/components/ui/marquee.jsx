import { cn } from "@/lib/utils"

export function Marquee({
  className,
  children,
  vertical = false,
  repeat = 4,
  isPaused = false,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}>
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
            })}
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}>
            {children}
          </div>
        ))}
    </div>
  );
}
