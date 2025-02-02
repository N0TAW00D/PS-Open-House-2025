import Image from "next/image";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { signInAction } from "@/app/actions";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default async function Index(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return redirect("/home");
    }

    return (
        <>

            <div className="flex-col-reverse md:flex-row w-screen max-w-full">
                <div className="w-full h-full">
                    <Image
                        src="/image/psopenhouse_banner2.jpg"
                        alt="Logo Icon"
                        layout="responsive" // Ensures the image scales with the container
                        width={1600}  // Original image width
                        height={900}  // Original image height
                        priority
                    />
                </div>
                <div className="w-full overflow-auto items-center justify-center mt-8 mb-8">
                    <Tabs defaultValue="Signup" className="w-full max-w-md mx-auto px-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="Signup">ลงทะเบียน</TabsTrigger>
                            <TabsTrigger value="Log In" id="LogIn">เข้าสู่ระบบ</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Signup">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle style={{ color: "#1537e8" }}>ลงทะเบียน</CardTitle>
                                    <CardDescription>
                                    ยืนยันลิงก์ที่อีเมลแล้วใช่ไหม?{" "}
                                        <a style={{ color: "#1537e8" }} href="#LogIn">เข้าสู่ระบบ</a>

                                    </CardDescription>
                                </CardHeader>
                                <form>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="email">E-mail</Label>
                                            <Input name="email" type="email" placeholder="อีเมล" required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="password">Password </Label>&nbsp;<span className="text-xs text-red-400">อย่างน้อย 6 ตัวอักษร</span>
                                            <Input type="password" name="password" minLength={6} placeholder="รหัสผ่าน" required />

                                        </div>

                                    </CardContent>
                                    <CardFooter>
                                        <SubmitButton className="w-full" formAction={signUpAction} pendingText="Signing up...">
                                            ลงทะเบียน
                                        </SubmitButton>

                                    </CardFooter>
                                    <CardContent><FormMessage message={searchParams} /></CardContent>

                                </form>
                            </Card>
                        </TabsContent>
                        <TabsContent value="Log In" id="LogIn">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle style={{ color: "#1537e8" }}>เข้าสู่ระบบ</CardTitle>
                                    <CardDescription>
                                        กรุณายืนยันอีเมลของคุณให้เรียบร้อยเพื่อดำเนินการต่อ
                                    </CardDescription>
                                </CardHeader>
                                <form>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="current">E-mail</Label>
                                            <Input name="email" type="email" placeholder="อีเมล" required />
                                        </div>
                                        <div className="space-y-1 flex-end">
                                            <Label htmlFor="new">Password</Label>
                                            <Input name="password" type="password" placeholder="รหัสผ่าน" required />
                                            <div className="flex justify-between items-center">
                                                <Label></Label>
                                                <Link
                                                    className="text-xs text-foreground underline"
                                                    href="/forgot-password"
                                                >
                                                    ลืมรหัสผ่าน?
                                                </Link>
                                            </div>
                                        </div>

                                    </CardContent>
                                    <CardFooter>
                                        <SubmitButton className="w-full" pendingText="Signing In..." formAction={signInAction}>
                                            เข้าสู่ระบบ
                                        </SubmitButton>

                                    </CardFooter>
                                    <CardContent>
                                        <FormMessage message={searchParams} />
                                    </CardContent>
                                </form>
                                
                            </Card>
                        </TabsContent>
                        <br></br>
                        <div>
                        <h3 className="text-center text-gray-500">มีปัญหาการใช้งานระบบ <h3 className="text-center text-gray-500 inline-block">ติดต่อที่ Line ID : <a className="text-green-500 underline" href="https://lin.ee/oRdNLHL">@409enyek</a></h3></h3>
                        
                        </div>
                        
                    </Tabs>
                </div>
            </div>
        </>
    );
}