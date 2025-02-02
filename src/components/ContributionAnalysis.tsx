import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ContributionAnalysisProps {
  requiredMonthlyContribution: number;
  currentContribution: number;
  yearsUntilDepletion: number;
}

const ContributionAnalysis = ({
  requiredMonthlyContribution,
  currentContribution,
  yearsUntilDepletion
}: ContributionAnalysisProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const percentageDifference = ((currentContribution - requiredMonthlyContribution) / requiredMonthlyContribution) * 100;
  const progressValue = Math.min(100, (currentContribution / requiredMonthlyContribution) * 100);
  
  const getStatusColor = () => {
    if (percentageDifference >= 0) return "text-green-500";
    if (percentageDifference >= -20) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Contribution Analysis</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Required Monthly Contribution</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(requiredMonthlyContribution)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Current vs Required</p>
          <Progress value={progressValue} className="mt-2" />
          <p className={`text-sm font-medium mt-1 ${getStatusColor()}`}>
            {percentageDifference >= 0 ? "On Track" : `${Math.abs(percentageDifference).toFixed(1)}% Below Target`}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Portfolio Sustainability</p>
          <p className="text-lg font-semibold">
            {yearsUntilDepletion} years until depletion
          </p>
        </div>

        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <p className="text-sm">
            This calculation considers your retirement timeline, expected returns, inflation,
            and tax implications to determine the monthly contribution needed to maintain
            your desired lifestyle throughout retirement.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ContributionAnalysis;