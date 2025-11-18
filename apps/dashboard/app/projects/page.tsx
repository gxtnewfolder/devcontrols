import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-2">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-sm text-slate-400">No projects found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`/projects/${p.key}`}
              className="block rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-sky-500 hover:bg-slate-900 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{p.name}</h3>
                <span className="inline-flex items-center rounded-md border border-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
                  {p.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                {p.description}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}