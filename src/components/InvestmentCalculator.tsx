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
      name: "Primary Investment",
      principal: 10000,
      monthlyContribution: 500,
      postRetirementContribution: 0,
      interestRate: 7
    }
  ]);

  const addStream = () => {
    const newStream: InvestmentStream = {
      id: crypto.randomUUID(),
      name: `Investment Stream ${streams.length + 1}`,
      principal: 0,
      monthlyContribution: 0,
      postRetirementContribution: 0,
      interestRate: 7
    };
    setStreams([...streams, newStream]);
  };

  const removeStream = (id: string) => {
    if (streams.length > 1) {
      setStreams(streams.filter(stream => stream.id !== id));
    }
  };

  const updateStream = (id: string, field: keyof InvestmentStream, value: string | number) => {
    setStreams(streams.map(stream => 
      stream.id === id ? { ...stream, [field]: typeof value === 'string' ? value : Number(value) } : stream
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">Time Horizon</h2>
            </div>
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
            </div>
          </Card>

          {streams.map((stream, index) => (
            <Card key={stream.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary">Investment Stream {index + 1}</h2>
                {streams.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStream(stream.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${stream.id}`}>Investment Name</Label>
                  <Input
                    id={`name-${stream.id}`}
                    value={stream.name}
                    onChange={(e) => updateStream(stream.id, 'name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`principal-${stream.id}`}>Initial Investment ($)</Label>
                  <Input
                    id={`principal-${stream.id}`}
                    type="number"
                    value={stream.principal}
                    onChange={(e) => updateStream(stream.id, 'principal', e.target.value)}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`monthlyContribution-${stream.id}`}>Monthly Contribution ($)</Label>
                  <Input
                    id={`monthlyContribution-${stream.id}`}
                    type="number"
                    value={stream.monthlyContribution}
                    onChange={(e) => updateStream(stream.id, 'monthlyContribution', e.target.value)}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`postRetirementContribution-${stream.id}`}>Post-Retirement Monthly Contribution ($)</Label>
                  <Input
                    id={`postRetirementContribution-${stream.id}`}
                    type="number"
                    value={stream.postRetirementContribution}
                    onChange={(e) => updateStream(stream.id, 'postRetirementContribution', e.target.value)}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`interestRate-${stream.id}`}>Annual Interest Rate (%)</Label>
                  <Input
                    id={`interestRate-${stream.id}`}
                    type="number"
                    value={stream.interestRate}
                    onChange={(e) => updateStream(stream.id, 'interestRate', e.target.value)}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={addStream}
            className="w-full"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Investment Stream
          </Button>

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
          <InvestmentSummary data={investmentData} streams={streams} />
          <InvestmentChart data={investmentData} streams={streams} />
        </div>
      </div>
    </div>
  );
};