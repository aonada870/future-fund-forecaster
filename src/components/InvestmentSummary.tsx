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

  const finalBalance = data[data.length - 1].balance;
  const finalAdjustedBalance = data[data.length - 1].inflationAdjustedBalance;
  const totalContributions = data[data.length - 1].totalContributions;
  const totalInterest = finalBalance - totalContributions;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nominal Final Balance</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(finalBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Inflation-Adjusted Balance</p>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(finalAdjustedBalance)}</p>
          </div>
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
      </div>
    </Card>
  );
};

export default InvestmentSummary;