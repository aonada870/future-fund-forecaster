export interface InvestmentDataPoint {
  age: number;
  balance: number;
  totalContributions: number;
}

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  principal: number,
  monthlyContribution: number,
  interestRate: number
): InvestmentDataPoint[] => {
  const yearlyContribution = monthlyContribution * 12;
  const years = targetAge - currentAge;
  const data: InvestmentDataPoint[] = [];
  let balance = principal;
  let totalContributions = principal;

  for (let i = 0; i <= years; i++) {
    data.push({
      age: currentAge + i,
      balance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
    });

    balance = balance * (1 + interestRate / 100) + yearlyContribution;
    totalContributions += yearlyContribution;
  }

  return data;
};