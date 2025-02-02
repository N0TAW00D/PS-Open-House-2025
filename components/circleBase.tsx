import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import RoleDashboard from "./loadDash";

export default async function Page() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return redirect("/");
    }
  
    const { data: role, error } = await supabase
      .from("role")
      .select("*")
      .eq("user_id", user.id);
  
    if (error) {
      console.error("Error fetching role:", error);
    }
  
    if (!role || role.length === 0) {
      return <div>No role data available</div>;
    }
  
    return <RoleDashboard initialRole={role} />;
  }