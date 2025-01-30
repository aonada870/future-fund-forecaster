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
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [interestRate, setInterestRate] = useState(7);
  const [costOfLiving, setCostOfLiving] = useState(50000);
  const [inflationRate, setInflationRate] = useState(2.5);

  const investmentData = calculateInvestmentGrowth(
    currentAge,
    targetAge,
    lifeExpectancy,
    principal,
    monthlyContribution,
    interestRate,
    costOfLiving,
    inflationRate
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
              <Label htmlFor="targetAge">Target Retirement Age</Label>
              <Input
                id="targetAge"
                type="number"
                value={targetAge}
                onChange={(e) => setTargetAge(Number(e.target.value))}
                min={currentAge + 1}
                max={lifeExpectancy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
              <Input
                id="lifeExpectancy"
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                min={targetAge + 1}
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
              <Label htmlFor="costOfLiving">Annual Cost of Living ($)</Label>
              <Input
                id="costOfLiving"
                type="number"
                value={costOfLiving}
                onChange={(e) => setCostOfLiving(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflationRate">Annual Inflation Rate (%)</Label>
              <Input
                id="inflationRate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
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