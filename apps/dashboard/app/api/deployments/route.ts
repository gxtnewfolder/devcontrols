import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const deployments = await prisma.deployment.findMany({
      orderBy: { startedAt: "desc" },
      take: 50,
      include: {
        service: {
          include: { project: true },
        },
        environment: true,
      },
    });

    return NextResponse.json(deployments);
  } catch (err) {
    console.error("GET /api/deployments error", err);
    return NextResponse.json(
      { error: "Failed to fetch deployments" },
      { status: 500 },
    );
  }
}