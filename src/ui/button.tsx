import { forwardRef } from "react";
import { cn } from "./cn.js";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:opacity-50 disabled:pointer-events-none pointer-coarse:min-w-11";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary: "bg-surface text-ink border border-line hover:bg-canvas",
  ghost: "bg-transparent text-ink hover:bg-canvas",
  danger: "bg-danger text-accent-ink hover:opacity-90",
};

// Em tela de toque (pointer-coarse) todo botão sobe para 44px, o alvo mínimo confortável
// (Apple HIG/Material); com mouse fica o tamanho visual de cada variante.
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm pointer-coarse:h-11",
  md: "h-10 px-4 text-sm pointer-coarse:h-11",
};

export function buttonClassName(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName(variant, size, className)}
      {...props}
    />
  );
});
