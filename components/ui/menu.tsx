import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "./button"
import Link from "next/link"

export function MenubarDemo() {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger asChild>
                    <Link href="/staff">เช็คอิน</Link>
                </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger asChild>
                    <Link href="/dashboard">สรุปข้อมูล</Link>
                </MenubarTrigger>
            </MenubarMenu>
        </Menubar>


    )
}
