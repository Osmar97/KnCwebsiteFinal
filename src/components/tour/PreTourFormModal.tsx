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

const PRIORITIES = [
  "Understanding neighborhoods",
  "Viewing properties",
  "Investment opportunities",
  "Lifestyle & relocation",
  "Schools / family areas",
  "Beach / nature lifestyle",
  "Walkability & city life",
  "Renovation opportunities",
  "Rental income potential",
  "Legal / financing guidance",
  "Networking & local connections",
];

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "New build",
  "Renovation project",
  "Investment property",
  "Rural / quinta",
  "Unsure",
];

const LOGISTICS = [
  "Mortgage broker introduction",
  "Legal / tax guidance",
  "NIF / bank account support",
  "Relocation guidance",
  "None",
];

const JOINING_OPTIONS = ["Just me", "Partner", "Family", "Friend / colleague", "Other"];

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PreTourFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  mode?: "payment" | "enquiry";
}

export default function PreTourFormModal({ open, onOpenChange, onSubmit, isSubmitting, mode = "payment" }: Props) {
  const [data, setData] = useState<PreTourFormData>(initialData);
  const { toast } = useToast();

  const update = <K extends keyof PreTourFormData>(key: K, value: PreTourFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const togglePriority = (item: string) => {
    setData((d) => {
      const exists = d.priorities.includes(item);
      if (exists) return { ...d, priorities: d.priorities.filter((p) => p !== item) };
      if (d.priorities.length >= 3) {
        toast({ title: "Limit reached", description: "Please select up to 3 priorities." });
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
        title: "Missing information",
        description: "Please complete all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "enquiry" ? "Request a Private Tour" : "Pre-Tour Preparation Form"}
          </DialogTitle>
          <DialogDescription>
            This short form helps us tailor the experience around your goals, preferences, and practical needs before arrival.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-2">
          {/* 1. About You */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">1. About You</h3>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} required maxLength={120} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} required maxLength={255} />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input id="whatsapp" type="tel" value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} required maxLength={40} />
            </div>
            <div>
              <Label>Who will be joining you? *</Label>
              <RadioGroup value={data.joining} onValueChange={(v) => update("joining", v)} className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {JOINING_OPTIONS.map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`joining-${opt}`} />
                    <Label htmlFor={`joining-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
              {data.joining === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={data.joiningOther}
                  onChange={(e) => update("joiningOther", e.target.value)}
                  maxLength={120}
                />
              )}
            </div>
          </section>

          {/* 2. Your Main Focus */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">2. Your Main Focus</h3>
            <div>
              <Label htmlFor="successGoal">What would make this tour successful for you? *</Label>
              <Textarea id="successGoal" value={data.successGoal} onChange={(e) => update("successGoal", e.target.value)} required maxLength={1000} rows={3} />
            </div>
            <div>
              <Label>What should we prioritize most? * (select up to 3)</Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRIORITIES.map((item) => (
                  <div key={item} className="flex items-start space-x-2">
                    <Checkbox
                      id={`pri-${item}`}
                      checked={data.priorities.includes(item)}
                      onCheckedChange={() => togglePriority(item)}
                    />
                    <Label htmlFor={`pri-${item}`} className="font-normal cursor-pointer leading-tight">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="specificAreas">Are there any specific areas or properties you want to see?</Label>
              <Textarea id="specificAreas" value={data.specificAreas} onChange={(e) => update("specificAreas", e.target.value)} maxLength={1000} rows={3} />
            </div>
          </section>

          {/* 3. Property & Budget */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">3. Property & Budget Snapshot</h3>
            <div>
              <Label htmlFor="budget">Approximate budget *</Label>
              <Select value={data.budget} onValueChange={(v) => update("budget", v)}>
                <SelectTrigger id="budget" className="mt-1">
                  <SelectValue placeholder="Select a range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under 250K€">Under 250K€</SelectItem>
                  <SelectItem value="250K€–500K€">250K€–500K€</SelectItem>
                  <SelectItem value="500K€–1M€">500K€–1M€</SelectItem>
                  <SelectItem value="1M€+">1M€+</SelectItem>
                  <SelectItem value="Still exploring">Still exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred property types</Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROPERTY_TYPES.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pt-${item}`}
                      checked={data.propertyTypes.includes(item)}
                      onCheckedChange={() => toggleArray("propertyTypes", item)}
                    />
                    <Label htmlFor={`pt-${item}`} className="font-normal cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Logistics */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">4. Logistics</h3>
            <Label>Do you need help with:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LOGISTICS.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`log-${item}`}
                    checked={data.logistics.includes(item)}
                    onCheckedChange={() => toggleArray("logistics", item)}
                  />
                  <Label htmlFor={`log-${item}`} className="font-normal cursor-pointer">{item}</Label>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Personal Preferences */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">5. Personal Preferences</h3>
            <div>
              <Label>Pace preference *</Label>
              <RadioGroup value={data.pace} onValueChange={(v) => update("pace", v)} className="mt-2 space-y-2">
                {["Fast-paced / maximize viewings", "Balanced", "Slower & lifestyle-focused"].map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`pace-${opt}`} />
                    <Label htmlFor={`pace-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="dietary">Any dietary restrictions or accessibility needs?</Label>
              <Textarea id="dietary" value={data.dietary} onChange={(e) => update("dietary", e.target.value)} maxLength={500} rows={2} />
            </div>
            <div>
              <Label htmlFor="notes">Anything else we should know before your arrival?</Label>
              <Textarea id="notes" value={data.notes} onChange={(e) => update("notes", e.target.value)} maxLength={1000} rows={3} />
            </div>
          </section>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting} className="bg-gold hover:bg-gold-dark text-black">
              {isSubmitting && <Loader2 size={14} className="animate-spin mr-2" />}
              {isSubmitting
                ? (mode === "enquiry" ? "Sending..." : "Processing...")
                : (mode === "enquiry" ? "Send Request" : "Continue to Payment — 3,500€")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}