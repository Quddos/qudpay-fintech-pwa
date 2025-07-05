
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_session")?.value === "1";
  if (!isLoggedIn) {
    redirect("/auth/admin-login");
  }
  return <AdminDashboardClient />;
}
