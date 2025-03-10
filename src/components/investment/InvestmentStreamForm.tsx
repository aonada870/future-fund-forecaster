
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ContributionFrequency, InvestmentStream } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvestmentStreamFormProps {
  stream: InvestmentStream;
  streams: InvestmentStream[];
  onUpdate: (id: string, updates: Partial<InvestmentStream>) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateWithdrawalOrder: (id: string, newOrder: number) => void;
}

const frequencyOptions: ContributionFrequency[] = ['weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly'];

export const InvestmentStreamForm = ({
  stream,
  streams,
  onUpdate,
  onRemove,
  onToggle,
  onUpdateWithdrawalOrder,
}: InvestmentStreamFormProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">{stream.name}</h2>
          <div className="flex items-center gap-2">
            <Switch
              checked={stream.isActive}
              onCheckedChange={() => onToggle(stream.id)}
            />
            <Label>Active</Label>
          </div>
        </div>
        {streams.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(stream.id)}
            className="self-end sm:self-auto"
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
            onChange={(e) => onUpdate(stream.id, { name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${stream.id}-withdrawal-order`}>Withdrawal Priority</Label>
          <Select
            value={stream.withdrawalOrder.toString()}
            onValueChange={(value) => onUpdateWithdrawalOrder(stream.id, parseInt(value))}
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
            onChange={(e) => onUpdate(stream.id, { principal: Number(e.target.value) })}
            min={0}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${stream.id}-contribution`}>Contribution Amount ($)</Label>
            <Input
              id={`${stream.id}-contribution`}
              type="number"
              value={stream.contributionAmount}
              onChange={(e) => onUpdate(stream.id, { contributionAmount: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${stream.id}-frequency`}>Frequency</Label>
            <Select
              value={stream.contributionFrequency}
              onValueChange={(value: ContributionFrequency) => 
                onUpdate(stream.id, { contributionFrequency: value })
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${stream.id}-post-retirement`}>Post-Retirement Amount ($)</Label>
            <Input
              id={`${stream.id}-post-retirement`}
              type="number"
              value={stream.postRetirementAmount}
              onChange={(e) => onUpdate(stream.id, { postRetirementAmount: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${stream.id}-post-retirement-frequency`}>Frequency</Label>
            <Select
              value={stream.postRetirementFrequency}
              onValueChange={(value: ContributionFrequency) => 
                onUpdate(stream.id, { postRetirementFrequency: value })
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
            onChange={(e) => onUpdate(stream.id, { interestRate: Number(e.target.value) })}
            min={0}
            max={100}
            step={0.1}
          />
        </div>
      </div>
    </Card>
  );
};
