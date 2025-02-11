
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { calculateInvestmentGrowth } from "@/lib/investment-utils";
import { ContributionFrequency, InvestmentStream } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const frequencyOptions: ContributionFrequency[] = ['weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly'];

export const InvestmentCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetAge, setTargetAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(105);
  const [costOfLiving, setCostOfLiving] = useState(50000);
  const [inflationRate, setInflationRate] = useState(3);
  const [streams, setStreams] = useState<InvestmentStream[]>([{
    id: '1',
    name: 'Investment Stream 1',
    principal: 100000,
    contributionAmount: 1000,
    contributionFrequency: 'monthly',
    postRetirementAmount: 0,
    postRetirementFrequency: 'monthly',
    interestRate: 7,
    withdrawalOrder: 1,
    isActive: true
  }]);

  const addStream = () => {
    const newStream: InvestmentStream = {
      id: `${streams.length + 1}`,
      name: `Investment Stream ${streams.length + 1}`,
      principal: 0,
      contributionAmount: 0,
      contributionFrequency: 'monthly',
      postRetirementAmount: 0,
      postRetirementFrequency: 'monthly',
      interestRate: 7,
      withdrawalOrder: streams.length + 1,
      isActive: true
    };
    setStreams([...streams, newStream]);
  };

  const removeStream = (id: string) => {
    if (streams.length > 1) {
      const newStreams = streams.filter(stream => stream.id !== id);
      const reorderedStreams = newStreams.map((stream, index) => ({
        ...stream,
        withdrawalOrder: index + 1
      }));
      setStreams(reorderedStreams);
    }
  };

  const updateStream = (id: string, updates: Partial<InvestmentStream>) => {
    setStreams(streams.map(stream => 
      stream.id === id ? { ...stream, ...updates } : stream
    ));
  };

  const updateWithdrawalOrder = (id: string, newOrder: number) => {
    const stream = streams.find(s => s.id === id);
    if (!stream) return;

    const oldOrder = stream.withdrawalOrder;
    
    setStreams(streams.map(s => {
      if (s.id === id) {
        return { ...s, withdrawalOrder: newOrder };
      }
      if (s.withdrawalOrder === newOrder) {
        return { ...s, withdrawalOrder: oldOrder };
      }
      return s;
    }));
  };

  const toggleStream = (id: string) => {
    setStreams(streams.map(stream =>
      stream.id === id ? { ...stream, isActive: !stream.isActive } : stream
    ));
  };

  const activeStreams = streams.filter(stream => stream.isActive);

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
      
      {activeStreams.length === 0 && (
        <Alert className="mb-8">
          <AlertDescription>
            Please activate at least one investment stream to see projections.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {/* General Details Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">General Details</h2>
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
            </div>
          </Card>

          {/* Investment Streams */}
          {streams.map((stream) => (
            <Card key={stream.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">{stream.name}</h2>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={stream.isActive}
                      onCheckedChange={() => toggleStream(stream.id)}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                {streams.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStream(stream.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${stream.id}-name`}>Stream Name</Label>
                  <Input
                    id={`${stream.id}-name`}
                    value={stream.name}
                    onChange={(e) => updateStream(stream.id, { name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${stream.id}-withdrawal-order`}>Withdrawal Priority</Label>
                  <Select
                    value={stream.withdrawalOrder.toString()}
                    onValueChange={(value) => updateWithdrawalOrder(stream.id, parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: streams.length }, (_, i) => i + 1).map((order) => (
                        <SelectItem key={order} value={order.toString()}>
                          {order}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${stream.id}-principal`}>Initial Investment ($)</Label>
                  <Input
                    id={`${stream.id}-principal`}
                    type="number"
                    value={stream.principal}
                    onChange={(e) => updateStream(stream.id, { principal: Number(e.target.value) })}
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${stream.id}-contribution`}>Contribution Amount ($)</Label>
                    <Input
                      id={`${stream.id}-contribution`}
                      type="number"
                      value={stream.contributionAmount}
                      onChange={(e) => updateStream(stream.id, { contributionAmount: Number(e.target.value) })}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${stream.id}-frequency`}>Frequency</Label>
                    <Select
                      value={stream.contributionFrequency}
                      onValueChange={(value: ContributionFrequency) => 
                        updateStream(stream.id, { contributionFrequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${stream.id}-post-retirement`}>Post-Retirement Amount ($)</Label>
                    <Input
                      id={`${stream.id}-post-retirement`}
                      type="number"
                      value={stream.postRetirementAmount}
                      onChange={(e) => updateStream(stream.id, { postRetirementAmount: Number(e.target.value) })}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${stream.id}-post-retirement-frequency`}>Frequency</Label>
                    <Select
                      value={stream.postRetirementFrequency}
                      onValueChange={(value: ContributionFrequency) => 
                        updateStream(stream.id, { postRetirementFrequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${stream.id}-interest`}>Annual Interest Rate (%)</Label>
                  <Input
                    id={`${stream.id}-interest`}
                    type="number"
                    value={stream.interestRate}
                    onChange={(e) => updateStream(stream.id, { interestRate: Number(e.target.value) })}
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
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Investment Stream
          </Button>
        </div>

        <div className="space-y-8">
          {activeStreams.length > 0 ? (
            <>
              <InvestmentSummary data={investmentData} streams={activeStreams} />
              <InvestmentChart data={investmentData} streams={activeStreams} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

