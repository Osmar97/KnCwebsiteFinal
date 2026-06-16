import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumber } from "./propertyFilterOptions";

interface Props {
  label: string;
  unitSuffix?: string;
  placeholder: string;
  value: string;
  options: string[];
  customPlaceholder: string;
  onChange: (value: string) => void;
}

export const PropertyRangeSelect = ({
  label,
  unitSuffix,
  placeholder,
  value,
  options,
  customPlaceholder,
  onChange,
}: Props) => (
  <div>
    <Label className="text-xs text-gray-600 mb-1 block">
      {label}
      {unitSuffix ? ` ${unitSuffix}` : ""}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white z-50">
        <SelectItem value="no_limit">No limit</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {formatNumber(o)}
          </SelectItem>
        ))}
        <SelectItem value="custom">Other</SelectItem>
      </SelectContent>
    </Select>
    {value === "custom" && (
      <Input
        type="number"
        placeholder={customPlaceholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 border-gray-300 focus:border-gold focus:ring-gold"
      />
    )}
  </div>
);