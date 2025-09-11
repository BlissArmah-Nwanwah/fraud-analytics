import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { setDays } from "@/app/slices/filtersSlice";
import { useLogoutMutation, useMeQuery } from "@/api/authApi";
import { useToast } from "@/components/ui/toast";
import type { RootState } from "@/app/rootReducer";
import { useTheme } from "@/context/ThemeContext";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { days } = useSelector((s: RootState) => s.filters);
  // const user = useSelector((s: RootState) => s.auth.user);
  const { theme, toggle } = useTheme();
  const [logout] = useLogoutMutation();
  const { show } = useToast();
  useMeQuery();
  // Note: admin-specific filters removed

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-white/80 dark:bg-[#0b0b0f]/80 backdrop-blur border-b border-gray-200 dark:border-white/10 md:pl-64">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">
            Last
          </label>
          <Select
            value={String(days)}
            onValueChange={(v) => dispatch(setDays(Number(v) || 30))}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={toggle}>
            {theme === "dark" ? "Light" : "Dark"} Mode
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await logout().unwrap();
              show({ title: "Logged out" });
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
