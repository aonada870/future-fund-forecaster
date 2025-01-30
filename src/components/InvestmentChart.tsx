import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { InvestmentDataPoint } from "@/lib/investment-utils";

interface InvestmentChartProps {
  data: InvestmentDataPoint[];
}

const InvestmentChart = ({ data }: InvestmentChartProps) => {
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
              formatter={(value: number) => [formatCurrency(value), "Balance"]}
              labelFormatter={(label) => `Age ${label}`}
            />
            <Area
              type="monotone"
              dataKey="balance"
              name="Nominal Balance"
              stroke="#0891B2"
              fill="#E0F2FE"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="inflationAdjustedBalance"
              name="Inflation-Adjusted Balance"
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