import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { InvestmentDataPoint } from "@/lib/investment-utils";

interface InvestmentChartProps {
  data: InvestmentDataPoint[];
}

const STREAM_COLORS = [
  "#0891B2", // cyan-600
  "#0D9488", // teal-600
  "#0284C7", // sky-600
  "#2563EB", // blue-600
  "#4F46E5", // indigo-600
  "#7C3AED", // violet-600
  "#9333EA", // purple-600
  "#C026D3", // fuchsia-600
  "#DB2777", // pink-600
  "#E11D48", // rose-600
];

const InvestmentChart = ({ data }: InvestmentChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get all stream IDs from the first data point
  const streamIds = Object.keys(data[0]?.streams || {});

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Growth Over Time</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "costOfLiving" ? "Cost of Living" : name
              ]}
              labelFormatter={(label) => `Age ${label}`}
            />
            {streamIds.map((streamId, index) => (
              <Area
                key={streamId}
                type="monotone"
                dataKey={`streams.${streamId}.balance`}
                name={streamId}
                stroke={STREAM_COLORS[index % STREAM_COLORS.length]}
                fill={STREAM_COLORS[index % STREAM_COLORS.length]}
                fillOpacity={0.1}
                strokeWidth={2}
                stackId="1"
              />
            ))}
            <Area
              type="monotone"
              dataKey="costOfLiving"
              name="Cost of Living"
              stroke="#EF4444"
              fill="#FEE2E2"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default InvestmentChart;