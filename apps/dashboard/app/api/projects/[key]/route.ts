import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ key: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { key } = await context.params;

    const project = await prisma.project.findUnique({
      where: { key },
      include: {
        services: {
          include: {
            deployments: {
              include: { environment: true },
              orderBy: { startedAt: "desc" },
              take: 10,
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: `Project "${key}" not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("GET /api/projects/[key] error", err);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}