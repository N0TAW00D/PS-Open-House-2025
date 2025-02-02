'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ALargeSmallIcon, Bot, CloudSun, Component, Earth, Heart, Languages, RefreshCw, Sun } from 'lucide-react';

import Circle from './ui/circle';
import {
    CircleHelp, CircleCheck, GraduationCap, Stethoscope, Pill, PencilRuler, DraftingCompass, Cpu,
    BookOpenText, Dumbbell, Clapperboard, Palette, Coins, Scale, Globe, Gift, Atom
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from './ui/button';
import { BaseKey } from '@/utils/baseMapping';
import { Label } from '@radix-ui/react-label';

interface Role {
    [key: string]: boolean | string | number;
}

interface RoleDashboardProps {
    initialRole: Role[];
}

const RoleDashboard: React.FC<RoleDashboardProps> = ({ initialRole }) => {
    const [role, setRole] = useState<Role[]>(initialRole);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Set initial update time after component mounts
    useEffect(() => {
        setLastUpdate(new Date());
    }, []);

    const refreshData = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: newRole, error } = await supabase
                .from("role")
                .select("*")
                .eq("user_id", user.id);

            if (error) throw error;

            setRole(newRole || []);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatLastUpdate = (date: Date | null) => {
        if (!date) return '';

        const formatter = new Intl.DateTimeFormat('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        return formatter.format(date).replace(/(\d+)\/(\d+)\/(\d+)/, '$1/$2/$3');
    };

    // const bases = Object.keys(role[0] || {}).filter(key => key.startsWith('base'));

    const bases = Object.keys(role[0] || {}).filter(
        (key) => key.startsWith("base") && !key.startsWith("basem")
    ).sort();

    // const bases = Object.keys(role[0] || {})
    // .filter((key) => key.startsWith("base") && !key.startsWith("basem"))
    // .sort((a, b) => {
    //     const numA = parseInt(a[0].replace('base', ''));
    //     const numB = parseInt(b[0].replace('base', ''));
    //     return numA - numB;
    // })


    // Base configuration for icons, colors, and details
    const baseConfig = {
        base0: {
            icon: Gift,
            color: 'text-yellow-400',
            detail: 'จุดรับของที่ระลึก',
            location: 'ทางเข้าหน้าโรงเรียน',
        },
        base2: {
            icon: GraduationCap,
            color: 'text-green-600',
            detail: '4 หลักสูตร (วิชาการ)',
            location: 'สนามหน้าเสาธง',
        },
        base3: {
            icon: Dumbbell,
            color: 'text-orange-500',
            detail: 'แผนฯ เตรียมมนุษย์-ครุศาสตร์ การกีฬา',
            location: 'สนามหน้าเสาธง',
        },
        base4: {
            icon: Palette,
            color: 'text-pink-600',
            detail: 'แผนฯ เตรียมศิลปกรรม',
            location: 'อาคาร 1 ชั้น 1 ห้อง 111',
        },
        base5: {
            icon: Bot,
            color: 'text-blue-600',
            detail: 'ห้องเรียนวิทย์-เทคโนโลยี #หุ่นยนต์',
            location: 'อาคาร 1 ชั้น 2 ห้อง 123',
        },
        base6: {
            icon: Clapperboard,
            color: 'text-teal-400',
            detail: 'แผนฯ เตรียมนิเทศ',
            location: 'อาคาร 1 ชั้น 2 ห้อง 124',
        },
        base7: {
            icon: Component,
            color: 'text-rose-600',
            detail: 'โครงการภาคภาษาอังกฤษ',
            location: 'อาคาร 1 ชั้น 2 ห้อง 125-126',
        },
        base8: {
            icon: Scale,
            color: 'text-blue-600',
            detail: 'แผนฯ เตรียมนิติ-รัฐศาสตร์',
            location: 'อาคาร 1 ชั้น 5 ห้อง 151',
        },
        base9: {
            icon: BookOpenText,
            color: 'text-indigo-700',
            detail: 'แผนฯ เตรียมมนุษย์-ครุศาสตร์',
            location: 'อาคาร 1 ชั้น 6 ห้อง 163',
        },
        base910: {
            icon: Heart,
            color: 'text-green-500',
            detail: 'ห้องเรียนเตรียมแพทย์ ม.ต้น',
            location: 'อาคาร 3 ชั้น 1 ห้อง 312',
        },
        base911: {
            icon: Coins,
            color: 'text-yellow-500',
            detail: 'แผนฯ เตรียมบริหารธุรกิจ บัญชี และการบริการ',
            location: 'อาคาร 3 ชั้น 2',
        },
        base912: {
            icon: Pill,
            color: 'text-emerald-600',
            detail: 'แผนฯ เตรียมเภสัช-สหเวช',
            location: 'อาคาร 4 ชั้น 2 ห้อง 421',
        },
        base913: {
            icon: Stethoscope,
            color: 'text-green-500',
            detail: 'แผนฯ เตรียมแพทย์',
            location: 'อาคาร 4 ชั้น 2 ห้อง 423',
        },
        base914: {
            icon: Cpu,
            color: 'text-sky-400',
            detail: 'แผนฯ เตรียมวิทย์คอม',
            location: 'อาคาร 4 ชั้น 4',
        },
        base915: {
            icon: PencilRuler,
            color: 'text-rose-600',
            detail: 'แผนฯ เตรียมวิศวะ',
            location: 'อาคาร 5 ชั้น 4 ห้อง 543',
        },
        base916: {
            icon: DraftingCompass,
            color: 'text-indigo-600',
            detail: 'แผนฯ เตรียมสถาปัตย์',
            location: 'อาคาร 5 ชั้น 4 ห้อง 544',
        },
        base917: {
            icon: Earth,
            color: 'text-indigo-600',
            detail: 'ห้องเรียน Inter',
            location: 'อาคาร 6 ชั้น 2',
        },
        basemeeting1: { icon: Sun, color: 'text-orange-500', detail: 'IEP / GP รอบเช้า เวลา 10.00 - 12.00 น.', location:'' },
        basemeeting2: { icon: CloudSun, color: 'text-sky-500', detail: 'IP / EP รอบเช้า เวลา 13.00 - 15.00 น.', location:'' },
    };

    // Mapping for meeting states
    const meetingStateMap = {
        1: "โครงการฯ IEP / GP รอบเช้า เวลา 10.00 - 12.00 น.",
        2: "โครงการฯ IP / EP รอบบ่าย เวลา 13.00 - 15.00 น.",
        3: "ทั้งรอบเช้า และ รอบบ่าย",
    };

    return (
        <div className="w-full md:w-1/2 space-y-4">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold text-rose-500">Checkpoint</h1>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                    {lastUpdate && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            อัพเดทล่าสุด: {formatLastUpdate(lastUpdate)}
                        </span>
                    )}
                    <Button
                        onClick={refreshData}
                        disabled={isLoading}
                        className="bg-white p-2 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all flex items-center justify-center"
                    >
                        <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div>
                {/* Display Meeting Information */}
                <div className="mb-6 rounded-lg">
                    <div className="space-y-2">
                        <label className="text-sm text-blue-800 block space-x-4">
                            ฟังบรรยายหลักสูตร <span className='text-xs text-red-500 inline-block'>(เฉพาะวันเสาร์ที่ 11 มกราคม 2568)</span>
                        </label>
                        {(role[0]?.meeting === 1 || role[0]?.meeting === 3 || role[0]?.basemeeting1 === true) && (
                            <div className="flex space-x-2 items-center">
                                <div className="flex-shrink-0">
                                    <Sun className={`w-6 h-6 ${role[0]?.basemeeting1 === true ? "text-orange-500" : "text-gray-500"}`} />
                                </div>
                                <Input
                                    className={`text-xs w-full ${role[0]?.basemeeting1 === true ? "text-orange-500" : "text-gray-500"}`}
                                    value={meetingStateMap[1]}
                                    type="text"
                                    readOnly
                                />
                            </div>
                        )}

                        {(role[0]?.meeting === 2 || role[0]?.meeting === 3 || role[0]?.basemeeting2 === true) && (
                            <div className="flex space-x-2 items-center">
                                <div className="flex-shrink-0">
                                    <CloudSun className={`w-6 h-6 ${role[0]?.basemeeting2 === true ? "text-sky-500" : "text-gray-500"}`} />
                                </div>
                                <Input
                                    className={`text-xs w-full ${role[0]?.basemeeting2 === true ? "text-sky-500" : "text-gray-500"}`}
                                    value={meetingStateMap[2]}
                                    type="text"
                                    readOnly
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Existing Base Grid */}
                <div className="grid grid-cols-5 gap-x-2 gap-y-9 justify-center justify-items-center mb-4">
                    {bases.map((base, index) => {
                        const { icon, color } = baseConfig[base as BaseKey] || { icon: CircleHelp, color: 'text-gray-300' };
                        const isActive = !!role[0][base]; // Convert to boolean

                        return (
                            <div key={index}>
                                <Circle
                                    baseValue={isActive}
                                    falseIcon={icon}
                                    trueIcon={icon}
                                    whenTrueColor={isActive ? color : 'text-gray-300'}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Accordion for Additional Details */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-rose-500">ข้อมูลเพิ่มเติม</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 text-xs">
                                {bases.map((base, index) => {
                                    const { icon, color, detail,location } = baseConfig[base as BaseKey] || { icon: CircleHelp, color: 'text-gray-300', detail: 'No detail available', location: 'No location available.' };
                                    const isActive = !!role[0][base];

                                    return (
                                        <div>
                                            <div>
                                                <Label className='ml-8 text-gray-400'>{location}</Label>
                                            </div>
                                            <div className="flex space-x-2 items-center" key={index}>
                                                <div className="flex-shrink-0">
                                                    {React.createElement(icon, {
                                                        className: `w-6 h-6 ${isActive ? color : 'text-gray-300'}`,
                                                    })}
                                                </div>

                                                <Input
                                                    className="text-sm w-full"
                                                    value={detail}
                                                    type="text"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default RoleDashboard;