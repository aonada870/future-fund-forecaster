
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

  const data: InvestmentDataPoint[] = [];
  const n = 12; // Monthly compounding
  const r = interestRate / 100; // Convert percentage to decimal
  const baseRate = 1 + r/n; // Cache (1 + r/n)

  let currentBalance = principal;
  let totalContributions = principal;
  let adjustedCostOfLiving = costOfLiving;

  // Calculate for each year from current age to life expectancy
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Store current year's data
    data.push({
      age,
      balance: Math.max(0, Math.round(currentBalance)),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving)
    });

    // If we've reached life expectancy, no need to calculate further
    if (age === lifeExpectancy) break;

    const isRetired = age >= targetAge;
    const contribution = isRetired ? postRetirementContribution : monthlyContribution;
    
    // Calculate years from current point
    const t = 1; // We're calculating one year at a time

    // Calculate Future Value using the formula
    // FV = P * (1 + r/n)^(n*t) + (C * ((1 + r/n)^(n*t) - 1) / (r/n))
    const power = Math.pow(baseRate, n * t);
    const futureValue = currentBalance * power + 
                       (contribution * (power - 1) / (r/n));

    // Update running totals
    if (isRetired) {
      // Subtract cost of living first
      currentBalance = Math.max(0, futureValue - adjustedCostOfLiving);
      // Add post-retirement contributions to total
      totalContributions += postRetirementContribution * 12;
    } else {
      currentBalance = futureValue;
      totalContributions += monthlyContribution * 12;
    }

    // Adjust cost of living for inflation
    adjustedCostOfLiving *= (1 + inflationRate / 100);
  }

  return data;
};
