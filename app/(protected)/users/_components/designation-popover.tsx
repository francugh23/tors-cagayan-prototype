"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";

interface DesignationPopoverProps {
  field: any;
  designations: { id: string; name: string }[];
}

export function DesignationPopover({
  field,
  designations,
}: DesignationPopoverProps) {
  const [open, setOpen] = useState(false);
  const selected = designations.find((d) => d.id === field.value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild inert={open}>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between truncate font-normal"
        >
          <span className="truncate">
            {selected ? selected.name : "Select a designation"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search designation..." />
          <CommandList className="overflow-y-auto max-h-[300px]">
            <CommandEmpty>No designations found.</CommandEmpty>
            {designations.map((d) => (
              <CommandItem
                key={d.id}
                onSelect={() => {
                  field.onChange(d.id);
                  setOpen(false);
                }}
              >
                {d.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
