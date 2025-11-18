import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error("GET /api/projects error", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}