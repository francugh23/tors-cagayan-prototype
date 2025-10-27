"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      icons={{
        success: <CircleCheckIcon size={20} className="text-green-500" />,
        info: <InfoIcon size={20} className="text-yellow-500" />,
        warning: <TriangleAlertIcon size={20} className="text-orange-500" />,
        error: <OctagonXIcon size={20} className="text-red-500" />,
        loading: (
          <Loader2Icon size={20} className="animate-spin text-blue-500" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "bg-white text-black border border-gray-200 shadow-lg",
          description: "text-gray-600",
          actionButton: "bg-primary text-white",
          cancelButton: "bg-gray-200 text-gray-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
