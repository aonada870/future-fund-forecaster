import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { InvestmentStream, calculateInvestmentGrowth, combineInvestmentData } from "@/lib/investment-utils";
import { v4 as uuidv4 } from "uuid";

export const InvestmentCalculator = () => {
  const [streams, setStreams] = useState<InvestmentStream[]>([
    {
      id: uuidv4(),
      name: "Investment Stream 1",
      currentAge: 30,
      targetAge: 65,
      lifeExpectancy: 85,
      principal: 10000,
      monthlyContribution: 500,
      postRetirementContribution: 0,
      interestRate: 7,
      costOfLiving: 50000,
      inflationRate: 2.5,
    },
  ]);

  const [selectedStreams, setSelectedStreams] = useState<string[]>([streams[0].id]);
  const [showCombined, setShowCombined] = useState(false);

  const addStream = () => {
    const newStream = {
      id: uuidv4(),
      name: `Investment Stream ${streams.length + 1}`,
      currentAge: 30,
      targetAge: 65,
      lifeExpectancy: 85,
      principal: 10000,
      monthlyContribution: 500,
      postRetirementContribution: 0,
      interestRate: 7,
      costOfLiving: 50000,
      inflationRate: 2.5,
    };
    setStreams([...streams, newStream]);
    setSelectedStreams([...selectedStreams, newStream.id]);
  };

  const removeStream = (id: string) => {
    setStreams(streams.filter(s => s.id !== id));
    setSelectedStreams(selectedStreams.filter(s => s !== id));
  };

  const updateStream = (id: string, updates: Partial<InvestmentStream>) => {
    setStreams(streams.map(stream => 
      stream.id === id ? { ...stream, ...updates } : stream
    ));
  };

  const toggleStreamSelection = (id: string) => {
    setSelectedStreams(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const filteredStreams = streams.filter(s => selectedStreams.includes(s.id));
  const investmentData = showCombined 
    ? combineInvestmentData(filteredStreams)
    : filteredStreams.flatMap(stream => calculateInvestmentGrowth(stream));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Investment Calculator
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Investment Streams</h2>
            {streams.length < 5 && (
              <Button onClick={addStream}>Add Stream</Button>
            )}
          </div>

          {streams.map((stream) => (
            <Card key={stream.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedStreams.includes(stream.id)}
                      onCheckedChange={() => toggleStreamSelection(stream.id)}
                    />
                    <Input
                      value={stream.name}
                      onChange={(e) => updateStream(stream.id, { name: e.target.value })}
                      className="max-w-[200px]"
                    />
                  </div>
                  {streams.length > 1 && (
                    <Button
                      variant="destructive"
                      onClick={() => removeStream(stream.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`currentAge-${stream.id}`}>Current Age</Label>
                  <Input
                    id={`currentAge-${stream.id}`}
                    type="number"
                    value={stream.currentAge}
                    onChange={(e) => updateStream(stream.id, { currentAge: Number(e.target.value) })}
                    min={0}
                    max={stream.targetAge - 1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`targetAge-${stream.id}`}>Target Retirement Age</Label>
                  <Input
                    id={`targetAge-${stream.id}`}
                    type="number"
                    value={stream.targetAge}
                    onChange={(e) => updateStream(stream.id, { targetAge: Number(e.target.value) })}
                    min={stream.currentAge + 1}
                    max={stream.lifeExpectancy}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lifeExpectancy-${stream.id}`}>Life Expectancy</Label>
                  <Input
                    id={`lifeExpectancy-${stream.id}`}
                    type="number"
                    value={stream.lifeExpectancy}
                    onChange={(e) => updateStream(stream.id, { lifeExpectancy: Number(e.target.value) })}
                    min={stream.targetAge + 1}
                    max={120}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`principal-${stream.id}`}>Initial Investment ($)</Label>
                  <Input
                    id={`principal-${stream.id}`}
                    type="number"
                    value={stream.principal}
                    onChange={(e) => updateStream(stream.id, { principal: Number(e.target.value) })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`monthlyContribution-${stream.id}`}>Monthly Contribution ($)</Label>
                  <Input
                    id={`monthlyContribution-${stream.id}`}
                    type="number"
                    value={stream.monthlyContribution}
                    onChange={(e) => updateStream(stream.id, { monthlyContribution: Number(e.target.value) })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`postRetirementContribution-${stream.id}`}>Post-Retirement Monthly Contribution ($)</Label>
                  <Input
                    id={`postRetirementContribution-${stream.id}`}
                    type="number"
                    value={stream.postRetirementContribution}
                    onChange={(e) => updateStream(stream.id, { postRetirementContribution: Number(e.target.value) })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`interestRate-${stream.id}`}>Annual Interest Rate (%)</Label>
                  <Input
                    id={`interestRate-${stream.id}`}
                    type="number"
                    value={stream.interestRate}
                    onChange={(e) => updateStream(stream.id, { interestRate: Number(e.target.value) })}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`costOfLiving-${stream.id}`}>Annual Cost of Living ($)</Label>
                  <Input
                    id={`costOfLiving-${stream.id}`}
                    type="number"
                    value={stream.costOfLiving}
                    onChange={(e) => updateStream(stream.id, { costOfLiving: Number(e.target.value) })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`inflationRate-${stream.id}`}>Annual Inflation Rate (%)</Label>
                  <Input
                    id={`inflationRate-${stream.id}`}
                    type="number"
                    value={stream.inflationRate}
                    onChange={(e) => updateStream(stream.id, { inflationRate: Number(e.target.value) })}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={showCombined}
              onCheckedChange={(checked) => setShowCombined(checked === true)}
              id="showCombined"
            />
            <Label htmlFor="showCombined">Show Combined Results</Label>
          </div>
          <InvestmentSummary data={investmentData} />
          <InvestmentChart data={investmentData} />
        </div>
      </div>
    </div>
  );
};