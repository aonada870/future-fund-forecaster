import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InvestmentChart from "./InvestmentChart";
import InvestmentSummary from "./InvestmentSummary";
import { calculateInvestmentGrowth, calculateRequiredContribution } from "@/lib/investment-utils";
import { InvestmentStream } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { GeneralDetailsForm } from "./investment/GeneralDetailsForm";
import { InvestmentStreamForm } from "./investment/InvestmentStreamForm";

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

  const requiredContribution = calculateRequiredContribution(
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
          <GeneralDetailsForm
            currentAge={currentAge}
            setCurrentAge={setCurrentAge}
            targetAge={targetAge}
            setTargetAge={setTargetAge}
            lifeExpectancy={lifeExpectancy}
            setLifeExpectancy={setLifeExpectancy}
            costOfLiving={costOfLiving}
            setCostOfLiving={setCostOfLiving}
            inflationRate={inflationRate}
            setInflationRate={setInflationRate}
          />

          {streams.map((stream) => (
            <InvestmentStreamForm
              key={stream.id}
              stream={stream}
              streams={streams}
              onUpdate={updateStream}
              onRemove={removeStream}
              onToggle={toggleStream}
              onUpdateWithdrawalOrder={updateWithdrawalOrder}
            />
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
              <InvestmentSummary 
                data={investmentData} 
                streams={activeStreams}
                requiredContribution={requiredContribution}
              />
              <InvestmentChart data={investmentData} streams={activeStreams} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};