import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlertsQuery } from "@/api/dashboardApi";

const Activities: React.FC = () => {
  const { data: initialAlerts } = useAlertsQuery();
  const [alerts, setAlerts] = useState(initialAlerts || []);

  useEffect(() => { if (initialAlerts) setAlerts(initialAlerts); }, [initialAlerts]);

  useEffect(() => {
    const id = setInterval(() => {
      setAlerts((prev) => [{
        id: `al_${Math.random().toString(36).slice(2, 7)}`,
        message: "New suspicious pattern detected",
        timestamp: new Date().toISOString(),
        severity: (Math.random() < 0.5 ? "medium" : "high") as any,
      }, ...prev].slice(0, 40));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const perMinute = alerts.reduce<Record<string, number>>((acc, a) => {
    const key = new Date(a.timestamp).toTimeString().slice(0, 5);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Live Alerts</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 max-h-[520px] overflow-auto">
            {alerts.map((a) => (
              <li key={a.id} className="flex items-center justify-between p-3 rounded border border-gray-200 dark:border-white/10">
                <div>
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleTimeString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${a.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.severity.toUpperCase()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Alerts / Minute</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(perMinute).slice(-12).map(([m, c]) => (
              <div key={m} className="flex items-center gap-2">
                <span className="w-12 text-xs text-gray-500">{m}</span>
                <div className="flex-1 h-2 bg-purple-600/20 rounded">
                  <div className="h-2 bg-purple-600 rounded" style={{ width: `${Math.min(100, c * 10)}%` }} />
                </div>
                <span className="w-8 text-xs">{c}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;

