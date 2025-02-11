
export type ContributionFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly';

export interface InvestmentStream {
  id: string;
  name: string;
  principal: number;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  postRetirementAmount: number;
  postRetirementFrequency: ContributionFrequency;
  interestRate: number;
  withdrawalOrder: number;
  isActive: boolean;
}

