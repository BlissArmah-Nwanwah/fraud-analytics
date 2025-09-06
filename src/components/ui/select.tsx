import * as React from "react";
import { cn } from "@/lib/utils";

export const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "h-9 px-3 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-sm",
      "focus:outline-none focus:ring-2 focus:ring-purple-500/40"
    )}
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o || "All"}
      </option>
    ))}
  </select>
);

