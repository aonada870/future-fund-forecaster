import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { calculateInvestmentGrowth } from "@/lib/investment-utils";

export const InvestmentCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetAge, setTargetAge] = useState(65);
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [interestRate, setInterestRate] = useState(7);
  const [inflation, setInflation] = useState(2.5);

  const investmentData = calculateInvestmentGrowth(
    currentAge,
    targetAge,
    principal,
    monthlyContribution,
    interestRate,
    inflation
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Investment Calculator
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentAge">Current Age</Label>
              <Input
                id="currentAge"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                min={0}
                max={targetAge - 1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAge">Target Age</Label>
              <Input
                id="targetAge"
                type="number"
                value={targetAge}
                onChange={(e) => setTargetAge(Number(e.target.value))}
                min={currentAge + 1}
                max={120}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="principal">Initial Investment ($)</Label>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflation">Annual Inflation Rate (%)</Label>
              <Input
                id="inflation"
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <InvestmentSummary data={investmentData} />
          <InvestmentChart data={investmentData} />
        </div>
      </div>
    </div>
  );
};