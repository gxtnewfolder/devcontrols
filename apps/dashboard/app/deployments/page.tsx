import { prisma } from "@/lib/prisma";

export default async function DeploymentsPage() {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Deployments</h2>

      {deployments.length === 0 ? (
        <p className="text-sm text-slate-400">No deployments recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {deployments.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {d.service.project.name} / {d.service.name}
                </div>
                <div className="text-xs text-slate-500">
                  version:{" "}
                  <span className="font-mono">{d.version.slice(0, 12)}</span>{" "}
                  • by {d.triggeredBy}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center rounded-md border border-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
                  {d.environment.key.toUpperCase()}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}