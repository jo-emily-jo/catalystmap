import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    className={cn(
      "flex h-9 w-full rounded border border-[--border] bg-[--background] px-3 py-1 text-sm text-[--foreground] focus-visible:outline-none focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };
