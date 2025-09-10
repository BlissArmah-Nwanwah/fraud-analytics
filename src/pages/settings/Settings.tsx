import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUpdateProfileMutation } from "@/api/userApi";
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/rootReducer";
import { useMeQuery, useUpdateMyProfileMutation } from "@/api/authApi";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { GhanaRegion } from "@/types/regions";

const Settings: React.FC = () => {
  useMeQuery();
  const authUser = useSelector((s: RootState) => s.auth.user);
  const [updateProfile] = useUpdateProfileMutation();
  const [updateMyProfile, { isLoading: saving }] = useUpdateMyProfileMutation();
  const { theme, set } = useTheme();
  const [twoFA, setTwoFA] = useState(false);
  const [firstName, setFirstName] = useState(authUser?.firstName || "");
  const [lastName, setLastName] = useState(authUser?.lastName || "");
  const [username, setUsername] = useState(authUser?.username || "");
  const [location, setLocation] = useState(authUser?.location || "");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 md:col-span-2">
            {authUser?.avatar ? (
              <img
                src={authUser.avatar}
                alt={authUser.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                {(authUser?.name ?? authUser?.email ?? "U")
                  .split(" ")
                  .slice(0, 2)
                  .map((s) => s[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div className="font-medium">
                {authUser?.name ?? "Unnamed User"}
              </div>
              <div>{authUser?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              First name
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Last name
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Email
            </label>
            <Input
              defaultValue={authUser?.email}
              placeholder="Email"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Username
            </label>
            <Input
              value={username ?? ""}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Location
            </label>
            <Select
              value={location ?? ""}
              onValueChange={(v) => setLocation(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GhanaRegion).map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Role
            </label>
            <Input defaultValue={authUser?.role} placeholder="Role" disabled />
          </div>
          <Button
            className="md:col-span-2 w-full"
            disabled={saving}
            onClick={async () => {
              await updateMyProfile({
                firstName,
                lastName,
                username,
                location,
              }).unwrap();
            }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch
              checked={theme === "dark"}
              onChange={(v) => set(v ? "dark" : "light")}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Default Region</span>
            <Input placeholder="e.g., Greater Accra" className="max-w-xs" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Two-Factor Authentication</span>
            <Switch checked={twoFA} onChange={setTwoFA} />
          </div>
          <Button
            variant="outline"
            onClick={() => updateProfile({ twoFAEnabled: twoFA })}
          >
            Update Security
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
