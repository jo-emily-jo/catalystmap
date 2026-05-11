import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-9 w-full rounded border border-[--border] bg-[--background] px-3 py-1 text-sm text-[--foreground] transition-colors file:border-0 file:bg-transparent file:text-sm placeholder:text-[--foreground-secondary] focus-visible:outline-none focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
