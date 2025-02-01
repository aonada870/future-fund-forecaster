export interface InvestmentDataPoint {
  age: number;
  balance: number;
  totalContributions: number;
  costOfLiving: number;
}

export interface InvestmentStream {
  id: string;
  principal: number;
  monthlyContribution: number;
  postRetirementContribution: number;
  interestRate: number;
}

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  streams: InvestmentStream[],
  costOfLiving: number,
  inflationRate: number
): InvestmentDataPoint[] => {
  // Input validation with default values
  const validCurrentAge = Math.max(0, currentAge);
  const validTargetAge = Math.max(validCurrentAge + 1, targetAge);
  const validLifeExpectancy = Math.max(validTargetAge + 1, lifeExpectancy);
  const validInflationRate = Math.max(0, inflationRate);
  const validCostOfLiving = Math.max(0, costOfLiving);

  const years = validLifeExpectancy - validCurrentAge;
  const data: InvestmentDataPoint[] = [];
  let adjustedCostOfLiving = validCostOfLiving;

  // Initialize total balance and contributions
  let totalBalance = streams.reduce((sum, stream) => sum + Math.max(0, stream.principal), 0);
  let totalContributions = totalBalance;

  for (let i = 0; i <= years; i++) {
    const currentAge_i = validCurrentAge + i;
    
    // After retirement, subtract cost of living from total balance
    if (currentAge_i > validTargetAge) {
      totalBalance = Math.max(0, totalBalance - adjustedCostOfLiving);
    }

    data.push({
      age: currentAge_i,
      balance: Math.max(0, Math.round(totalBalance)),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving)
    });

    // Calculate growth and contributions for each stream
    streams.forEach(stream => {
      const validInterestRate = Math.max(0, stream.interestRate);
      const validMonthlyContribution = Math.max(0, stream.monthlyContribution);
      const validPostRetirementContribution = Math.max(0, stream.postRetirementContribution);

      // Apply interest to this stream's portion
      const streamBalance = totalBalance * (stream.principal / totalBalance);
      const interestGrowth = streamBalance * (validInterestRate / 100);
      totalBalance += interestGrowth;

      // Add contributions based on retirement status
      if (currentAge_i <= validTargetAge) {
        const yearlyContribution = validMonthlyContribution * 12;
        totalBalance += yearlyContribution;
        totalContributions += yearlyContribution;
      } else {
        const yearlyPostRetirementContribution = validPostRetirementContribution * 12;
        totalBalance += yearlyPostRetirementContribution;
        totalContributions += yearlyPostRetirementContribution;
      }
    });
    
    // Adjust cost of living for inflation
    adjustedCostOfLiving = adjustedCostOfLiving * (1 + validInflationRate / 100);
  }

  return data;
};