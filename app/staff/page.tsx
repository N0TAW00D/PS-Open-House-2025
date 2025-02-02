import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import Dashboard from "@/components/dashboard";

// page.jsx
export default async function Page() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/");


  // Fetch initial data
  const { data: userRole } = await supabase
    .from("role")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch initial scan logs
  const { data: scanLogs, error: scanLogsError } = await supabase
    .from("scan_logs")
    .select("*, scanned_user_id, base_number, timestamp")
    .eq("scanner_id", user.id)
    .order("timestamp", { ascending: false })
    .limit(10);

  // Handle potential errors or null values
  if (scanLogsError) {
    console.error("Error fetching scan logs:", scanLogsError.message);
  }
  const safeScanLogs = scanLogs || []; // Default to an empty array if null

  // Fetch initial user details
  const scannedUserIds = safeScanLogs.map((log) => log.scanned_user_id);
  const { data: scannedUsers, error: scannedUsersError } = await supabase
    .from("role")
    .select("user_id, email")
    .in("user_id", scannedUserIds);

  // Enrich initial scan logs
  const enrichedScanLogs = safeScanLogs.map((log) => {
    const userInfo = scannedUsers?.find((user) => user.user_id === log.scanned_user_id);
    return {
      ...log,
      userInfo: userInfo || { email: "N/A" },
    };
  });

  return (
    <Dashboard
      initialUser={user}
      initialUserRole={userRole}
      initialScanLogs={enrichedScanLogs}
    />
  );
}