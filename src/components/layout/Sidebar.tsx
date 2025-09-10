import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { BarChart2, Activity, Map, Settings } from "lucide-react";
import type { RootState } from "@/app/rootReducer";

const items = [
  { to: "/", label: "Overview", icon: BarChart2 },
  { to: "/activities", label: "Activities", icon: Activity },
  { to: "/geography", label: "Geography", icon: Map, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Sidebar: React.FC = () => {
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "admin";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 hidden md:flex flex-col bg-white dark:bg-[#0b0b0f] border-r border-gray-200 dark:border-white/10">
      <div className="h-16 flex items-center px-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        Fraud Analytics
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items
          .filter((item) => !item.adminOnly || isAdmin)
          .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-purple-600/10 text-purple-700 dark:text-purple-300 border border-purple-600/20"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/5"
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
