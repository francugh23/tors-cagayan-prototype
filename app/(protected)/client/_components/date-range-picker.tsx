"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function DateRangePicker({
  value,
  onChange,
  disabled,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const dateRange = React.useMemo(() => {
    if (!value) return { from: undefined, to: undefined };
    const [fromStr, toStr] = value.split(",");
    return {
      from: fromStr ? new Date(fromStr) : undefined,
      to: toStr ? new Date(toStr) : undefined,
    };
  }, [value]);

  const displayText = React.useMemo(() => {
    if (!dateRange.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, "MMM d, yyyy");
    return `${format(dateRange.from, "MMM d")} – ${format(
      dateRange.to,
      "MMM d, yyyy"
    )}`;
  }, [dateRange]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange?.from) {
      onChange?.("");
      return;
    }

    const from = selectedRange.from
      ? format(selectedRange.from, "yyyy-MM-dd")
      : "";
    const to = selectedRange.to ? format(selectedRange.to, "yyyy-MM-dd") : from;

    onChange?.(`${from},${to}`);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-full justify-between font-normal"
            disabled={disabled}
          >
            {displayText}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}