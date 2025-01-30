export interface InvestmentDataPoint {
  age: number;
  balance: number;
  totalContributions: number;
  costOfLiving: number;
}

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  principal: number,
  monthlyContribution: number,
  interestRate: number,
  costOfLiving: number,
  inflationRate: number
): InvestmentDataPoint[] => {
  const yearlyContribution = monthlyContribution * 12;
  const years = targetAge - currentAge;
  const data: InvestmentDataPoint[] = [];
  let balance = principal;
  let totalContributions = principal;
  let adjustedCostOfLiving = costOfLiving;

  for (let i = 0; i <= years; i++) {
    data.push({
      age: currentAge + i,
      balance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving)
    });

    balance = balance * (1 + interestRate / 100) + yearlyContribution;
    totalContributions += yearlyContribution;
    adjustedCostOfLiving = adjustedCostOfLiving * (1 + inflationRate / 100);
  }

  return data;
};