import { forwardRef } from "react";
import { cn } from "./cn.js";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink",
          "placeholder:text-ink-faint",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "aria-[invalid=true]:border-danger",
          className,
        )}
        {...props}
      />
    );
  },
);
