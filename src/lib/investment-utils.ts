export interface InvestmentStream {
  id: string;
  name: string;
  initialBalance: number;
  monthlyContribution: number;
  interestRate: number;
  isTaxable: boolean;
}

export interface InvestmentDataPoint {
  age: number;
  streams: {
    [key: string]: {
      balance: number;
      totalContributions: number;
    };
  };
  totalBalance: number;
  totalContributions: number;
  costOfLiving: number;
  taxPaid?: number;
}

export const calculateInvestmentGrowth = (
  currentAge: number,
  targetAge: number,
  lifeExpectancy: number,
  streams: InvestmentStream[],
  costOfLiving: number,
  inflationRate: number,
  taxRate: number
): InvestmentDataPoint[] => {
  const years = lifeExpectancy - currentAge;
  const data: InvestmentDataPoint[] = [];
  let adjustedCostOfLiving = costOfLiving;

  // Initialize stream balances and contributions
  let streamBalances = streams.reduce((acc, stream) => {
    acc[stream.id] = {
      balance: stream.initialBalance,
      totalContributions: stream.initialBalance
    };
    return acc;
  }, {} as { [key: string]: { balance: number; totalContributions: number } });

  for (let i = 0; i <= years; i++) {
    const currentAge_i = currentAge + i;
    let taxPaid = 0;
    
    // Calculate new balances for each stream
    streamBalances = Object.entries(streamBalances).reduce((acc, [id, current]) => {
      const stream = streams.find(s => s.id === id);
      if (!stream) return acc;

      let balance = current.balance;
      let totalContributions = current.totalContributions;

      // After retirement, handle withdrawals proportionally
      if (currentAge_i > targetAge) {
        const streamShare = balance / Object.values(streamBalances).reduce((sum, s) => sum + s.balance, 0);
        const withdrawalAmount = adjustedCostOfLiving * streamShare;
        
        if (stream.isTaxable) {
          const streamTax = withdrawalAmount * (taxRate / 100);
          taxPaid += streamTax;
          balance = Math.max(0, balance - withdrawalAmount - streamTax);
        } else {
          balance = Math.max(0, balance - withdrawalAmount);
        }
      }

      // Apply interest and contributions
      balance = balance * (1 + stream.interestRate / 100);
      if (currentAge_i <= targetAge) {
        balance += stream.monthlyContribution * 12;
        totalContributions += stream.monthlyContribution * 12;
      }

      acc[id] = { balance, totalContributions };
      return acc;
    }, {} as typeof streamBalances);

    // Calculate totals
    const totalBalance = Object.values(streamBalances).reduce((sum, s) => sum + s.balance, 0);
    const totalContributions = Object.values(streamBalances).reduce((sum, s) => sum + s.totalContributions, 0);

    data.push({
      age: currentAge_i,
      streams: streamBalances,
      totalBalance,
      totalContributions,
      costOfLiving: adjustedCostOfLiving,
      taxPaid
    });

    // Adjust cost of living for inflation
    adjustedCostOfLiving = adjustedCostOfLiving * (1 + inflationRate / 100);
  }

  return data;
};