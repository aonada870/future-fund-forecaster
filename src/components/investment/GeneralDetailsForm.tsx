
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface GeneralDetailsFormProps {
  currentAge: number;
  setCurrentAge: (age: number) => void;
  targetAge: number;
  setTargetAge: (age: number) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (age: number) => void;
  costOfLiving: number;
  setCostOfLiving: (cost: number) => void;
  inflationRate: number;
  setInflationRate: (rate: number) => void;
}

export const GeneralDetailsForm = ({
  currentAge,
  setCurrentAge,
  targetAge,
  setTargetAge,
  lifeExpectancy,
  setLifeExpectancy,
  costOfLiving,
  setCostOfLiving,
  inflationRate,
  setInflationRate,
}: GeneralDetailsFormProps) => {
  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">General Details</h2>
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
  );
};
