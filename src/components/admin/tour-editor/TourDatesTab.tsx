import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Field } from "./Field";

export interface DateRow {
  id?: string;
  start_date: string;
  end_date: string;
  capacity: number;
  sold_out: boolean;
  label: string | null;
  _isNew?: boolean;
  _delete?: boolean;
}

interface Props {
  dates: DateRow[];
  setDates: React.Dispatch<React.SetStateAction<DateRow[]>>;
}

export const TourDatesTab = ({ dates, setDates }: Props) => {
  const patch = (i: number, changes: Partial<DateRow>) =>
    setDates((p) => p.map((x, idx) => (idx === i ? { ...x, ...changes } : x)));

  return (
    <div className="space-y-3">
      {dates.filter((d) => !d._delete).length === 0 && (
        <p className="text-sm text-gray-400">No dates yet. Add one below.</p>
      )}
      {dates.map((d, i) =>
        d._delete ? null : (
          <div
            key={d.id ?? `new-${i}`}
            className="bg-gray-950 border border-gray-800 rounded-lg p-3 grid grid-cols-2 md:grid-cols-6 gap-2 items-end"
          >
            <Field label="Start">
              <Input type="date" value={d.start_date} onChange={(e) => patch(i, { start_date: e.target.value })} className="bg-black border-gray-800 text-white" />
            </Field>
            <Field label="End">
              <Input type="date" value={d.end_date} onChange={(e) => patch(i, { end_date: e.target.value })} className="bg-black border-gray-800 text-white" />
            </Field>
            <Field label="Capacity">
              <Input type="number" min={0} value={d.capacity} onChange={(e) => patch(i, { capacity: Number(e.target.value) })} className="bg-black border-gray-800 text-white" />
            </Field>
            <Field label="Label">
              <Input value={d.label ?? ""} onChange={(e) => patch(i, { label: e.target.value })} className="bg-black border-gray-800 text-white" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300 mt-5">
              <input type="checkbox" checked={d.sold_out} onChange={(e) => patch(i, { sold_out: e.target.checked })} />
              Sold out
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => patch(i, { _delete: true })}
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white min-h-[40px]"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )
      )}
      <Button
        variant="outline"
        onClick={() =>
          setDates((p) => [
            ...p,
            { start_date: "", end_date: "", capacity: 10, sold_out: false, label: "", _isNew: true },
          ])
        }
        className="border-gold text-gold hover:bg-gold hover:text-black min-h-[44px]"
      >
        <Plus className="w-4 h-4 mr-1" /> Add date
      </Button>
    </div>
  );
};