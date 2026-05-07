import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DashboardUserButton } from "@/components/dashboard/dashboard-user-button";



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- LAZY SYNC USER TO PRISMA ---
  // This bypasses the need for webhooks! 
  // We check if the user exists in our DB when they visit the dashboard.
  const authObject = await auth();
  const userId = authObject.userId;
  
  if (userId) {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: email ? { email } : {},
      create: {
        clerkId: userId,
        email: email || `${userId}@clerk.local`,
        role: "BANK_USER", // default role assigned on signup
      },
    });
  }
  // --------------------------------
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-end items-center p-4 gap-4 h-16 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <DashboardUserButton />
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
