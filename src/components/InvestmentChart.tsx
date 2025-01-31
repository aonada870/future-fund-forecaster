import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { InvestmentDataPoint } from "@/lib/investment-utils";

interface InvestmentChartProps {
  data: { [key: string]: InvestmentDataPoint[] };
}

const COLORS = {
  combined: { stroke: "#0891B2", fill: "#E0F2FE" },
  "1": { stroke: "#2563EB", fill: "#DBEAFE" },
  "2": { stroke: "#7C3AED", fill: "#EDE9FE" },
  "3": { stroke: "#DB2777", fill: "#FCE7F3" },
  "4": { stroke: "#EA580C", fill: "#FFEDD5" },
  "5": { stroke: "#059669", fill: "#D1FAE5" },
  costOfLiving: { stroke: "#EF4444", fill: "#FEE2E2" }
};

const InvestmentChart = ({ data }: InvestmentChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const streamIds = Object.keys(data);
  const firstStreamData = data[streamIds[0]];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Growth Over Time</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={firstStreamData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
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
            {streamIds.map((streamId) => (
              <Area
                key={streamId}
                type="monotone"
                dataKey={(entry) => data[streamId][firstStreamData.indexOf(entry)]?.balance}
                name={streamId === "combined" ? "Combined" : `Investment ${streamId}`}
                stroke={COLORS[streamId as keyof typeof COLORS]?.stroke}
                fill={COLORS[streamId as keyof typeof COLORS]?.fill}
                strokeWidth={2}
              />
            ))}
            <Area
              type="monotone"
              dataKey="costOfLiving"
              name="Cost of Living"
              stroke={COLORS.costOfLiving.stroke}
              fill={COLORS.costOfLiving.fill}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default InvestmentChart;