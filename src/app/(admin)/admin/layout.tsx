import { currentUser, auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  // This properly terminates the Clerk session token
  // AND invalidates the server-side session cookie
  const { sessionId } = await auth();
  if (sessionId) {
    const client = await clerkClient();
    await client.sessions.revokeSession(sessionId);
  }
  redirect("/auth/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const email = user.primaryEmailAddress?.emailAddress;
  const authorized = isAdminUser(user.id, email);

  if (!authorized) {
    redirect("/");
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" richColors closeButton />
      <AdminSidebar
        userEmail={email || null}
        signoutAction={handleSignOut}
      />
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="py-6 px-4 sm:px-6 lg:py-8 lg:px-8 xl:px-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
