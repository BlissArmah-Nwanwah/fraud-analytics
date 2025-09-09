import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 px-3 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-sm",
        "text-black placeholder:text-gray-400 dark:text-white dark:placeholder:text-white/50",
        "focus:outline-none focus:ring-2 focus:ring-purple-500/40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
