export interface InvestmentDataPoint {
  age: number;
  balance: number;
  totalContributions: number;
  costOfLiving: number;
}

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  principal: number,
  monthlyContribution: number,
  postRetirementContribution: number,
  interestRate: number,
  costOfLiving: number,
  inflationRate: number,
  taxRate: number // Keeping parameter for backward compatibility
): InvestmentDataPoint[] => {
  // Input validation
  if (currentAge >= targetAge || targetAge >= lifeExpectancy) {
    // Return initial state if invalid parameters
    return [{
      age: currentAge,
      balance: principal,
      totalContributions: principal,
      costOfLiving: costOfLiving
    }];
  }

  const yearlyContribution = monthlyContribution * 12;
  const yearlyPostRetirementContribution = postRetirementContribution * 12;
  const years = lifeExpectancy - currentAge;
  const data: InvestmentDataPoint[] = [];
  let balance = principal;
  let totalContributions = principal;
  let adjustedCostOfLiving = costOfLiving;

  for (let i = 0; i <= years; i++) {
    const currentAge_i = currentAge + i;
    
    // After retirement, subtract cost of living
    if (currentAge_i > targetAge) {
      balance = Math.max(0, balance - adjustedCostOfLiving);
    }

    data.push({
      age: currentAge_i,
      balance: Math.max(0, Math.round(balance)),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving)
    });

    // Apply interest and contributions
    balance = balance * (1 + interestRate / 100);
    if (currentAge_i <= targetAge) {
      balance += yearlyContribution;
      totalContributions += yearlyContribution;
    } else {
      balance += yearlyPostRetirementContribution;
      totalContributions += yearlyPostRetirementContribution;
    }
    
    // Adjust cost of living for inflation
    adjustedCostOfLiving = adjustedCostOfLiving * (1 + inflationRate / 100);
  }

  return data;
};