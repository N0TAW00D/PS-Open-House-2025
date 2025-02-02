'use client'

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { signOutAction } from '@/app/actions';
import Image from "next/image";
import QRReader from "@/components/qrReader";
import { Toaster } from "sonner";
import { baseNames,BaseKey } from "@/utils/baseMapping";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import ScanHistory from "@/components/scanHistory";
import { MenubarDemo } from './ui/menu';

interface User {
    id: string;
    // Add other user properties as needed
}

interface UserRole {
    role: 'staff' | 'joiner';
    [key: string]: boolean | string; // For dynamic base permissions like base1, base2, etc.
}


interface ScanLog {
    id: string;
    scanner_id: string;
    scanned_user_id: any;
    base_number: any;
    timestamp: any;
    userInfo?: {
        email: any;
    };
}

interface DashboardProps {
    initialUser: User;
    initialUserRole: UserRole;
    initialScanLogs: ScanLog[];
}



const Dashboard = ({ initialUser, initialUserRole, initialScanLogs }: DashboardProps) => {
    // Rest of your component code remains the same
    const [scanLogs, setScanLogs] = useState<any>(initialScanLogs);
    const supabase = createClient();

    const fetchUpdatedScanLogs = async () => {
        try {
            // Fetch the latest scan logs
            const { data: newScanLogs, error: scanError } = await supabase
                .from("scan_logs")
                .select("*, scanned_user_id, base_number, timestamp")
                .eq("scanner_id", initialUser.id)
                .order("timestamp", { ascending: false })
                .limit(10);

            if (scanError) throw scanError;

            // Fetch user details for the scanned users
            const scannedUserIds = newScanLogs.map((log) => log.scanned_user_id);
            const { data: scannedUsers, error: userError } = await supabase
                .from("role")
                .select("user_id, email")
                .in("user_id", scannedUserIds);

            if (userError) throw userError;

            // Enrich the scan logs with user information
            const enrichedScanLogs = newScanLogs.map((log) => {
                const userInfo = scannedUsers.find((user) => user.user_id === log.scanned_user_id);
                return {
                    ...log,
                    userInfo: userInfo || { email: "N/A" },
                };
            });

            setScanLogs(enrichedScanLogs);
        } catch (error) {
            console.error("Error refreshing scan logs:", error);
        }
    };
    const handleScannedData = async (formData: { baseNumber: string; scannedUserId: any; timestamp: any; }) => {
        try {
            if (initialUserRole.role === 'staff') {
                type JoinerData = { [key: string]: boolean | undefined };
    
                // Check if base is already marked
                const { data: joinerData, error: checkError } = await supabase
                    .from('role')
                    .select(`${formData.baseNumber}`)
                    .eq('user_id', formData.scannedUserId)
                    .eq('role', 'joiner')
                    .single();
    
                if (checkError || !joinerData) {
                    return {
                        success: false,
                        message: 'Error checking joiner data.',
                        error: checkError || 'No data found',
                    };
                }
    
                const joinerDataTyped = joinerData as unknown as JoinerData; // Explicitly type the data
    
                if (joinerDataTyped[formData.baseNumber] === true) {
                    return {
                        success: false,
                        alreadyChecked: true,
                    };
                }

                // Update base status
                const { error: updateError } = await supabase
                    .from('role')
                    .update({
                        [`${formData.baseNumber}`]: true
                    })
                    .eq('user_id', formData.scannedUserId)
                    .eq('role', 'joiner');

                if (updateError) throw updateError;

                // Log the scan
                const { error: logError } = await supabase
                    .from('scan_logs')
                    .insert([
                        {
                            scanner_id: initialUser.id,
                            scanned_user_id: formData.scannedUserId,
                            base_number: formData.baseNumber,
                            timestamp: formData.timestamp
                        }
                    ]);

                if (logError) throw logError;

                // Refresh the scan history
                await fetchUpdatedScanLogs();
            }

            return { success: true };
        } catch (error:any) {
            console.error('Error processing scan:', error);
            return { success: false, error: error.message };
        }
    };

    const basePermissions = Object.fromEntries(
        Object.entries(initialUserRole).filter(([key]) => key.startsWith('base'))
    );

    return (
        <>
            <Toaster richColors />
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-center">
                    <MenubarDemo />
                </div>

                <div className="w-full flex flex-col md:flex-row md:space-x-2 lg:space-x-2 bg-gray-50 rounded-xl shadow-md">
                    <div className="w-full md:w-1/2">
                        <div className="w-full overflow-hidden rounded-xl bg-white">
                            <Image
                                src="/image/psopenhouse_banner2.jpg"
                                alt="Logo Icon"
                                layout="responsive"
                                width={1600}
                                height={900}
                                priority
                                className="rounded-t-xl"
                            />

                            <div className="bg-gradient-to-r from-[#f0f4fb] to-[#fdeaf1] p-4 text-gray-700 md:shadow-lg rounded-b-xl">
                                <h1 className="text-xl text-blue-800 mb-2">จุดเช็คอิน</h1>
                                <div className="max-w-md mx-auto">
                                    <QRReader
                                        userRole={initialUserRole.role}
                                        basePermissions={basePermissions}
                                        onSuccessfulScan={handleScannedData}
                                    />
                                </div>

                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-rose-500">ฐานที่ดูแล</AccordionTrigger>
                                        <AccordionContent>
                                            {initialUserRole.role === 'staff' && (
                                                <div className="rounded-lg">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {Object.entries(basePermissions)
                                                            .filter(([_, hasPermission]) => hasPermission)
                                                            .sort((a, b) => {
                                                                const numA = parseInt(a[0].replace('base', ''));
                                                                const numB = parseInt(b[0].replace('base', ''));
                                                                return numA - numB;
                                                            })
                                                            .map(([base]) => (
                                                                <div key={base} className="p-3 rounded-lg bg-green-100 border-l-4 border-green-500">
                                                                    <div className="flex items-center justify-between">
                                                                        <div>
                                                                            <div className="text-xs sm:text-sm md:text-sm">
                                                                                {baseNames[base as BaseKey]}
                                                                            </div>
                                                                        </div>
                                                                        <div className="px-2 py-1 rounded-full text-xs sm:text-sm inline-block whitespace-nowrap bg-green-200 text-green-800">
                                                                            มีสิทธิ์
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="w-full overflow-hidden rounded-xl bg-white">
                            <ScanHistory initialLogs={scanLogs} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center pt-4">
                    <form action={signOutAction}>
                        <Button type="submit" variant="destructive">
                            ออกจากระบบ
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Dashboard;