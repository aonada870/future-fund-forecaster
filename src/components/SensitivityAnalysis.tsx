import { Card } from "@/components/ui/card";

interface SensitivityAnalysisProps {
  sensitivityData: {
    contribution: number;
    yearsUntilDepletion: number;
    scenario: string;
  }[];
}

const SensitivityAnalysis = ({ sensitivityData }: SensitivityAnalysisProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'Conservative': return '#EF4444';
      case 'Base': return '#0891B2';
      case 'Optimistic': return '#10B981';
      default: return '#0891B2';
    }
  };

  // If sensitivityData is undefined or empty, show a message
  if (!sensitivityData || sensitivityData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contribution Sensitivity Analysis</h3>
        <p className="text-sm text-gray-500">
          No sensitivity data available. Please calculate required contribution first.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Contribution Sensitivity Analysis</h3>
      <div className="space-y-6">
        {sensitivityData.map((scenario) => (
          <div key={scenario.scenario} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium" style={{ color: getScenarioColor(scenario.scenario) }}>
                {scenario.scenario} Scenario
              </p>
              <p className="text-sm font-mono">
                {formatCurrency(scenario.contribution)} / month
              </p>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Years until depletion:</span>
              <span>{scenario.yearsUntilDepletion} years</span>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <p className="text-sm">
            This analysis shows how different contribution levels affect your retirement timeline.
            The base scenario uses your target returns, while conservative and optimistic scenarios
            adjust the contribution by ±20%.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SensitivityAnalysis;