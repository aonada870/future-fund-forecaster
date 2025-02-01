export interface InvestmentStream {
  id: string;
  name: string;
  principal: number;
  monthlyContribution: number;
  postRetirementContribution: number;
  interestRate: number;
}

export interface InvestmentDataPoint {
  age: number;
  streams: { [key: string]: number };
  totalBalance: number;
  totalContributions: number;
  costOfLiving: number;
}

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  streams: InvestmentStream[],
  costOfLiving: number,
  inflationRate: number
): InvestmentDataPoint[] => {
  const years = lifeExpectancy - currentAge;
  const data: InvestmentDataPoint[] = [];
  let streamBalances: { [key: string]: number } = {};
  let streamTotalContributions: { [key: string]: number } = {};

  // Initialize balances and contributions
  streams.forEach(stream => {
    streamBalances[stream.id] = stream.principal;
    streamTotalContributions[stream.id] = stream.principal;
  });

  let adjustedCostOfLiving = costOfLiving;

  for (let i = 0; i <= years; i++) {
    const currentAge_i = currentAge + i;
    const isRetired = currentAge_i > targetAge;

    // Calculate total balance before cost of living adjustment
    const totalBalance = Object.values(streamBalances).reduce((a, b) => a + b, 0);
    const totalContributions = Object.values(streamTotalContributions).reduce((a, b) => a + b, 0);

    // After retirement, subtract cost of living from total balance proportionally from each stream
    if (isRetired) {
      const totalBeforeDeduction = totalBalance;
      Object.keys(streamBalances).forEach(streamId => {
        const proportion = streamBalances[streamId] / totalBeforeDeduction;
        streamBalances[streamId] = Math.max(0, streamBalances[streamId] - (adjustedCostOfLiving * proportion));
      });
    }

    // Record data point
    data.push({
      age: currentAge_i,
      streams: { ...streamBalances },
      totalBalance: Math.max(0, Object.values(streamBalances).reduce((a, b) => a + b, 0)),
      totalContributions,
      costOfLiving: adjustedCostOfLiving
    });

    // Apply growth and contributions to each stream
    streams.forEach(stream => {
      streamBalances[stream.id] = streamBalances[stream.id] * (1 + stream.interestRate / 100);
      if (currentAge_i <= targetAge) {
        streamBalances[stream.id] += stream.monthlyContribution * 12;
        streamTotalContributions[stream.id] += stream.monthlyContribution * 12;
      } else {
        streamBalances[stream.id] += stream.postRetirementContribution * 12;
        streamTotalContributions[stream.id] += stream.postRetirementContribution * 12;
      }
    });

    // Adjust cost of living for inflation
    adjustedCostOfLiving = adjustedCostOfLiving * (1 + inflationRate / 100);
  }

  return data;
};