import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface PreTourFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  joining: string;
  joiningOther: string;
  successGoal: string;
  priorities: string[];
  specificAreas: string;
  budget: string;
  propertyTypes: string[];
  logistics: string[];
  pace: string;
  dietary: string;
  notes: string;
}

// Stable identifiers — these are the values stored / sent to backend.
const JOINING_VALUES = ["just_me", "partner", "family", "friend", "other"];
const PRIORITY_KEYS = Array.from({ length: 11 }, (_, i) => `p${i}`);
const PROPERTY_TYPE_KEYS = Array.from({ length: 7 }, (_, i) => `pt${i}`);
const LOGISTICS_KEYS = Array.from({ length: 5 }, (_, i) => `lg${i}`);
const PACE_KEYS = ["fast", "balanced", "slow"];
const BUDGET_KEYS = Array.from({ length: 5 }, (_, i) => `b${i}`);

const initialData: PreTourFormData = {
  fullName: "",
  email: "",
  whatsapp: "",
  joining: "",
  joiningOther: "",
  successGoal: "",
  priorities: [],
  specificAreas: "",
  budget: "",
  propertyTypes: [],
  logistics: [],
  pace: "",
  dietary: "",
  notes: "",
};

type T = (path: string) => any;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PreTourFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  mode?: "payment" | "enquiry";
  t: T;
}

