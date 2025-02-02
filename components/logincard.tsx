"use client";
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

export function TabsDemo() {
    const redirectToSignup = () => {
        window.location.href = '/form/signup'; // Client-side redirect
    };
    return (

        <Tabs defaultValue="Signup" className="w-full max-w-md mx-auto px-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="Signup">Sign Up</TabsTrigger>
                <TabsTrigger value="Log In">Log In</TabsTrigger>
            </TabsList>
            <TabsContent value="Signup">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle style={{ color: "#1537e8" }}>Sign Up</CardTitle>
                        <CardDescription>
                            <p className="text-sm text text-foreground">
                                Already have an account?{" "}
                                <Link className="text-primary font-medium underline" href="/">
                                    Log In
                                </Link>
                            </p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" placeholder="อีเมล" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="รหัสผ่าน" />
                        </div>
                    </CardContent>


                    <CardFooter>
                        <Button onClick={redirectToSignup} className="w-full" style={{ backgroundColor: "#1537e8" }}>Sign Up</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="Log In">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle style={{ color: "#1537e8" }}>Log In | เข้าสู่ระบบ</CardTitle>
                        <CardDescription>
                            Change your Log In here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">E-mail</Label>
                            <Input id="current" type="Log In" placeholder="อีเมล" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new">Password</Label>
                            <Input id="new" type="Log In" placeholder="รหัสผ่าน" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" style={{ backgroundColor: "#1537e8" }} >Continue</Button>

                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
