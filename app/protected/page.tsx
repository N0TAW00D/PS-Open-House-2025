import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const userFiltered = { email_confirmed_at: user.email_confirmed_at };

  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {JSON.stringify(user, null, 2)}
        {/* {JSON.stringify(userFiltered, null, 2)} */}
      </pre>
      {JSON.stringify(userFiltered, null, 2)}
      
      <div className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {user.email_confirmed_at || "Not confirmed yet"}
      </div>

      {user.email_confirmed_at || "Not confirmed yet"}
    </>
  );
}