export default function PreTourFormModal({ open, onOpenChange, onSubmit, isSubmitting, mode = "payment", t }: Props) {
  const [data, setData] = useState<PreTourFormData>(initialData);
  const { toast } = useToast();

  const labels = t("pretour_modal.labels");
  const sections = t("pretour_modal.sections");
  const btns = t("pretour_modal.buttons");
  const toastT = t("pretour_modal.toast");
  const req = t("pretour_modal.required");

  const joiningOptions: { key: string; label: string }[] = (
    (t("pretour_modal.joining_options") as string[]) || []
  ).map((label, i) => ({ key: JOINING_VALUES[i] || `j${i}`, label }));
  const priorities: { key: string; label: string }[] = (
    (t("pretour_modal.priorities") as string[]) || []
  ).map((label, i) => ({ key: PRIORITY_KEYS[i], label }));
  const budgets: { key: string; label: string }[] = (
    (t("pretour_modal.budgets") as string[]) || []
  ).map((label, i) => ({ key: BUDGET_KEYS[i] || `b${i}`, label }));
  const propTypes: { key: string; label: string }[] = (
    (t("pretour_modal.property_types_opts") as string[]) || []
  ).map((label, i) => ({ key: PROPERTY_TYPE_KEYS[i] || `pt${i}`, label }));
  const logisticsOpts: { key: string; label: string }[] = (
    (t("pretour_modal.logistics_opts") as string[]) || []
  ).map((label, i) => ({ key: LOGISTICS_KEYS[i] || `lg${i}`, label }));
  const paceOpts: { key: string; label: string }[] = (
    (t("pretour_modal.pace_opts") as string[]) || []
  ).map((label, i) => ({ key: PACE_KEYS[i] || `pc${i}`, label }));

  const update = <K extends keyof PreTourFormData>(key: K, value: PreTourFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const togglePriority = (item: string) => {
    setData((d) => {
      const exists = d.priorities.includes(item);
      if (exists) return { ...d, priorities: d.priorities.filter((p) => p !== item) };
      if (d.priorities.length >= 3) {
        toast({ title: toastT.limit_title, description: toastT.limit_desc });
        return d;
      }
      return { ...d, priorities: [...d.priorities, item] };
    });
  };

  const toggleArray = (key: "propertyTypes" | "logistics", item: string) => {
    setData((d) => ({
      ...d,
      [key]: d[key].includes(item) ? d[key].filter((p) => p !== item) : [...d[key], item],
    }));
  };

  const isValid =
    data.fullName.trim() &&
    data.email.trim() &&
    data.whatsapp.trim() &&
    data.joining &&
    data.successGoal.trim() &&
    data.priorities.length > 0 &&
    data.budget &&
    data.pace;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast({
        title: toastT.missing_title,
        description: toastT.missing_desc,
        variant: "destructive",
      });
      return;
    }
    await onSubmit(data);
  };

  const otherLabel = joiningOptions.find((o) => o.key === "other")?.label;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "enquiry" ? t("pretour_modal.title_enquiry") : t("pretour_modal.title_payment")}
          </DialogTitle>
          <DialogDescription>
            {t("pretour_modal.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-2">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{sections.about}</h3>
            <div>
              <Label htmlFor="fullName">{labels.full_name} {req}</Label>
              <Input id="fullName" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} required maxLength={120} />
            </div>
            <div>
              <Label htmlFor="email">{labels.email} {req}</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} required maxLength={255} />
            </div>
            <div>
              <Label htmlFor="whatsapp">{labels.whatsapp} {req}</Label>
              <Input id="whatsapp" type="tel" value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} required maxLength={40} />
            </div>
            <div>
              <Label>{labels.joining} {req}</Label>
              <RadioGroup value={data.joining} onValueChange={(v) => update("joining", v)} className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {joiningOptions.map((opt) => (
                  <div key={opt.key} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.label} id={`joining-${opt.key}`} />
                    <Label htmlFor={`joining-${opt.key}`} className="font-normal cursor-pointer">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {otherLabel && data.joining === otherLabel && (
                <Input
                  className="mt-2"
                  placeholder={labels.joining_other_ph}
                  value={data.joiningOther}
                  onChange={(e) => update("joiningOther", e.target.value)}
                  maxLength={120}
                />
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{sections.focus}</h3>
            <div>
              <Label htmlFor="successGoal">{labels.success_goal} {req}</Label>
              <Textarea id="successGoal" value={data.successGoal} onChange={(e) => update("successGoal", e.target.value)} required maxLength={1000} rows={3} />
            </div>
            <div>
              <Label>{labels.priorities} {req}</Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {priorities.map((item) => (
                  <div key={item.key} className="flex items-start space-x-2">
                    <Checkbox
                      id={`pri-${item.key}`}
                      checked={data.priorities.includes(item.label)}
                      onCheckedChange={() => togglePriority(item.label)}
                    />
                    <Label htmlFor={`pri-${item.key}`} className="font-normal cursor-pointer leading-tight">{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="specificAreas">{labels.specific_areas}</Label>
              <Textarea id="specificAreas" value={data.specificAreas} onChange={(e) => update("specificAreas", e.target.value)} maxLength={1000} rows={3} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{sections.property_budget}</h3>
            <div>
              <Label htmlFor="budget">{labels.budget} {req}</Label>
              <Select value={data.budget} onValueChange={(v) => update("budget", v)}>
                <SelectTrigger id="budget" className="mt-1">
                  <SelectValue placeholder={labels.budget_ph} />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((b) => (
                    <SelectItem key={b.key} value={b.label}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{labels.property_types}</Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {propTypes.map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pt-${item.key}`}
                      checked={data.propertyTypes.includes(item.label)}
                      onCheckedChange={() => toggleArray("propertyTypes", item.label)}
                    />
                    <Label htmlFor={`pt-${item.key}`} className="font-normal cursor-pointer">{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{sections.logistics}</h3>
            <Label>{labels.logistics_help}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {logisticsOpts.map((item) => (
                <div key={item.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`log-${item.key}`}
                    checked={data.logistics.includes(item.label)}
                    onCheckedChange={() => toggleArray("logistics", item.label)}
                  />
                  <Label htmlFor={`log-${item.key}`} className="font-normal cursor-pointer">{item.label}</Label>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{sections.preferences}</h3>
            <div>
              <Label>{labels.pace} {req}</Label>
              <RadioGroup value={data.pace} onValueChange={(v) => update("pace", v)} className="mt-2 space-y-2">
                {paceOpts.map((opt) => (
                  <div key={opt.key} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.label} id={`pace-${opt.key}`} />
                    <Label htmlFor={`pace-${opt.key}`} className="font-normal cursor-pointer">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="dietary">{labels.dietary}</Label>
              <Textarea id="dietary" value={data.dietary} onChange={(e) => update("dietary", e.target.value)} maxLength={500} rows={2} />
            </div>
            <div>
              <Label htmlFor="notes">{labels.notes}</Label>
              <Textarea id="notes" value={data.notes} onChange={(e) => update("notes", e.target.value)} maxLength={1000} rows={3} />
            </div>
          </section>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {btns.cancel}
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting} className="bg-gold hover:bg-gold-dark text-black">
              {isSubmitting && <Loader2 size={14} className="animate-spin mr-2" />}
              {isSubmitting
                ? (mode === "enquiry" ? btns.sending : btns.processing)
                : (mode === "enquiry" ? btns.send_request : btns.continue_payment)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
