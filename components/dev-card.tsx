import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FaDev, FaGithub } from "react-icons/fa";

export const DevHoverCard = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="fixed bottom-5 right-5 p-3 cursor-pointer bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all">
          <FaDev size={20} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="end" sideOffset={5}>
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex justify-center items-center space-x-2">
              <FaGithub size={20} />
              <h4 className="text-sm font-semibold">@francugh @loydesenpai</h4>
            </div>
            <p className="text-sm">
              E-Travel Order System (SDO-NV) – created and maintained by Johannes Franco
              and Jeferson Soto.
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                © Copyright 2025
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
