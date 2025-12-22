import { Card, CardContent } from "@/components/ui/card";
import { FileStack } from "lucide-react";
import { title } from "@/components/fonts/font";
import { cn } from "@/lib/utils";

export const FilePreview = ({ fileUrl }: { fileUrl?: string | null }) => {
  const renderPreview = (url: string) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    const isDrive =
      url.includes("drive.google.com") || url.includes("docs.google.com");

    let embedUrl = url;

    // Convert Google Drive file link to /preview form
    if (isDrive && url.includes("/d/")) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match)
        embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    // Handle Google Docs/Sheets/Slides
    if (url.includes("docs.google.com")) {
      embedUrl = url.replace("/edit", "/preview");
    }

    if (isImage) {
      return (
        // @ts-nocheck
        <img
          src={embedUrl}
          alt="Attached File"
          className="w-full h-auto rounded-md object-contain bg-muted"
        />
      );
    }

    if (isDrive) {
      return (
        <iframe
          src={embedUrl}
          style={{ width: "100%", height: "500px", border: "none" }}
          title="Attached File"
        />
      );
    }

    return (
      <p className="text-muted-foreground text-sm">
        File type not supported for preview.{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Open externally
        </a>
        .
      </p>
    );
  };

  return (
    <div className="grid col-span-1 md:col-span-2 gap-5">
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="bg-slate-200 p-4 border-b">
          <h3
            className={cn(
              "font-medium text-slate-700 flex items-center gap-2",
              title?.className
            )}
          >
            <FileStack className="h-4 w-4" />
            Attached File
          </h3>
        </div>

        <CardContent className="p-4 space-y-2">
          {fileUrl ? (
            renderPreview(fileUrl)
          ) : (
            <p className="text-muted-foreground">No file attached.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
