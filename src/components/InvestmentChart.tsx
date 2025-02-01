import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { InvestmentDataPoint, InvestmentStream } from "@/lib/investment-utils";

interface InvestmentChartProps {
  data: InvestmentDataPoint[];
  streams: InvestmentStream[];
}

const STREAM_COLORS = [
  { stroke: "#0891B2", fill: "#E0F2FE" }, // cyan
  { stroke: "#059669", fill: "#DCFCE7" }, // emerald
  { stroke: "#7C3AED", fill: "#EDE9FE" }, // violet
  { stroke: "#DB2777", fill: "#FCE7F3" }, // pink
  { stroke: "#D97706", fill: "#FEF3C7" }, // amber
];

const InvestmentChart = ({ data, streams }: InvestmentChartProps) => {
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
                name === "Total Balance" ? "Total Portfolio" :
                name === "costOfLiving" ? "Cost of Living" :
                streams.find(s => s.id === name)?.name || name
              ]}
              labelFormatter={(label) => `Age ${label}`}
            />
            {/* Individual streams */}
            {streams.map((stream, index) => (
              <Area
                key={stream.id}
                type="monotone"
                dataKey={`streams.${stream.id}`}
                name={stream.id}
                stroke={STREAM_COLORS[index % STREAM_COLORS.length].stroke}
                fill={STREAM_COLORS[index % STREAM_COLORS.length].fill}
                strokeWidth={1}
                fillOpacity={0.3}
              />
            ))}
            {/* Total balance */}
            <Area
              type="monotone"
              dataKey="totalBalance"
              name="Total Balance"
              stroke="#0891B2"
              fill="#E0F2FE"
              strokeWidth={2}
            />
            {/* Cost of living */}
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