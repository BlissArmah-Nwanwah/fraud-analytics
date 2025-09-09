import * as React from "react";

export const Switch: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}> = ({ checked, onChange, label }) => (
  <label
    className={`inline-flex items-center h-6 w-10 rounded-full transition ${
      checked ? "bg-purple-600" : "bg-gray-300 dark:bg-white/10"
    }`}
  >
    <input
      type="checkbox"
      role="switch"
      className="sr-only"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={label ?? (checked ? "On" : "Off")}
    />
    <span
      aria-hidden="true"
      className={`inline-block h-5 w-5 bg-white rounded-full transform transition ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </label>
);
