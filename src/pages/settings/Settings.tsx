import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useProfileQuery, useUpdateProfileMutation } from "@/api/userApi";
import { useTheme } from "@/context/ThemeContext";

const Settings: React.FC = () => {
  const { data: profile } = useProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const { theme, set } = useTheme();
  const [twoFA, setTwoFA] = useState(!!profile?.twoFAEnabled);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input defaultValue={profile?.name} placeholder="Name" />
          <Input defaultValue={profile?.email} placeholder="Email" />
          <Input type="password" placeholder="New Password" />
          <Button className="md:col-span-2 w-full">Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch checked={theme === "dark"} onChange={(v) => set(v ? "dark" : "light")} />
          </div>
          <div className="flex items-center justify-between">
            <span>Default Region</span>
            <Input placeholder="e.g., Greater Accra" className="max-w-xs" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Two-Factor Authentication</span>
            <Switch checked={twoFA} onChange={setTwoFA} />
          </div>
          <Button variant="outline" onClick={() => updateProfile({ twoFAEnabled: twoFA })}>Update Security</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

