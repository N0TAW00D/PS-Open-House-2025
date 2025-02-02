import { Input } from "@/components/ui/input";
import { BookOpenText, Clapperboard, Coins, Cpu, DraftingCompass, Dumbbell, Gift, Globe, GraduationCap,Palette,PencilRuler,Pill,Scale,School, Stethoscope } from "lucide-react";

export default function Boot() {
    return (
        <div className="space-y-4">
            <h1 className="text-blue-800">บูธนิทรรศการต่างๆ</h1>
            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="4 หลักสูตร (วิชาการ)"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Stethoscope className="w-6 h-6 text-green-500" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="ห้องเรียนเตรียมแพทย์ ม.ต้น และ แผนการเรียนเตรียมแพทย์"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Pill className="w-6 h-6 text-emerald-600" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมเภสัช-สหเวช"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <PencilRuler className="w-6 h-6 text-rose-600" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมวิศวะ"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <DraftingCompass className="w-6 h-6 text-indigo-600" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมสถาปัตย์"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Cpu className="w-6 h-6 text-sky-400" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมวิทย์-คอม และห้องเรียนวิทย์-เทคโนโลยี (หุ่นยนต์) ม.ต้น"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <BookOpenText className="w-6 h-6 text-indigo-700" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมมนุษย์-ครุศาสตร์"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Dumbbell className="w-6 h-6 text-orange-500" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมมนุษย์-ครุศาสตร์ การกีฬา"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Clapperboard className="w-6 h-6 text-teal-400" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมนิเทศ"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Palette className="w-6 h-6 text-pink-600" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมศิปกรรม"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Coins className="w-6 h-6 text-yellow-500" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมบริหารธุรกิจ บัญชี และการบริการ"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Scale className="w-6 h-6 text-blue-600" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แผนการเรียนเตรียมนิติ-รัฐศาสตร์"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Globe className="w-6 h-6 text-rose-600" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="โครงการแลกเปลี่ยนภาษาต่างประเทศ"
                    type="text"
                    readOnly
                />
            </div>

            <div className="flex space-x-2 items-center">
                <div className="flex-shrink-0">
                    <Gift className="w-6 h-6 text-yellow-400" />
                </div>
                <Input
                    className="text-sm w-full"
                    value="แลกรับของที่ระลึก"
                    type="text"
                    readOnly
                />
            </div>
        </div>
    )
}