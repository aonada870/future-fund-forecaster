import { ContributionFrequency, InvestmentStream } from "./types";

export interface InvestmentDataPoint {
  age: number;
  streams: { [key: string]: number };
  combined: number;
  totalContributions: number;
  costOfLiving: number;
  isFullyDepleted?: boolean;
}

export interface RequiredContributionResult {
  stream: InvestmentStream;
  requiredContribution: number;
  extendedRetirementAge?: number;
  currentDepletionAge?: number;
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

const withdrawFromStreams = (
  streams: InvestmentStream[],
  streamBalances: { [key: string]: number },
  requiredWithdrawal: number
): { 
  newBalances: { [key: string]: number },
  remainingWithdrawal: number 
} => {
  // Filter active streams
  const activeStreams = streams.filter(stream => stream.isActive);
  
  // Sort streams by withdrawal order
  const sortedStreams = [...activeStreams].sort((a, b) => {
    if (a.withdrawalOrder === b.withdrawalOrder) {
      // If same order, prefer withdrawing from lower interest rate
      return a.interestRate - b.interestRate;
    }
    return a.withdrawalOrder - b.withdrawalOrder;
  });

  let remainingWithdrawal = requiredWithdrawal;
  const newBalances = { ...streamBalances };

  // Group streams by withdrawal order
  const streamsByOrder: { [order: number]: InvestmentStream[] } = {};
  sortedStreams.forEach(stream => {
    if (!streamsByOrder[stream.withdrawalOrder]) {
      streamsByOrder[stream.withdrawalOrder] = [];
    }
    streamsByOrder[stream.withdrawalOrder].push(stream);
  });

  // Process each withdrawal order group
  for (const order of Object.keys(streamsByOrder).map(Number)) {
    const streamsInOrder = streamsByOrder[order];
    if (remainingWithdrawal <= 0) break;

    if (streamsInOrder.length === 1) {
      // Single stream in this order - withdraw directly
      const stream = streamsInOrder[0];
      const available = newBalances[stream.id];
      const withdrawal = Math.min(available, remainingWithdrawal);
      newBalances[stream.id] = available - withdrawal;
      remainingWithdrawal -= withdrawal;
    } else {
      // Multiple streams with same order - withdraw proportionally
      const totalBalance = streamsInOrder.reduce((sum, s) => sum + newBalances[s.id], 0);
      if (totalBalance <= 0) continue;

      // Sort by interest rate for rounding preference
      streamsInOrder.sort((a, b) => a.interestRate - b.interestRate);

      let remainingForGroup = Math.min(totalBalance, remainingWithdrawal);
      
      // Handle all streams except the last one
      for (let i = 0; i < streamsInOrder.length - 1; i++) {
        const stream = streamsInOrder[i];
        const proportion = newBalances[stream.id] / totalBalance;
        const withdrawal = Math.floor(remainingForGroup * proportion);
        newBalances[stream.id] -= withdrawal;
        remainingForGroup -= withdrawal;
      }

      // Last stream takes any remaining amount (handling rounding)
      const lastStream = streamsInOrder[streamsInOrder.length - 1];
      const lastStreamWithdrawal = Math.min(newBalances[lastStream.id], remainingForGroup);
      newBalances[lastStream.id] -= lastStreamWithdrawal;
      remainingWithdrawal -= (remainingWithdrawal - remainingForGroup) + lastStreamWithdrawal;
    }
  }

  return { newBalances, remainingWithdrawal };
};

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  streams: InvestmentStream[],
  costOfLiving: number,
  inflationRate: number,
): InvestmentDataPoint[] => {
  // Filter active streams
  const activeStreams = streams.filter(stream => stream.isActive);
  
  // If no active streams, return empty data
  if (activeStreams.length === 0) {
    return [{
      age: currentAge,
      streams: {},
      combined: 0,
      totalContributions: 0,
      costOfLiving: costOfLiving
    }];
  }

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
  
  // Initialize starting values for active streams only
  activeStreams.forEach(stream => {
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

    // Check if fully depleted
    const isFullyDepleted = isRetired && combinedBalance <= 0;

    // Store current year's data
    data.push({
      age,
      streams: { ...streamBalances },
      combined: Math.round(combinedBalance),
      totalContributions: Math.round(totalContributions),
      costOfLiving: Math.round(adjustedCostOfLiving),
      isFullyDepleted
    });

    if (age === lifeExpectancy) break;

    if (isRetired && !isFullyDepleted) {
      // Handle withdrawals according to order
      const { newBalances } = withdrawFromStreams(
        activeStreams,
        streamBalances,
        adjustedCostOfLiving
      );
      streamBalances = newBalances;
    }

    // Calculate next year's values for each active stream
    activeStreams.forEach(stream => {
      const r = stream.interestRate / 100;
      const baseRate = 1 + r/n;
      
      const contribution = isRetired 
        ? getAnnualContribution(stream.postRetirementAmount, stream.postRetirementFrequency) / 12
        : getAnnualContribution(stream.contributionAmount, stream.contributionFrequency) / 12;

      const t = 1; // One year at a time
      const power = Math.pow(baseRate, n * t);
      const futureValue = streamBalances[stream.id] * power + 
                         (contribution * (power - 1) / (r/n));

      streamBalances[stream.id] = Math.max(0, futureValue);
      streamContributions[stream.id] += contribution * 12;
    });

    // Adjust cost of living for inflation
    adjustedCostOfLiving *= (1 + inflationRate / 100);
  }

  return data;
};

export const calculateRequiredContribution = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  streams: InvestmentStream[],
  costOfLiving: number,
  inflationRate: number,
  maxMonthlyContribution = 10000 // Maximum reasonable monthly contribution
): RequiredContributionResult => {
  const activeStreams = streams.filter(stream => stream.isActive);
  if (activeStreams.length === 0) {
    return null;
  }

  // Find target stream (last in withdrawal order, highest interest rate, highest principal)
  const targetStream = [...activeStreams].sort((a, b) => {
    if (a.withdrawalOrder !== b.withdrawalOrder) {
      return b.withdrawalOrder - a.withdrawalOrder;
    }
    if (a.interestRate !== b.interestRate) {
      return b.interestRate - a.interestRate;
    }
    return b.principal - a.principal;
  })[0];

  // Find current depletion age
  const baseProjection = calculateInvestmentGrowth(
    currentAge,
    targetAge,
    lifeExpectancy,
    streams,
    costOfLiving,
    inflationRate
  );

  const currentDepletionAge = baseProjection.findIndex(point => point.isFullyDepleted);
  
  if (currentDepletionAge === -1) {
    // No depletion occurs, no additional contribution needed
    return {
      stream: targetStream,
      requiredContribution: 0,
      currentDepletionAge: null
    };
  }

  // Binary search for required contribution
  let low = 0;
  let high = maxMonthlyContribution * 12; // Convert to annual
  let bestContribution = high;
  let extendedRetirementAge = null;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const testStreams = streams.map(s => 
      s.id === targetStream.id 
        ? { ...s, contributionAmount: mid / 12 } // Convert back to monthly for testing
        : s
    );

    const projection = calculateInvestmentGrowth(
      currentAge,
      targetAge,
      lifeExpectancy,
      testStreams,
      costOfLiving,
      inflationRate
    );

    const depletes = projection.some(point => point.isFullyDepleted);

    if (depletes) {
      low = mid + 1;
    } else {
      bestContribution = mid;
      high = mid - 1;
    }
  }

  // If contribution is unreasonably high, calculate extended retirement age
  if (bestContribution >= maxMonthlyContribution * 12) {
    for (let newTargetAge = targetAge + 1; newTargetAge < lifeExpectancy; newTargetAge++) {
      const projection = calculateInvestmentGrowth(
        currentAge,
        newTargetAge,
        lifeExpectancy,
        streams,
        costOfLiving,
        inflationRate
      );

      if (!projection.some(point => point.isFullyDepleted)) {
        extendedRetirementAge = newTargetAge;
        break;
      }
    }
  }

  return {
    stream: targetStream,
    requiredContribution: bestContribution / 12, // Convert back to monthly
    extendedRetirementAge,
    currentDepletionAge: currentDepletionAge + currentAge
  };
};