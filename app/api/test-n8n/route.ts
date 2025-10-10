import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer, then to Uint8Array (for Blob)
    const bytes = await file.arrayBuffer();

    // Create FormData to send binary file to n8n
    const n8nFormData = new FormData();
    n8nFormData.append(
      "data",
      new Blob([bytes], { type: file.type }),
      file.name
    );
    n8nFormData.append("fileName", file.name);

    const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      body: n8nFormData, // Send binary file directly
    });

    const n8nResult = await res.json();

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      n8nResponse: n8nResult,
    });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}