export interface InvestmentDataPoint {
  age: number;
  balance: number;
  totalContributions: number;
  costOfLiving: number;
}

export interface InvestmentStream {
  id: string;
  name: string;
  principal: number;
  monthlyContribution: number;
  postRetirementContribution: number;
  interestRate: number;
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
    
    // After retirement, subtract cost of living from balance
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

export const calculateCombinedInvestmentGrowth = (
  streams: InvestmentStream[],
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  costOfLiving: number,
  inflationRate: number
): { [key: string]: InvestmentDataPoint[] } => {
  const results: { [key: string]: InvestmentDataPoint[] } = {};
  
  streams.forEach(stream => {
    results[stream.id] = calculateInvestmentGrowth(
      currentAge,
      targetAge,
      lifeExpectancy,
      stream.principal,
      stream.monthlyContribution,
      stream.postRetirementContribution,
      stream.interestRate,
      costOfLiving,
      inflationRate
    );
  });

  // Calculate combined data
  if (streams.length > 0) {
    const combinedData: InvestmentDataPoint[] = [];
    const firstStream = results[streams[0].id];
    
    firstStream.forEach((_, index) => {
      const combinedPoint = {
        age: firstStream[index].age,
        balance: 0,
        totalContributions: 0,
        costOfLiving: firstStream[index].costOfLiving
      };
      
      Object.values(results).forEach(streamData => {
        combinedPoint.balance += streamData[index].balance;
        combinedPoint.totalContributions += streamData[index].totalContributions;
      });
      
      combinedData.push(combinedPoint);
    });
    
    results.combined = combinedData;
  }

  return results;
};