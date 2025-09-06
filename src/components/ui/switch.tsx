import * as React from "react";

export const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
    className={`inline-flex items-center h-6 w-10 rounded-full transition ${checked ? "bg-purple-600" : "bg-gray-300 dark:bg-white/10"}`}
  >
    <span
      className={`inline-block h-5 w-5 bg-white rounded-full transform transition ${checked ? "translate-x-5" : "translate-x-0.5"}`}
    />
  </button>
);

