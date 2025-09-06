import * as React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded ${className || "h-4 w-full"}`} />
);

