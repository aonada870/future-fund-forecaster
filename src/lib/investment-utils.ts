
import { ContributionFrequency, InvestmentStream } from "./types";

export interface InvestmentDataPoint {
  age: number;
  streams: { [key: string]: number };
  combined: number;
  totalContributions: number;
  costOfLiving: number;
}

const getAnnualContribution = (amount: number, frequency: ContributionFrequency): number => {
  const frequencyMultipliers: { [key in ContributionFrequency]: number } = {
    weekly: 52,
    fortnightly: 26,
    monthly: 12,
    quarterly: 4,
    yearly: 1
  };
  return amount * frequencyMultipliers[frequency];
};

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  streams: InvestmentStream[],
  costOfLiving: number,
  inflationRate: number,
): InvestmentDataPoint[] => {
  if (currentAge >= targetAge || targetAge >= lifeExpectancy) {
    return [{
      age: currentAge,
      streams: {},
      combined: 0,
      totalContributions: 0,
      costOfLiving: costOfLiving
    }];
  }

  const data: InvestmentDataPoint[] = [];
  const n = 12; // Monthly compounding

  // Initialize tracking variables for each stream
  let streamBalances: { [key: string]: number } = {};
  let streamContributions: { [key: string]: number } = {};
  
  // Initialize starting values
  streams.forEach(stream => {
    streamBalances[stream.id] = stream.principal;
    streamContributions[stream.id] = stream.principal;
  });

  let adjustedCostOfLiving = costOfLiving;

  // Calculate for each year
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const isRetired = age >= targetAge;
    
    // Calculate combined values
    const combinedBalance = Object.values(streamBalances).reduce((sum, val) => sum + val, 0);
    const totalContributions = Object.values(streamContributions).reduce((sum, val) => sum + val, 0);

    // Store current year's data
    data.push({
      age,
      streams: { ...streamBalances },
      combined: Math.round(combinedBalance),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving)
    });

    if (age === lifeExpectancy) break;

    // Calculate next year's values for each stream
    streams.forEach(stream => {
      const r = stream.interestRate / 100;
      const baseRate = 1 + r/n;
      
      const contribution = isRetired 
        ? getAnnualContribution(stream.postRetirementAmount, stream.postRetirementFrequency) / 12
        : getAnnualContribution(stream.contributionAmount, stream.contributionFrequency) / 12;

      const t = 1; // One year at a time
      const power = Math.pow(baseRate, n * t);
      const futureValue = streamBalances[stream.id] * power + 
                         (contribution * (power - 1) / (r/n));

      if (isRetired) {
        // Calculate proportion of cost of living to withdraw from this stream
        const proportion = streamBalances[stream.id] / combinedBalance;
        const withdrawal = adjustedCostOfLiving * proportion;
        
        streamBalances[stream.id] = Math.max(0, futureValue - withdrawal);
        streamContributions[stream.id] += contribution * 12;
      } else {
        streamBalances[stream.id] = futureValue;
        streamContributions[stream.id] += contribution * 12;
      }
    });

    // Adjust cost of living for inflation
    adjustedCostOfLiving *= (1 + inflationRate / 100);
  }

  return data;
};