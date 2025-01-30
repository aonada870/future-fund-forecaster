export interface InvestmentDataPoint {
  age: number;
  balance: number;
  totalContributions: number;
  inflationAdjustedBalance: number;
}

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  principal: number,
  monthlyContribution: number,
  interestRate: number,
  inflation: number = 2.5
): InvestmentDataPoint[] => {
  const yearlyContribution = monthlyContribution * 12;
  const years = targetAge - currentAge;
  const data: InvestmentDataPoint[] = [];
  let balance = principal;
  let totalContributions = principal;
  
  for (let i = 0; i <= years; i++) {
    const inflationFactor = Math.pow(1 - inflation / 100, i);
    data.push({
      age: currentAge + i,
      balance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      inflationAdjustedBalance: Math.round(balance * inflationFactor),
    });

    balance = balance * (1 + interestRate / 100) + yearlyContribution;
    totalContributions += yearlyContribution;
  }

  return data;
};