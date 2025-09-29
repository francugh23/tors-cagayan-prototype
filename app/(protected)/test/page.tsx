"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { PDFViewer } from "@react-pdf/renderer";
import { TravelOrderPDF } from "@/components/custom/pdf-file";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TestPage = () => {
  const user = useCurrentUser();
  const [state, setState] = useState<"ready" | "loading">("loading");

  useEffect(() => {
    setState("ready");
  }, []);

  return (
    <>
      {state === "loading" && <Skeleton className="w-full h-[200px]" />}
      {state === "ready" && (
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <TravelOrderPDF user={user} />
        </PDFViewer>
      )}
    </>
  );
};

export default TestPage;
