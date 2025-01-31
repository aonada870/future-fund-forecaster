import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PlusCircle, Trash2 } from "lucide-react";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { calculateCombinedInvestmentGrowth, InvestmentStream } from "@/lib/investment-utils";
import { useToast } from "@/components/ui/use-toast";

export const InvestmentCalculator = () => {
  const { toast } = useToast();
  const [currentAge, setCurrentAge] = useState(30);
  const [targetAge, setTargetAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [costOfLiving, setCostOfLiving] = useState(50000);
  const [inflationRate, setInflationRate] = useState(2.5);
  
  const [streams, setStreams] = useState<InvestmentStream[]>([{
    id: "1",
    name: "Investment 1",
    principal: 10000,
    monthlyContribution: 500,
    postRetirementContribution: 0,
    interestRate: 7
  }]);

  const [selectedStreams, setSelectedStreams] = useState<string[]>(["1"]);

  const addStream = () => {
    if (streams.length >= 5) {
      toast({
        title: "Maximum streams reached",
        description: "You can have up to 5 investment streams",
        variant: "destructive"
      });
      return;
    }

    const newId = (streams.length + 1).toString();
    setStreams([...streams, {
      id: newId,
      name: `Investment ${newId}`,
      principal: 10000,
      monthlyContribution: 500,
      postRetirementContribution: 0,
      interestRate: 7
    }]);
    setSelectedStreams([...selectedStreams, newId]);
  };

  const removeStream = (id: string) => {
    if (streams.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one investment stream",
        variant: "destructive"
      });
      return;
    }
    setStreams(streams.filter(s => s.id !== id));
    setSelectedStreams(selectedStreams.filter(s => s !== id));
  };

  const updateStream = (id: string, field: keyof InvestmentStream, value: number | string) => {
    setStreams(streams.map(stream => 
      stream.id === id ? { ...stream, [field]: value } : stream
    ));
  };

  const investmentData = calculateCombinedInvestmentGrowth(
    streams,
    currentAge,
    targetAge,
    lifeExpectancy,
    costOfLiving,
    inflationRate
  );

  const visibleData = selectedStreams.includes('combined') 
    ? { combined: investmentData.combined }
    : Object.fromEntries(
        Object.entries(investmentData).filter(([key]) => 
          selectedStreams.includes(key) && key !== 'combined'
        )
      );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Investment Calculator
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
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
            </div>
          </Card>

          {streams.map((stream) => (
            <Card key={stream.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{stream.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStream(stream.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
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
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <Label className="mb-2 block">View Options</Label>
            <ToggleGroup 
              type="multiple"
              value={selectedStreams}
              onValueChange={(value) => {
                if (value.length === 0) {
                  toast({
                    title: "Selection required",
                    description: "Please select at least one investment stream to view",
                    variant: "destructive"
                  });
                  return;
                }
                setSelectedStreams(value);
              }}
              className="justify-start flex-wrap"
            >
              {streams.map((stream) => (
                <ToggleGroupItem key={stream.id} value={stream.id} aria-label={stream.name}>
                  {stream.name}
                </ToggleGroupItem>
              ))}
              {streams.length > 1 && (
                <ToggleGroupItem value="combined" aria-label="Combined">
                  Combined
                </ToggleGroupItem>
              )}
            </ToggleGroup>
          </Card>

          <InvestmentSummary data={visibleData} />
          <InvestmentChart data={visibleData} />
        </div>
      </div>
    </div>
  );
};