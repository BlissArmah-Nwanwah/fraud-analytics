import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Kpi: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card>
    <CardHeader>
      <CardTitle>{label}</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-purple-700 dark:text-purple-300">
      {value}
    </CardContent>
  </Card>
);

export default Kpi;
