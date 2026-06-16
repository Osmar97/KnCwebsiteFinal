import { Label } from "@/components/ui/label";

export const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-xs uppercase tracking-wider text-gray-400">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
  </div>
);