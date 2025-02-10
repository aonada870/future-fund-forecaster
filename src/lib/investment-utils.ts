
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
    return [{
      age: currentAge,
      balance: principal,
      totalContributions: principal,
      costOfLiving: costOfLiving
    }];
  }

  const periodsPerYear = 12; // Monthly contributions
  const monthlyRate = Math.pow(1 + interestRate / 100, 1 / periodsPerYear) - 1;
  const yearlyPostRetirementContribution = postRetirementContribution * 12;
  const years = lifeExpectancy - currentAge;
  const data: InvestmentDataPoint[] = [];
  let balance = principal;
  let totalContributions = principal;
  let adjustedCostOfLiving = costOfLiving;

  for (let i = 0; i <= years; i++) {
    const currentAge_i = currentAge + i;
    
    data.push({
      age: currentAge_i,
      balance: Math.max(0, Math.round(balance)),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving)
    });

    // After retirement, subtract cost of living first
    if (currentAge_i > targetAge) {
      balance = Math.max(0, balance - adjustedCostOfLiving);
    }

    // Calculate compound interest with periodic contributions for the next year
    if (currentAge_i <= targetAge) {
      // Pre-retirement: Apply monthly compounding with monthly contributions
      for (let month = 0; month < periodsPerYear; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        totalContributions += monthlyContribution;
      }
    } else {
      // Post-retirement: Still compound monthly but with post-retirement contributions
      for (let month = 0; month < periodsPerYear; month++) {
        balance = balance * (1 + monthlyRate) + postRetirementContribution;
        totalContributions += postRetirementContribution;
      }
    }
    
    // Adjust cost of living for inflation (annually)
    adjustedCostOfLiving = adjustedCostOfLiving * (1 + inflationRate / 100);
  }

  return data;
};
