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

      {/* User Profile Section */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold">
              {(user?.name || user?.email || "U")
                .split(" ")
                .slice(0, 2)
                .map((s) => s[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.username || user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.role || "user"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
