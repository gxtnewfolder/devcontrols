import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevControl",
  description: "Central Dev/MLOps dashboard for Got",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 bg-slate-900 p-4">
            <h1 className="mb-6 text-xl font-semibold">DevControl</h1>
            <nav className="space-y-2 text-sm">
              <a href="/projects" className="block hover:text-sky-400">
                Projects
              </a>
              <a href="/deployments" className="block hover:text-sky-400">
                Deployments
              </a>
              <a href="/ml" className="block hover:text-sky-400">
                ML Console
              </a>
              <a href="/settings" className="block hover:text-sky-400">
                Settings
              </a>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}