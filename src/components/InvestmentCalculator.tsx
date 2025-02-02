import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlusCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { calculateInvestmentGrowth, InvestmentStream } from "@/lib/investment-utils";

export const InvestmentCalculator = () => {
  const [currentAge, setCurrentAge] = useState(41);
  const [targetAge, setTargetAge] = useState(55);
  const [lifeExpectancy, setLifeExpectancy] = useState(95);
  const [costOfLiving, setCostOfLiving] = useState(57000);
  const [inflationRate, setInflationRate] = useState(3);
  const [taxRate, setTaxRate] = useState(15);
  
  const [streams, setStreams] = useState<InvestmentStream[]>([
    {
      id: "401k",
      name: "401(k)",
      initialBalance: 210000,
      monthlyContribution: 2600,
      interestRate: 7,
      isTaxable: true
    }
  ]);

  const addStream = () => {
    const newStream: InvestmentStream = {
      id: `stream-${streams.length + 1}`,
      name: `Investment ${streams.length + 1}`,
      initialBalance: 0,
      monthlyContribution: 0,
      interestRate: 7,
      isTaxable: true
    };
    setStreams([...streams, newStream]);
  };

  const removeStream = (id: string) => {
    if (streams.length > 1) {
      setStreams(streams.filter(stream => stream.id !== id));
    }
  };

  const updateStream = (id: string, field: keyof InvestmentStream, value: string | number | boolean) => {
    setStreams(streams.map(stream => 
      stream.id === id ? { ...stream, [field]: value } : stream
    ));
  };

  const investmentData = calculateInvestmentGrowth(
    currentAge,
    targetAge,
    lifeExpectancy,
    streams,
    costOfLiving,
    inflationRate,
    taxRate
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Investment Calculator
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate on Withdrawals (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min={0}
                  max={100}
                  step={0.1}
                />
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Investment Streams</h3>
              <Button onClick={addStream} variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Stream
              </Button>
            </div>
            
            {streams.map((stream) => (
              <Collapsible key={stream.id}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Input
                      value={stream.name}
                      onChange={(e) => updateStream(stream.id, 'name', e.target.value)}
                      className="max-w-[200px]"
                    />
                    <div className="flex gap-2">
                      {streams.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeStream(stream.id)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Initial Balance ($)</Label>
                        <Input
                          type="number"
                          value={stream.initialBalance}
                          onChange={(e) => updateStream(stream.id, 'initialBalance', Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Contribution ($)</Label>
                        <Input
                          type="number"
                          value={stream.monthlyContribution}
                          onChange={(e) => updateStream(stream.id, 'monthlyContribution', Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Interest Rate (%)</Label>
                        <Input
                          type="number"
                          value={stream.interestRate}
                          onChange={(e) => updateStream(stream.id, 'interestRate', Number(e.target.value))}
                          min={0}
                          max={100}
                          step={0.1}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`taxable-${stream.id}`}
                          checked={stream.isTaxable}
                          onChange={(e) => updateStream(stream.id, 'isTaxable', e.target.checked)}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`taxable-${stream.id}`}>Taxable on Withdrawal</Label>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <InvestmentSummary data={investmentData} />
          <InvestmentChart data={investmentData} />
        </div>
      </div>
    </div>
  );
};