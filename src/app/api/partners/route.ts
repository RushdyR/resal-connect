import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const allPartners = await db
    .select()
    .from(partners)
    .orderBy(asc(partners.sortOrder));

  return NextResponse.json(allPartners);
}
