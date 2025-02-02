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
} => {
  // Calculate total needed at retirement
  const yearsUntilRetirement = targetAge - currentAge;
  const retirementYears = lifeExpectancy - targetAge;
  
  // Calculate future cost of living at retirement
  const futureAnnualCost = costOfLiving * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
  
  // Calculate total needed considering taxes and inflation throughout retirement
  let totalNeeded = 0;
  for (let i = 0; i < retirementYears; i++) {
    const yearCost = futureAnnualCost * Math.pow(1 + inflationRate / 100, i);
    const withTax = yearCost / (1 - taxRate / 100);
    totalNeeded += withTax;
  }

  // Calculate present value of total needed
  const presentValueNeeded = totalNeeded / Math.pow(1 + interestRate / 100, yearsUntilRetirement);
  
  // Calculate required monthly contribution
  const monthlyRate = interestRate / 12 / 100;
  const months = yearsUntilRetirement * 12;
  
  const futureValueOfCurrent = currentBalance * Math.pow(1 + interestRate / 100, yearsUntilRetirement);
  const additionalNeeded = presentValueNeeded - futureValueOfCurrent;
  
  // Using PMT formula
  const requiredMonthly = (additionalNeeded * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
  
  return {
    requiredMonthlyContribution: Math.max(0, requiredMonthly),
    currentContribution: 0, // This will be set by the component
    percentageDifference: 0, // This will be calculated by the component
    yearsUntilDepletion: retirementYears
  };
};