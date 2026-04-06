"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function AdminLogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 md:w-full md:justify-start md:px-4 md:py-3"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden md:inline">Logout</span>
    </button>
  );
}