import { Card } from "@/components/ui/card";
import { InvestmentDataPoint, InvestmentStream } from "@/lib/investment-utils";

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

  // Handle empty or undefined data
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
        <p className="text-sm text-gray-500">No investment data available</p>
      </Card>
    );
  }

  const finalDataPoint = data[data.length - 1];
  const finalBalance = finalDataPoint.totalBalance;
  const totalContributions = finalDataPoint.totalContributions;
  const totalInterest = finalBalance - totalContributions;
  const finalCostOfLiving = finalDataPoint.costOfLiving;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(finalBalance)}</p>
        </div>

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

        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-medium">Individual Streams</p>
          {streams.map(stream => (
            <div key={stream.id} className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{stream.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {formatCurrency(finalDataPoint.streams[stream.id])}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm text-gray-500">Final Annual Cost of Living</p>
          <p className="text-lg font-semibold text-red-500">{formatCurrency(finalCostOfLiving)}</p>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentSummary;