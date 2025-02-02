import { Button } from "@/components/ui/button";
import { signOutAction } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import QRCodeGenerator from "@/components/ui/qrGen";
import { CircleUserRound, Phone, Atom, Mail, School, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import PinStat from "@/components/circleBase";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default async function Index() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  // Fetch event registrations for the user
  const { data: event_registration, error } = await supabase
    .from("event_registration")
    .select("*")
    .eq("parent_email", user.email); // Assuming "user_id" links the user to their registrations

  if (error) {
    console.error("Error fetching event registrations:", error);
  }

  return (
    <>
      {/* {JSON.stringify(user, null, 2)} */}
      <div className="w-full h-full overflow-hidden rounded-xl bg-white">
        {/* Image Section */}
        <Image
          src="/image/psopenhouse_banner2.jpg"
          alt="Logo Icon"
          layout="responsive" // Ensures the image scales with the container
          width={1600} // Original image width
          height={900} // Original image height
          priority
          className="rounded-t-xl"
        />

        {/* Content Section */}
        <div className="bg-gradient-to-r from-[#f0f4fb] to-[#fdeaf1] p-6 text-gray-700 md:shadow-lg rounded-b-xl">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Container */}
            <div className="w-full md:w-1/2 space-y-4">
              {event_registration && event_registration.length > 0 ? (
                <div>
                  {event_registration.map((registration) => {
                    // Format the ID with leading zeros or set it to null if no registration ID
                    let formattedId = registration?.id
                      ? `PS${String(registration.id).padStart(4, '0')}`
                      : null;

                    return (
                      <div key={registration.id} className="space-y-4">
                        <h1 className="text-2xl font-semibold text-rose-500 mb-4">
                          QR PASS - {formattedId || 'No ID available'}
                        </h1>
                        <div className="flex justify-center items-center my-5">
                          <div className="qrContainer">
                            <QRCodeGenerator value={user.id || 'No ID Available'} />
                          </div>
                        </div>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-rose-500">ข้อมูลผู้ใช้งาน</AccordionTrigger>
                            <AccordionContent>

                              <div>
                                <label className="text-md text-blue-800 block">
                                  สนใจฟังบรรยายหลักสูตร
                                </label>
                                <div className="flex space-x-2 items-center">
                                  <div className="flex-shrink-0">
                                    <Atom className="w-6 h-6" />
                                  </div>
                                  <Input
                                    className="text-xs w-full"
                                    value={`${registration.lecture_preference}`}
                                    type="text"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-md text-rose-500 block mb-2 mt-4">
                                  ข้อมูลผู้ปกครอง
                                </label>
                                <label className="text-md text-blue-800 block mt-2 mb-1">
                                  ชื่อ - นามสกุล
                                </label>
                                <div className="flex space-x-2 items-center">
                                  <div className="flex-shrink-0">
                                    <CircleUserRound className="w-6 h-6" />
                                  </div>
                                  <Input
                                    className="text-sm w-full"
                                    value={`${registration.parent_title}${registration.parent_first_name} ${registration.parent_last_name}`}
                                    type="text"
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-md text-blue-800 block mt-2 mb-1">
                                  อีเมล
                                </label>
                                <div className="flex space-x-2 items-center">
                                  <div className="flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                  </div>
                                  <Input
                                    className="text-sm w-full"
                                    value={`${registration.parent_email}`}
                                    type="text"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-blue-800 block mt-2 mb-1">
                                  เบอร์โทรศัพท์
                                </label>
                                <div className="flex space-x-2 items-center">
                                  <div className="flex-shrink-0">
                                    <Phone className="w-6 h-6" />
                                  </div>
                                  <Input
                                    className="text-sm w-full"
                                    value={`${registration.parent_phone}`}
                                    type="text"
                                    readOnly
                                  />
                                </div>
                              </div>


                              <div>
                                <label className="text-md text-rose-500 block mb-2 mt-4">
                                  ข้อมูลนักเรียน
                                </label>
                                <label className="text-md text-blue-800 block">
                                  ชื่อ - นามสกุล
                                </label>
                                <div className="flex space-x-2 items-center">
                                  <div className="flex-shrink-0">
                                    <CircleUserRound className="w-6 h-6" />
                                  </div>
                                  <Input
                                    className="text-sm w-full"
                                    value={`${registration.student_title}${registration.student_first_name} ${registration.student_last_name}`}
                                    type="text"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-blue-800 block mt-2 mb-1">
                                  กำลังศึกษาที่
                                </label>
                                <div className="flex space-x-2 items-center">
                                  <div className="flex-shrink-0">
                                    <School className="w-6 h-6" />
                                  </div>
                                  <Input
                                    className="text-sm w-full"
                                    value={`${registration.current_school}`}
                                    type="text"
                                    readOnly
                                  />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500">No event registrations found.</p>
              )}
            </div>
            <PinStat></PinStat>
          </div>
        </div>
      </div>

      <br></br>
      <div className="flex items-center justify-center">
        <form action={signOutAction} className="text-center">
          <Button type="submit" variant="destructive">
            ออกจากระบบ
          </Button>
        </form>
      </div>
    </>
  );
}
