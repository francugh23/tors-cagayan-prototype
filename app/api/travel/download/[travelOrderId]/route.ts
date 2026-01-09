import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ travelOrderId: string }> }
) {
  try {
    // 1. Extract ID
    const { travelOrderId } = await params;

    // 2️. Fetch travel order data
    const to = await prisma.travelOrder.findUnique({
      where: { id: travelOrderId },
      include: {
        requester: {
          include: { designation: true, position: true },
        },
        authority: {
          include: {
            recommending_position: { include: { users: true } },
            approving_position: { include: { users: true } },
          },
        },
      },
    });

    if (!to) {
      return NextResponse.json(
        { error: "Travel order not found" },
        { status: 404 }
      );
    }

    // 3️. Load .docx template
    const templatePath = path.join(process.cwd(), "template", "template.docx");
    const content = fs.readFileSync(templatePath, "binary");

    // 4️. Prepare Docxtemplater
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 5️. Render placeholders
    doc.render({
      code: to.code ?? "N/A",
      requester_name: to.requester_name ?? "N/A",
      position: to.position ?? "N/A",
      designation: to.requester.designation.name ?? "N/A",
      purpose: to.purpose ?? "N/A",
      host: to.host ?? "N/A",
      travel_period: to.travel_period ?? "N/A",
      destination: to.destination ?? "N/A",
      fund_source: to.fund_source ?? "N/A",
      authority_name: to.authority?.id ?? "N/A",
      recommending_name:
        to.authority.recommending_position?.users[0]?.name.toUpperCase() ?? "",
      recommending_position:
        to.authority.recommending_position?.title.toUpperCase() ?? "",
      approving_name:
        to.authority.approving_position.users[0]?.name.toUpperCase() ?? "N/A",
      approving_position:
        to.authority.approving_position.title.toUpperCase() ?? "N/A",
    });

    // 6️. Generate DOCX buffer
    const docxBuffer = doc.getZip().generate({ type: "nodebuffer" }) as Buffer;

    // 7️. Convert DOCX to PDF via Gotenberg
    const fileBlob = new globalThis.Blob([new Uint8Array(docxBuffer)], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const form = new FormData();
    form.append("files", fileBlob, `${to.code}.docx`);

    const response = await fetch(
      `http://gotenberg:3000/forms/libreoffice/convert`,
      {
        method: "POST",
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error(`Gotenberg conversion failed: ${response.statusText}`);
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    // 8️⃣ Return PDF as download
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${to.code}.pdf`,
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

// OLD CODE THAT GENERATES DOCX ONLY

// import fs from "fs";
// import path from "path";
// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";

// export async function GET(
//   _request: Request,
//   { params }: { params: Promise<{ travelOrderId: string }> }
// ) {
//   try {
//     // 🧩 1️⃣ Extract ID
//     const { travelOrderId } = await params;

//     // 🧩 2️⃣ Fetch travel order data
//     const to = await prisma.travelOrder.findUnique({
//       where: { id: travelOrderId },
//       include: {
//         requester: {
//           include: {
//             designation: true,
//             position: true,
//           },
//         },
//         authority: {
//           include: {
//             recommending_position: {
//               include: {
//                 users: true, // all users assigned to that recommending position
//               },
//             },
//             approving_position: {
//               include: {
//                 users: true, // all users assigned to that approving position
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!to) {
//       return NextResponse.json(
//         { error: "Travel order not found" },
//         { status: 404 }
//       );
//     }

//     // 🧩 3️⃣ Load .docx template
//     const templatePath = path.join(process.cwd(), "template", "template.docx");
//     const content = fs.readFileSync(templatePath, "binary");

//     // 🧩 4️⃣ Prepare Docxtemplater
//     const zip = new PizZip(content);
//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true,
//     });

//     // 🧩 5️⃣ Render placeholders with actual data
//     doc.render({
//       code: to.code ?? "N/A",
//       requester_name: to.requester_name ?? "N/A",
//       position: to.position ?? "N/A",
//       designation: to.requester.designation.name ?? "N/A",
//       purpose: to.purpose ?? "N/A",
//       host: to.host ?? "N/A",
//       travel_period: to.travel_period ?? "N/A",
//       destination: to.destination ?? "N/A",
//       fund_source: to.fund_source ?? "N/A",
//       authority_name: to.authority?.id ?? "N/A",
//       recommending_name: to.authority.recommending_position?.users[0]?.name.toUpperCase() ?? "",
//       recommending_position: to.authority.recommending_position?.title.toUpperCase() || "",
//       approving_name: to.authority.approving_position.users[0]?.name.toUpperCase() ?? "N/A",
//       approving_position: to.authority.approving_position.title.toUpperCase() ?? "N/A",
//     });

//     // 🧩 6️⃣ Generate DOCX buffer
//     const buffer = doc.getZip().generate({ type: "nodebuffer" });

//     // 🧩 7️⃣ Return as file download
//     return new NextResponse(buffer as any, {
//       status: 200,
//       headers: {
//         "Content-Type":
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         "Content-Disposition": `attachment; filename=${to.code}.docx`,
//       },
//     });
//   } catch (err) {
//     console.error("DOCX generation failed:", err);
//     return NextResponse.json(
//       { error: "Failed to generate DOCX" },
//       { status: 500 }
//     );
//   }
// }