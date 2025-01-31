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

  const uniqueStreams = [...new Set(data.map(d => d.streamId))];
  const colors = ['#0891B2', '#2563EB', '#7C3AED', '#DB2777', '#DC2626'];

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
                name.includes("balance") ? "Investment Balance" : "Cost of Living"
              ]}
              labelFormatter={(label) => `Age ${label}`}
            />
            {uniqueStreams.length === 1 || !data[0]?.streamId ? (
              <>
                <Area
                  type="monotone"
                  dataKey="balance"
                  name="Investment Balance"
                  stroke="#0891B2"
                  fill="#E0F2FE"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="costOfLiving"
                  name="Cost of Living"
                  stroke="#EF4444"
                  fill="#FEE2E2"
                  strokeWidth={2}
                />
              </>
            ) : (
              uniqueStreams.map((streamId, index) => (
                <Area
                  key={streamId}
                  type="monotone"
                  dataKey="balance"
                  name={`Investment Balance ${index + 1}`}
                  stroke={colors[index % colors.length]}
                  fill={`${colors[index % colors.length]}33`}
                  strokeWidth={2}
                  data={data.filter(d => d.streamId === streamId)}
                />
              ))
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default InvestmentChart;