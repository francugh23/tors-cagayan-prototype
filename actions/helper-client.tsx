"use client"

import { useEffect, useState } from "react";

export const codeClassMap: Record<string, string> = {
  CANCELLED:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 border",
  FORWARDED:
    "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 border",
  RECOMMENDED:
    "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 border",
  APPROVED:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 border",
  DISAPPROVED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200 border",
  REQUESTED:
    "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200 border",
  CREATED: "bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200 border",
  UPDATED: "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200 border",
  DELETED:
    "bg-brown-100 text-brown-800 hover:bg-brown-200 border-brown-200 border",
  RESET:
    "bg-violet-100 text-violet-800 hover:bg-violet-200 border-violet-200 border",
};

export function useDebounce<T>(value: T, delay = 150): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
