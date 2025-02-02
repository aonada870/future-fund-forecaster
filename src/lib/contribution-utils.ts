export const calculateRequiredContribution = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  costOfLiving: number,
  inflationRate: number,
  interestRate: number,
  taxRate: number,
  currentBalance: number
): {
  requiredMonthlyContribution: number;
  currentContribution: number;
  percentageDifference: number;
  yearsUntilDepletion: number;
  sensitivityAnalysis: {
    contribution: number;
    yearsUntilDepletion: number;
    scenario: string;
  }[];
} => {
  const yearsUntilRetirement = targetAge - currentAge;
  const retirementYears = lifeExpectancy - targetAge;
  
  // Calculate future cost of living at retirement
  const futureAnnualCost = costOfLiving * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
  
  // Calculate required retirement portfolio considering investment returns during retirement
  let requiredPortfolio = 0;
  const effectiveRate = (interestRate - inflationRate) / 100; // Real return rate
  
  for (let year = 0; year < retirementYears; year++) {
    const yearCost = futureAnnualCost * Math.pow(1 + inflationRate / 100, year);
    const withTax = yearCost / (1 - taxRate / 100);
    // Discount future withdrawals by investment returns during retirement
    requiredPortfolio += withTax / Math.pow(1 + effectiveRate, year);
  }

  // Calculate present value needed considering investment returns during accumulation
  const monthlyRate = interestRate / 12 / 100;
  const months = yearsUntilRetirement * 12;
  
  const futureValueOfCurrent = currentBalance * Math.pow(1 + interestRate / 100, yearsUntilRetirement);
  const additionalNeeded = Math.max(0, requiredPortfolio - futureValueOfCurrent);
  
  // Using PMT formula with retirement phase returns consideration
  const requiredMonthly = additionalNeeded === 0 ? 0 :
    (additionalNeeded * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);

  // Calculate sensitivity analysis
  const sensitivityScenarios = [0.8, 1, 1.2]; // -20%, base, +20%
  const sensitivityAnalysis = sensitivityScenarios.map(factor => ({
    contribution: requiredMonthly * factor,
    yearsUntilDepletion: calculateYearsUntilDepletion(
      requiredMonthly * factor,
      currentBalance,
      targetAge,
      lifeExpectancy,
      futureAnnualCost,
      interestRate,
      inflationRate,
      taxRate
    ),
    scenario: factor < 1 ? 'Conservative' : factor > 1 ? 'Optimistic' : 'Base'
  }));
  
  return {
    requiredMonthlyContribution: Math.max(0, requiredMonthly),
    currentContribution: 0, // This will be set by the component
    percentageDifference: 0, // This will be calculated by the component
    yearsUntilDepletion: retirementYears,
    sensitivityAnalysis
  };
};

const calculateYearsUntilDepletion = (
  monthlyContribution: number,
  currentBalance: number,
  targetAge: number,
  lifeExpectancy: number,
  futureAnnualCost: number,
  interestRate: number,
  inflationRate: number,
  taxRate: number
): number => {
  let balance = currentBalance;
  let years = 0;
  const maxYears = lifeExpectancy - targetAge;

  for (let year = 0; year <= maxYears; year++) {
    if (balance <= 0) break;
    
    // Add annual contribution
    balance += monthlyContribution * 12;
    
    // Add investment returns
    balance *= (1 + interestRate / 100);
    
    // Subtract inflation-adjusted withdrawals after retirement
    if (year > 0) {
      const withdrawal = futureAnnualCost * Math.pow(1 + inflationRate / 100, year);
      const withTax = withdrawal / (1 - taxRate / 100);
      balance -= withTax;
    }
    
    years = year;
  }

  return years;
};