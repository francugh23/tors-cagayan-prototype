import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["requester_name", "position", "travel_order_code"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return Response.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Call n8n webhook
    const n8nResponse = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${await n8nResponse.text()}`);
    }

    const result = await n8nResponse.json();

    return Response.json(result);
  } catch (error) {
    console.error("Error generating travel document:", error);
    return Response.json(
      { error: "Failed to generate travel document" },
      { status: 500 }
    );
  }
}