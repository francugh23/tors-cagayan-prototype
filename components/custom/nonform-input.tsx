"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NonFormInputProps {
  defaultValue?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NonFormInput({
  defaultValue,
  label,
  type,
  placeholder,
  readOnly,
  className,
  onChange,
}: NonFormInputProps) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <Input
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        readOnly={readOnly}
        type={type || "text"}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    </>
  );
}
