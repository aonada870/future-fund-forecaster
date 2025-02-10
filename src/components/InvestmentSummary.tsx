
import { Card } from "@/components/ui/card";
import { InvestmentDataPoint } from "@/lib/investment-utils";
import { InvestmentStream } from "@/lib/types";

interface InvestmentSummaryProps {
  data: InvestmentDataPoint[];
  streams: InvestmentStream[];
}

const InvestmentSummary = ({ data, streams }: InvestmentSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const finalData = data[data.length - 1];
  const totalBalance = finalData.combined;
  const totalContributions = finalData.totalContributions;
  const totalInterest = totalBalance - totalContributions;
  const finalCostOfLiving = finalData.costOfLiving;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">Combined Final Balance</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalBalance)}</p>
        </div>
        
        {streams.map((stream) => (
          <div key={stream.id}>
            <p className="text-sm text-gray-500">{stream.name} Final Balance</p>
            <p className="text-lg font-semibold">
              {formatCurrency(finalData.streams[stream.id])}
            </p>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Contributions</p>
            <p className="text-lg font-semibold">{formatCurrency(totalContributions)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Interest Earned</p>
            <p className="text-lg font-semibold">{formatCurrency(totalInterest)}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Annual Cost of Living</p>
          <p className="text-lg font-semibold text-red-500">{formatCurrency(finalCostOfLiving)}</p>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentSummary;