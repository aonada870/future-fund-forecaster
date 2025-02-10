
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { InvestmentDataPoint } from "@/lib/investment-utils";
import { InvestmentStream } from "@/lib/types";

interface InvestmentChartProps {
  data: InvestmentDataPoint[];
  streams: InvestmentStream[];
}

const colors = [
  "#0891B2",
  "#8B5CF6",
  "#F97316",
  "#D946EF",
  "#1EAEDB",
  "#6E59A5",
];

const InvestmentChart = ({ data, streams }: InvestmentChartProps) => {
  const [showCombined, setShowCombined] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Investment Growth Over Time</h3>
        <Toggle
          pressed={showCombined}
          onPressedChange={setShowCombined}
        >
          {showCombined ? "Show Individual Streams" : "Show Combined"}
        </Toggle>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "combined"
                  ? "Combined Investment Balance"
                  : name === "costOfLiving"
                  ? "Cost of Living"
                  : streams.find(s => s.id === name)?.name || name
              ]}
              labelFormatter={(label) => `Age ${label}`}
            />
            
            {!showCombined && streams.map((stream, index) => (
              <Area
                key={stream.id}
                type="monotone"
                dataKey={`streams.${stream.id}`}
                name={stream.id}
                stroke={colors[index % colors.length]}
                fill={`${colors[index % colors.length]}33`}
                strokeWidth={2}
              />
            ))}

            {showCombined && (
              <Area
                type="monotone"
                dataKey="combined"
                name="combined"
                stroke="#0891B2"
                fill="#E0F2FE"
                strokeWidth={2}
              />
            )}

            <Area
              type="monotone"
              dataKey="costOfLiving"
              name="costOfLiving"
              stroke="#EF4444"
              fill="#FEE2E2"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default InvestmentChart;