import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function isAuthenticatedAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return !!user;
}

export async function GET() {
  try {
    const authenticated = await isAuthenticatedAdmin();

    if (!authenticated) {
      return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
    }

    const admin = createAdminClient();

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfTodayIso = startOfToday.toISOString();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    const startOfSevenDaysAgo = new Date(
      sevenDaysAgo.getFullYear(),
      sevenDaysAgo.getMonth(),
      sevenDaysAgo.getDate()
    ).toISOString();

    const [
      totalRequestsRes,
      newTodayRes,
      inProgressRes,
      resolvedRes,
      criticalRes,
      allRequestsRes,
      last7DaysRes,
    ] = await Promise.all([
      admin.from("requests").select("id", { count: "exact", head: true }),
      admin
        .from("requests")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfTodayIso),
      admin
        .from("requests")
        .select("id", { count: "exact", head: true })
        .in("status", ["În verificare", "Alocată", "În lucru", "Escaladată"]),
      admin
        .from("requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "Rezolvată"),
      admin
        .from("requests")
        .select("id", { count: "exact", head: true })
        .eq("priority", "Critică"),
      admin.from("requests").select("status, category"),
      admin
        .from("requests")
        .select("created_at")
        .gte("created_at", startOfSevenDaysAgo)
        .order("created_at", { ascending: true }),
    ]);

    const statusCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    for (const item of allRequestsRes.data ?? []) {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }

    const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));

    const categoryDistribution = Object.entries(categoryCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);

    const last7DaysMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      last7DaysMap[key] = 0;
    }

    for (const item of last7DaysRes.data ?? []) {
      const key = new Date(item.created_at).toISOString().slice(0, 10);
      if (key in last7DaysMap) {
        last7DaysMap[key] += 1;
      }
    }

    const dailyRequests = Object.entries(last7DaysMap).map(([date, value]) => ({
      date,
      value,
    }));

    return NextResponse.json({
      kpis: {
        totalRequests: totalRequestsRes.count ?? 0,
        newToday: newTodayRes.count ?? 0,
        inProgress: inProgressRes.count ?? 0,
        resolved: resolvedRes.count ?? 0,
        critical: criticalRes.count ?? 0,
      },
      statusDistribution,
      categoryDistribution,
      dailyRequests,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return NextResponse.json(
      { error: "Nu am putut încărca dashboard-ul." },
      { status: 500 }
    );
  }
}