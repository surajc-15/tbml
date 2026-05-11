import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="w-full flex-1 flex overflow-hidden bg-slate-50">
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative">
        {children}
      </main>
    </div>
  );
}
