import { Card } from "@/components/ui/card";
import { InvestmentDataPoint } from "@/lib/investment-utils";

interface InvestmentSummaryProps {
  data: { [key: string]: InvestmentDataPoint[] };
}

const InvestmentSummary = ({ data }: InvestmentSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const streamIds = Object.keys(data);
  const summaries = streamIds.map(streamId => {
    const streamData = data[streamId];
    const finalData = streamData[streamData.length - 1];
    return {
      id: streamId,
      name: streamId === "combined" ? "Combined" : `Investment ${streamId}`,
      balance: finalData.balance,
      totalContributions: finalData.totalContributions,
      totalInterest: finalData.balance - finalData.totalContributions,
      costOfLiving: finalData.costOfLiving
    };
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
      <div className="space-y-6">
        {summaries.map((summary) => (
          <div key={summary.id} className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{summary.name} - Final Balance</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(summary.balance)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Contributions</p>
                <p className="text-lg font-semibold">{formatCurrency(summary.totalContributions)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Interest Earned</p>
                <p className="text-lg font-semibold">{formatCurrency(summary.totalInterest)}</p>
              </div>
            </div>
            {summary.id === streamIds[0] && (
              <div>
                <p className="text-sm text-gray-500">Final Annual Cost of Living</p>
                <p className="text-lg font-semibold text-red-500">{formatCurrency(summary.costOfLiving)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InvestmentSummary;