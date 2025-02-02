"use client";
import { useState, useEffect, useMemo } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { baseNames } from "@/utils/baseMapping";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import {
    CircleX, Atom, CircleHelp, Palette, CircleCheck, School, Stethoscope, Pill, PencilRuler, Dumbbell, Clapperboard, Camera, FlipHorizontal,
    DraftingCompass, Cpu, BookOpenText, Coins, Scale, GraduationCap, Globe, Gift,
    Sun,
    CloudSun,
    Heart,
    Bot,
    Component,
    Earth
} from 'lucide-react';
import Circle from "./ui/circle";

const supabase = createClient();

interface QRReaderProps {
    userRole: 'staff' | 'joiner';
    basePermissions: Record<string, string | boolean>;
    onSuccessfulScan: (formData: { baseNumber: string; scannedUserId: string; timestamp: string }) => void | any;
}

interface UserData {
    email: string;
    [key: string]: any; // Dynamic fields like base1, base2, etc.
}

export default function QRReader({ userRole, basePermissions, onSuccessfulScan }: QRReaderProps) {
    const [scannedUserId, setScannedUserId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [selectedBase, setSelectedBase] = useState<string | null>(null);

    // Toggle between front and back camera
    const toggleCamera = () => {
        setFacingMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
    };

    // Set default base when component mounts
    useEffect(() => {
        if (userRole === 'staff') {
            const firstAllowedBase = Object.entries(basePermissions)
                .sort((a, b) => parseInt(a[0].replace('base', '')) - parseInt(b[0].replace('base', '')))
                .find(([_, hasPermission]) => hasPermission)?.[0];

            if (firstAllowedBase) {
                setSelectedBase(firstAllowedBase);
            }
        }
    }, [userRole, basePermissions]);

    // Handle QR code scan
    const handleScan = (result: { rawValue: any }[]) => {
        if (result) {
            try {
                const userId = result[0]?.rawValue;
                if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
                    throw new Error("Invalid UUID format");
                }
                setScannedUserId(userId);
                fetchUserData(userId);
                setIsDialogOpen(true);
            } catch (err) {
                setError("Invalid QR code format. Expected UUID.");
                setIsDialogOpen(true);
            }
        }
    };

    // Fetch user data from Supabase
    const fetchUserData = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("role")
                .select("*")
                .eq("user_id", userId)
                .single();

            if (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data.");
                return;
            }

            setUserData(data);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data.");
        }
    };

    // Handle confirmation of scan
    const handleConfirm = async () => {
        if (!selectedBase && userRole === 'staff') {
            toast.error("กรุณาเลือกฐานที่ต้องการ");
            return;
        }

        const basesChecked = Object.keys(userData ?? {})
            .filter((key) => key.startsWith('base') && typeof userData?.[key] === 'boolean')
            .reduce((sum, key) => sum + (userData?.[key] ? 1 : 0), 0);

        if (selectedBase === "base0" && basesChecked <= 11) {
            toast.error("กรุณาเช็คอินฐานเพิ่มเติม");
            setIsDialogOpen(false);
            return;
        }

        if (scannedUserId && onSuccessfulScan) {
            setIsChecking(true);
            const result = await onSuccessfulScan({
                scannedUserId,
                baseNumber: selectedBase!,
                timestamp: new Date().toISOString(),
            });
            setIsChecking(false);

            if (selectedBase && baseNames[selectedBase as keyof typeof baseNames]) {
                if (result.alreadyChecked) {
                    toast.error(`ผู้เข้าร่วมได้เช็คอิน ${baseNames[selectedBase as keyof typeof baseNames]} แล้ว`);
                } else if (result.success) {
                    toast.success(`เช็คอิน ${baseNames[selectedBase as keyof typeof baseNames]} สำเร็จ`);
                } else {
                    toast.error(result.error || "เช็คอินไม่สำเร็จ");
                }
            }
        }

        setIsDialogOpen(false);
        setScannedUserId(null);
        setSelectedBase(null);
    };

    // Get allowed bases for staff
    const allowedBases = useMemo(() => {
        return Object.entries(basePermissions)
            .filter(([_, hasPermission]) => hasPermission)
            .sort((a, b) => parseInt(a[0].replace('base', '')) - parseInt(b[0].replace('base', '')));
    }, [basePermissions]);

    // Render base selector for staff
    const renderBaseSelector = () => {
        if (userRole !== 'staff') return null;

        if (allowedBases.length === 0) {
            return <div className="text-red-500">ไม่มีสิทธิ์ในการเช็คอินที่ฐานใดๆ</div>;
        }

        return (
            <div className="my-4">
                <label className="block text-sm font-medium text-blue-800 mb-2">เลือกฐาน</label>
                <Select value={selectedBase ?? undefined} onValueChange={setSelectedBase} defaultValue={allowedBases[0]?.[0]}>
                    <SelectTrigger className="w-full">
                        <SelectValue>
                            {selectedBase ? baseNames[selectedBase as keyof typeof baseNames] : 'เลือกฐานที่ต้องการ'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {allowedBases.map(([base]) => (
                            <SelectItem key={base} value={base}>
                                {baseNames[base as keyof typeof baseNames]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    // Get icon and color for each base
    const getBaseIcon = (baseKey: string) => {
        switch (baseKey) {
            case 'base0': return { trueIcon: Gift, falseIcon: Gift, color: 'text-yellow-400' }; // จุดรับของที่ระลึก
            case 'base2': return { trueIcon: GraduationCap, falseIcon: GraduationCap, color: 'text-green-600' }; // 4 หลักสูตร (วิชาการ)
            case 'base3': return { trueIcon: Dumbbell, falseIcon: Dumbbell, color: 'text-orange-500' }; // แผนฯ เตรียมมนุษย์-ครุศาสตร์ การกีฬา
            case 'base4': return { trueIcon: Palette, falseIcon: Palette, color: 'text-pink-600' }; // แผนฯ เตรียมศิลปกรรม
            case 'base5': return { trueIcon: Bot, falseIcon: Bot, color: 'text-blue-600' }; // ห้องเรียนวิทย์-เทคโนโลยี #หุ่นยนต์
            case 'base6': return { trueIcon: Clapperboard, falseIcon: Clapperboard, color: 'text-teal-400' }; // แผนฯ เตรียมนิเทศ
            case 'base7': return { trueIcon: Component, falseIcon: Component, color: 'text-rose-600' }; // โครงการภาคภาษาอังกฤษ
            case 'base8': return { trueIcon: Scale, falseIcon: Scale, color: 'text-blue-600' }; // แผนฯ เตรียมนิติ-รัฐศาสตร์
            case 'base9': return { trueIcon: BookOpenText, falseIcon: BookOpenText, color: 'text-indigo-700' }; // แผนฯ เตรียมมนุษย์-ครุศาสตร์
            case 'base910': return { trueIcon: Heart, falseIcon: Heart, color: 'text-green-500' }; // ห้องเรียนเตรียมแพทย์ ม.ต้น
            case 'base911': return { trueIcon: Coins, falseIcon: Coins, color: 'text-yellow-500' }; // แผนฯ เตรียมบริหารธุรกิจ บัญชี และการบริการ
            case 'base912': return { trueIcon: Pill, falseIcon: Pill, color: 'text-emerald-600' }; // แผนฯ เตรียมเภสัช-สหเวช
            case 'base913': return { trueIcon: Stethoscope, falseIcon: Stethoscope, color: 'text-green-500' }; // แผนฯ เตรียมแพทย์
            case 'base914': return { trueIcon: Cpu, falseIcon: Cpu, color: 'text-sky-400' }; // แผนฯ เตรียมวิทย์คอม
            case 'base915': return { trueIcon: PencilRuler, falseIcon: PencilRuler, color: 'text-rose-600' }; // แผนฯ เตรียมวิศวะ
            case 'base916': return { trueIcon: DraftingCompass, falseIcon: DraftingCompass, color: 'text-indigo-600' }; // แผนฯ เตรียมสถาปัตย์
            case 'base917': return { trueIcon: Earth, falseIcon: Earth, color: 'text-indigo-600' }; // ห้องเรียน Inter
            case 'basemeeting1': return { trueIcon: Sun, falseIcon: Sun, color: 'text-orange-500' }; // IEP / GP รอบเช้า เวลา 10.00 - 12.00 น.
            case 'basemeeting2': return { trueIcon: CloudSun, falseIcon: CloudSun, color: 'text-sky-500' }; // IP / EP รอบเช้า เวลา 13.00 - 15.00 น.
            default: return { trueIcon: CircleCheck, falseIcon: CircleHelp, color: 'text-green-500' }; // Default case
        }
    };
    

    return (
        <div className="w-full text-left">
            <div className="relative aspect-square max-w-md mx-auto">
                <Scanner onScan={handleScan} allowMultiple constraints={{ facingMode }} />
                <Button onClick={toggleCamera} className="absolute top-4 right-4 bg-white/80 hover:bg-white/90" size="icon" variant="ghost">
                    <FlipHorizontal className="h-5 w-5 text-blue-800" />
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-left text-blue-800">{error ? "ข้อผิดพลาด" : "ยืนยันการสแกน"}</DialogTitle>
                        <DialogDescription className="text-left text-gray-700">
                            {error ? (
                                <div className="text-red-500">{error}</div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        {userData && (
                                            <div className="mt-2">
                                                <strong>อีเมล :</strong> {userData.email}
                                                <br />
                                                <br />
                                                <p>
                                                    <strong>เช็คอินไปแล้ว <span className="text-gray-500 font-extralight">(ขั้นต่ำ 12 ฐาน)</span> :</strong>{" "}
                                                    <span
                                                        className={
                                                            Object.keys(userData)
                                                                .filter((key) => key.startsWith('base') && !key.startsWith('base1') && !key.startsWith('basem') && typeof userData[key] === 'boolean')
                                                                .reduce((sum, key) => sum + (userData[key] ? 1 : 0), 0) >= 12
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    >
                                                        {Object.keys(userData)
                                                            .filter((key) => key.startsWith('base') && !key.startsWith('base0') && !key.startsWith('basem') && typeof userData[key] === 'boolean')
                                                            .reduce((sum, key) => sum + (userData[key] ? 1 : 0), 0)}
                                                    </span>
                                                    /18 ฐาน
                                                </p>
                                                <br />
                                                <strong>รับของรางวัล :</strong>{" "}
                                                {userData.base0 ? (
                                                    <span className="text-green-600">ได้รับแล้ว</span>
                                                ) : (
                                                    <span className="text-rose-600">ยังไม่ได้รับ</span>
                                                )}

                                                <div className="grid grid-cols-5 mt-4 gap-x-2 gap-y-10 justify-center justify-items-center">
                                                    {Object.keys(userData)
                                                        .filter((key) => key.startsWith('base'))
                                                        .sort()
                                                        .map((key, index) => {
                                                            const { trueIcon, falseIcon, color } = getBaseIcon(key);
                                                            return (
                                                                <div key={index}>
                                                                    <Circle baseValue={userData[key]} falseIcon={falseIcon} trueIcon={trueIcon} whenTrueColor={color} />
                                                                </div>

                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {renderBaseSelector()}
                                    
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <Button
                            variant="outline"
                            className="w-full sm:w-1/2 bg-red-500 text-white hover:bg-red-600"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setError(null);
                                setSelectedBase(null);
                            }}
                        >
                            ยกเลิก
                        </Button>
                        {!error && (
                            <Button
                                className="w-full sm:w-1/2 bg-green-500 text-white hover:bg-green-600"
                                onClick={handleConfirm}
                                disabled={userRole === "staff" && (!selectedBase || isChecking)}
                            >
                                {isChecking ? "กำลังตรวจสอบ..." : "ยืนยัน"}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}