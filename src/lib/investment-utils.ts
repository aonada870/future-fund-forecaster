export interface InvestmentDataPoint {
  age: number;
  balance: number;
  totalContributions: number;
  costOfLiving: number;
  streamId?: string; // Added to identify different streams
}

export interface InvestmentStream {
  id: string;
  name: string;
  currentAge: number;
  targetAge: number;
  lifeExpectancy: number;
  principal: number;
  monthlyContribution: number;
  postRetirementContribution: number;
  interestRate: number;
  costOfLiving: number;
  inflationRate: number;
}

export const calculateInvestmentGrowth = (stream: InvestmentStream): InvestmentDataPoint[] => {
  // Input validation with default values
  const validCurrentAge = Math.max(0, stream.currentAge);
  const validTargetAge = Math.max(validCurrentAge + 1, stream.targetAge);
  const validLifeExpectancy = Math.max(validTargetAge + 1, stream.lifeExpectancy);
  const validPrincipal = Math.max(0, stream.principal);
  const validMonthlyContribution = Math.max(0, stream.monthlyContribution);
  const validPostRetirementContribution = Math.max(0, stream.postRetirementContribution);
  const validInterestRate = Math.max(0, stream.interestRate);
  const validCostOfLiving = Math.max(0, stream.costOfLiving);
  const validInflationRate = Math.max(0, stream.inflationRate);

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
      costOfLiving: Math.round(adjustedCostOfLiving),
      streamId: stream.id
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
      costOfLiving: validCostOfLiving,
      streamId: stream.id
    });
  }

  return data;
};

export const combineInvestmentData = (streams: InvestmentStream[]): InvestmentDataPoint[] => {
  if (!streams.length) return [];

  const allData = streams.flatMap(stream => calculateInvestmentGrowth(stream));
  const ages = [...new Set(allData.map(d => d.age))].sort((a, b) => a - b);

  return ages.map(age => {
    const pointsAtAge = allData.filter(d => d.age === age);
    return {
      age,
      balance: pointsAtAge.reduce((sum, p) => sum + p.balance, 0),
      totalContributions: pointsAtAge.reduce((sum, p) => sum + p.totalContributions, 0),
      costOfLiving: pointsAtAge.reduce((sum, p) => sum + p.costOfLiving, 0)
    };
  });
};