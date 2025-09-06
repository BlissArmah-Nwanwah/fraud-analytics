import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { setDateRange, setProvider, setRegion } from "@/app/slices/filtersSlice";
import { useLogoutMutation } from "@/api/authApi";
import { useToast } from "@/components/ui/toast";
import type { RootState } from "@/app/rootReducer";
import { useTheme } from "@/context/ThemeContext";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { region, provider } = useSelector((s: RootState) => s.filters);
  const { theme, toggle } = useTheme();
  const [logout] = useLogoutMutation();
  const { show } = useToast();

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-white/80 dark:bg-[#0b0b0f]/80 backdrop-blur border-b border-gray-200 dark:border-white/10 md:pl-64">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
          <Input type="date" onChange={(e) => dispatch(setDateRange({ from: e.target.value || null, to: null }))} />
          <label className="text-xs text-gray-500 dark:text-gray-400">Region</label>
          <Select value={region || ""} onChange={(v) => dispatch(setRegion(v || null))} options={["", "Greater Accra", "Ashanti", "Western", "Eastern", "Northern", "Volta", "Central", "Bono East"]} />
          <label className="text-xs text-gray-500 dark:text-gray-400">Provider</label>
          <Select value={provider || ""} onChange={(v) => dispatch(setProvider(v || null))} options={["", "MTN", "Vodafone", "AirtelTigo", "Zeepay"]} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={toggle}>{theme === "dark" ? "Light" : "Dark"} Mode</Button>
          <Button variant="outline" onClick={async () => { await logout().unwrap(); show({ title: "Logged out" }); }}>Logout</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
