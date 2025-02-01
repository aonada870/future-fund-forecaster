import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { calculateInvestmentGrowth, InvestmentStream } from "@/lib/investment-utils";

export const InvestmentCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetAge, setTargetAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [costOfLiving, setCostOfLiving] = useState(50000);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [streams, setStreams] = useState<InvestmentStream[]>([
    {
      id: "default",
      principal: 10000,
      monthlyContribution: 500,
      postRetirementContribution: 0,
      interestRate: 7
    }
  ]);

  const addStream = () => {
    setStreams([
      ...streams,
      {
        id: crypto.randomUUID(),
        principal: 0,
        monthlyContribution: 0,
        postRetirementContribution: 0,
        interestRate: 7
      }
    ]);
  };

  const removeStream = (id: string) => {
    if (streams.length > 1) {
      setStreams(streams.filter(stream => stream.id !== id));
    }
  };

  const updateStream = (id: string, field: keyof Omit<InvestmentStream, 'id'>, value: number) => {
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
    inflationRate
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Investment Calculator
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Investment Stream</h2>
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

              {streams.map((stream, index) => (
                <Card key={stream.id} className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Investment Stream {index + 1}</h3>
                    {streams.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStream(stream.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`principal-${stream.id}`}>Initial Investment ($)</Label>
                    <Input
                      id={`principal-${stream.id}`}
                      type="number"
                      value={stream.principal}
                      onChange={(e) => updateStream(stream.id, 'principal', Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`monthlyContribution-${stream.id}`}>Monthly Contribution ($)</Label>
                    <Input
                      id={`monthlyContribution-${stream.id}`}
                      type="number"
                      value={stream.monthlyContribution}
                      onChange={(e) => updateStream(stream.id, 'monthlyContribution', Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`postRetirementContribution-${stream.id}`}>Post-Retirement Monthly Contribution ($)</Label>
                    <Input
                      id={`postRetirementContribution-${stream.id}`}
                      type="number"
                      value={stream.postRetirementContribution}
                      onChange={(e) => updateStream(stream.id, 'postRetirementContribution', Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`interestRate-${stream.id}`}>Annual Interest Rate (%)</Label>
                    <Input
                      id={`interestRate-${stream.id}`}
                      type="number"
                      value={stream.interestRate}
                      onChange={(e) => updateStream(stream.id, 'interestRate', Number(e.target.value))}
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </div>
                </Card>
              ))}

              <Button
                onClick={addStream}
                variant="outline"
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Investment Stream
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Cost of Living</h2>
            <div className="space-y-4">
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
        </div>

        <div className="space-y-8">
          <InvestmentSummary data={investmentData} />
          <InvestmentChart data={investmentData} />
        </div>
      </div>
    </div>
  );
};