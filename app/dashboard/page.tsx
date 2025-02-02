"use client"

import { ChartComponent } from "@/components/ui/bigChart";
import { DonutComponent } from "@/components/ui/donut";
import { MenubarDemo } from "@/components/ui/menu";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "../actions";
import { baseNames } from "@/utils/baseMapping";
import { SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient();

export default function Dashboard() {
    const [uniqueUsers10, setUniqueUsers10] = useState(0);
    const [uniqueUsers11, setUniqueUsers11] = useState(0);
    const [baseCounts10, setBaseCounts10] = useState([]);
    const [baseCounts11, setBaseCounts11] = useState([]);
    const [counts, setCounts] = useState({ eventCount: 0, userCount: 0 });
    const date10 = "2025-01-10"; // YYYY / MM / DD
    const date11 = "2025-01-11"; // Use the desired date
    const today = new Date();

    useEffect(() => {
        async function fetchData() {

            // Fetch unique users
            const uniqueUserCount10 = await getUniqueUsersByDate(date10);
            setUniqueUsers10(uniqueUserCount10);

            // Fetch base counts
            const baseCountData10 = await getBaseCountsByDate(date10);
            setBaseCounts10(baseCountData10);

            // Fetch unique users
            const uniqueUserCount11 = await getUniqueUsersByDate(date11);
            setUniqueUsers11(uniqueUserCount11);

            // Fetch base counts
            const baseCountData11 = await getBaseCountsByDate(date11);
            setBaseCounts11(baseCountData11);

            const eventCount = await fetchEventCount(supabase);
            const userCount = await fetchUserCount(supabase);

            setCounts({ eventCount, userCount });
        }

        fetchData();
    }, []);

    async function getUniqueUsersByDate(date: string) {
        const { data, error } = await supabase.rpc("unique_users_by_date", { filter_date: date });

        if (error) {
            console.error("Error fetching unique users:", error);
            return 0;
        }

        return data[0]?.unique_user_count || 0;
    }

    async function getBaseCountsByDate(date: string) {
        const { data, error } = await supabase.rpc("base_counts_by_date", { filter_date: date });

        if (error) {
            console.error("Error fetching base counts:", error);
            return [];
        }

        return data;
    }

    async function fetchEventCount(supabase: SupabaseClient<any, "public", any>) {
        const { count, error } = await supabase
            .from("event_registration")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Error fetching event count:", error);
            return 0;
        }

        return count || 0;
    }

    async function fetchUserCount(supabase: SupabaseClient<any, "public", any>) {
        const { count, error } = await supabase
            .from("role")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Error fetching user count:", error);
            return 0;
        }

        return count || 0;
    }

    const totalUniqueUsers = uniqueUsers10 + uniqueUsers11;

    const differUser = counts.userCount - counts.eventCount;

    return (
        <>
            <div className="mx-auto space-y-6">
                <div className="flex items-center justify-center">
                    <MenubarDemo />
                </div>
                <div className="flex w-full space-x-2">
                    <DonutComponent
                        data={[
                            { browser: "Unsuccess", visitors: differUser, fill: "hsl(var(--chart-3))" },
                            { browser: "Checked In", visitors: totalUniqueUsers, fill: "hsl(var(--chart-2))" },
                            { browser: "Success", visitors: counts.eventCount-totalUniqueUsers, fill: "hsl(var(--chart-1))" },
                        ]}
                    />
                    <ChartComponent
                        baseCounts10={baseCounts10}
                        baseCounts11={baseCounts11}
                        uniqueUsers10={uniqueUsers10}
                        uniqueUsers11={uniqueUsers11}
                    />
                </div>
            </div>

            <div className="flex items-center justify-center pt-4">
                <form action={signOutAction}>
                    <Button type="submit" variant="destructive">
                        ออกจากระบบ
                    </Button>
                </form>
            </div>
        </>
    );
}
