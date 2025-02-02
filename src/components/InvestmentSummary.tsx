import { Card } from "@/components/ui/card";
import { InvestmentDataPoint } from "@/lib/investment-utils";

interface InvestmentSummaryProps {
  data: InvestmentDataPoint[];
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

  const finalData = data[data.length - 1];
  const finalBalance = finalData.totalBalance;
  const totalContributions = finalData.totalContributions;
  const totalInterest = finalBalance - totalContributions;
  const finalCostOfLiving = finalData.costOfLiving;
  const finalTaxPaid = finalData.taxPaid || 0;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Final Balance</p>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Annual Cost of Living</p>
            <p className="text-lg font-semibold text-red-500">{formatCurrency(finalCostOfLiving)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Annual Tax on Withdrawals</p>
            <p className="text-lg font-semibold text-red-500">{formatCurrency(finalTaxPaid)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Investment Streams</p>
          <div className="space-y-2">
            {Object.entries(finalData.streams).map(([id, stream]) => (
              <div key={id} className="flex justify-between items-center">
                <span className="text-sm">{id}</span>
                <span className="text-sm font-semibold">{formatCurrency(stream.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentSummary;