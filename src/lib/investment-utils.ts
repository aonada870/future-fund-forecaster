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
  inflationRate: number
): InvestmentDataPoint[] => {
  // Input validation with default values
  const validCurrentAge = Math.max(0, currentAge);
  const validTargetAge = Math.max(validCurrentAge + 1, targetAge);
  const validLifeExpectancy = Math.max(validTargetAge + 1, lifeExpectancy);
  const validPrincipal = Math.max(0, principal);
  const validMonthlyContribution = Math.max(0, monthlyContribution);
  const validPostRetirementContribution = Math.max(0, postRetirementContribution);
  const validInterestRate = Math.max(0, interestRate);
  const validCostOfLiving = Math.max(0, costOfLiving);
  const validInflationRate = Math.max(0, inflationRate);

  const yearlyContribution = validMonthlyContribution * 12;
  const yearlyPostRetirementContribution = validPostRetirementContribution * 12;
  const years = validLifeExpectancy - validCurrentAge;
  const data: InvestmentDataPoint[] = [];
  let balance = validPrincipal;
  let totalContributions = validPrincipal;
  let adjustedCostOfLiving = validCostOfLiving;

  for (let i = 0; i <= years; i++) {
    const currentAge_i = validCurrentAge + i;
    
    // After retirement, subtract cost of living from balance
    if (currentAge_i > validTargetAge) {
      balance = Math.max(0, balance - adjustedCostOfLiving);
    }

    data.push({
      age: currentAge_i,
      balance: Math.max(0, Math.round(balance)),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving)
    });

    // Apply interest and contributions
    balance = balance * (1 + validInterestRate / 100);
    if (currentAge_i <= validTargetAge) {
      balance += yearlyContribution;
      totalContributions += yearlyContribution;
    } else {
      balance += yearlyPostRetirementContribution;
      totalContributions += yearlyPostRetirementContribution;
    }
    
    // Adjust cost of living for inflation
    adjustedCostOfLiving = adjustedCostOfLiving * (1 + validInflationRate / 100);
  }

  // Ensure we always return at least one data point
  if (data.length === 0) {
    data.push({
      age: validCurrentAge,
      balance: validPrincipal,
      totalContributions: validPrincipal,
      costOfLiving: validCostOfLiving
    });
  }

  return data;
};