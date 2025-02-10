
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { calculateInvestmentGrowth } from "@/lib/investment-utils";
import { Calculator, Clock, DollarSign } from "lucide-react";

export const InvestmentCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetAge, setTargetAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(105);
  const [principal, setPrincipal] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [postRetirementContribution, setPostRetirementContribution] = useState(0);
  const [interestRate, setInterestRate] = useState(7);
  const [costOfLiving, setCostOfLiving] = useState(50000);
  const [inflationRate, setInflationRate] = useState(3);

  const investmentData = calculateInvestmentGrowth(
    currentAge,
    targetAge,
    lifeExpectancy,
    principal,
    monthlyContribution,
    postRetirementContribution,
    interestRate,
    costOfLiving,
    inflationRate,
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Investment Calculator
      </h1>

      {/* New Summary Section */}
      <Card className="p-6 mb-8 bg-secondary/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border-r border-secondary">
            <div className="flex items-center justify-center mb-2">
              <Calculator className="w-5 h-5 mr-2 text-primary" />
              <h4 className="font-semibold text-lg">Working Years</h4>
            </div>
            <p className="text-2xl font-bold text-primary mb-1">
              {currentAge} to {targetAge}
            </p>
            <p className="text-sm text-gray-600">
              {targetAge - currentAge} years of contributions
            </p>
          </div>

          <div className="text-center p-4 border-r border-secondary">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              <h4 className="font-semibold text-lg">Retirement Years</h4>
            </div>
            <p className="text-2xl font-bold text-primary mb-1">
              {targetAge} to {lifeExpectancy}
            </p>
            <p className="text-sm text-gray-600">
              {lifeExpectancy - targetAge} years of retirement
            </p>
          </div>

          <div className="text-center p-4">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 mr-2 text-primary" />
              <h4 className="font-semibold text-lg">Cost of Living</h4>
            </div>
            <p className="text-2xl font-bold text-primary mb-1">
              {formatCurrency(costOfLiving)}
            </p>
            <p className="text-sm text-gray-600">
              Increasing {inflationRate}% yearly
            </p>
          </div>
        </div>
      </Card>
      
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
              <Label htmlFor="postRetirementContribution">Post-Retirement Monthly Contribution ($)</Label>
              <Input
                id="postRetirementContribution"
                type="number"
                value={postRetirementContribution}
                onChange={(e) => setPostRetirementContribution(Number(e.target.value))}
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
