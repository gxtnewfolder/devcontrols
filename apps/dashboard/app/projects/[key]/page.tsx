import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ key: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { key } = await params;

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
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">{project.name}</h2>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
          <span className="inline-flex items-center rounded-md border border-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
            {project.type}
          </span>
          <span className="text-xs text-slate-500">key: {project.key}</span>
        </div>
        {project.description && (
          <p className="mt-2 text-sm text-slate-300">
            {project.description}
          </p>
        )}
      </div>

      {/* Services */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Services</h3>

        {project.services.length === 0 ? (
          <p className="text-sm text-slate-400">No services configured.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {project.services.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.key}</div>
                  </div>
                  <span className="inline-flex items-center rounded-md border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                    {s.ciProvider || "no-ci"}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="text-xs text-slate-400 mb-1">
                    Last deployments
                  </div>
                  {s.deployments.length === 0 ? (
                    <div className="text-xs text-slate-500">
                      No deployments yet.
                    </div>
                  ) : (
                    s.deployments.slice(0, 5).map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-400">
                          {d.environment.key.toUpperCase()}
                        </span>
                        <span className="font-mono text-[11px]">
                          {d.version.slice(0, 7)}
                        </span>
                        <span
                          className={
                            d.status === "success"
                              ? "text-emerald-400"
                              : d.status === "failed"
                              ? "text-rose-400"
                              : "text-amber-300"
                          }
                        >
                          {d.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}