"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";

interface NonFormSelectProps {
  defaultValue?: string;
  label?: string;
  placeholder: string;
  options: { value: string; label: string }[];
  getValue: (value: string) => void;
}

export default function NonFormSelect({
  defaultValue,
  getValue,
  label,
  options,
  placeholder,
}: NonFormSelectProps) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => getValue(value)}
      >
        <SelectTrigger className="h-10">
          <SelectValue placeholder={`Select ${placeholder}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}