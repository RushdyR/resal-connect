import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activations, partners } from "@/lib/schema";
import { sendSubmissionEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerId, merchantId, merchantName, merchantEmail, earnPoints, redeemPoints } = body;

    if (!partnerId || !merchantId || !merchantName || !merchantEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!earnPoints && !redeemPoints) {
      return NextResponse.json({ error: "Select at least one option" }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db.insert(activations).values({
      id: uuidv4(),
      partnerId,
      merchantId,
      merchantName,
      merchantEmail,
      earnPoints: earnPoints || false,
      redeemPoints: redeemPoints || false,
      createdAt: now,
      status: "pending",
    });

    // Get partner name for email
    const allPartners = await db.select().from(partners);
    const partner = allPartners.find((p) => p.id === partnerId);

    const types: string[] = [];
    if (earnPoints) types.push("Earn Points");
    if (redeemPoints) types.push("Redeem Points");

    sendSubmissionEmail({
      merchantName,
      merchantEmail,
      merchantPhone: "",
      partners: [{ partnerName: partner?.name || partnerId, interestType: types.join(" + ") }],
      submittedAt: now,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allActivations = await db.select().from(activations).orderBy(desc(activations.createdAt));
  const allPartners = await db.select().from(partners);
  const partnerMap = new Map(allPartners.map((p) => [p.id, p]));

  const result = allActivations.map((act) => ({
    ...act,
    partner: partnerMap.get(act.partnerId),
  }));

  return NextResponse.json(result);
}
