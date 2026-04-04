import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "dangerGhost";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon" | "iconSm";

export type ButtonShape = "default" | "full";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  uppercase?: boolean;
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleOptions {}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "primary-gradient text-white shadow-sm shadow-primary/20 hover:opacity-90 active:scale-[0.99]",
  secondary:
    "bg-surface-container-high text-on-surface border border-outline-variant/20 hover:bg-surface-container",
  outline:
    "border border-outline-variant/30 text-on-surface hover:bg-surface-container-low",
  ghost:
    "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low",
  danger: "bg-error text-on-error hover:opacity-90 active:scale-[0.99]",
  dangerGhost: "text-error hover:bg-error/10",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-[11px] sm:text-xs",
  sm: "h-9 px-3.5 text-xs sm:text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm sm:text-base",
  icon: "h-10 w-10",
  iconSm: "h-8 w-8",
};

const SHAPE_STYLES: Record<ButtonShape, string> = {
  default: "rounded-xl",
  full: "rounded-full",
};

function cx(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

export function buttonClasses(
  options: ButtonStyleOptions = {},
  className?: string,
): string {
  const {
    variant = "secondary",
    size = "md",
    shape = "default",
    fullWidth = false,
    uppercase = false,
  } = options;

  return cx(
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    SHAPE_STYLES[shape],
    fullWidth && "w-full",
    uppercase && "uppercase tracking-widest font-bold",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    shape = "default",
    fullWidth = false,
    uppercase = false,
    type = "button",
    className,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, shape, fullWidth, uppercase }, className)}
      {...props}
    />
  );
});
