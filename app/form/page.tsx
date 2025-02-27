import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

import Eventreg from "@/components/ui/form1";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const email = user.email || user.user_metadata?.email;

  return (
    <>
      <Eventreg email={email}></Eventreg>
    </>
  );
}






