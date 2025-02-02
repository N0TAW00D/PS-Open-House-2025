'use client'

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { event_registration } from '@/app/schemas/file';
import Example from '../comboBox';

import { useRouter } from 'next/navigation';

import { BigSubmitButton } from './FormSubmit';


// Predefined data for dropdowns
const PARENT_TITLES = ['นาย', 'นาง', 'นางสาว'];
const STUDENT_TITLES = ['นาย', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'];
const GRADE_LEVELS = [
    'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6',
    'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'
];
const questionOptions = [
    { id: 1, label: 'International Program' },
    { id: 2, label: 'English Program' },
    { id: 3, label: 'Intensive English Program' },
    { id: 4, label: 'General Program' },
];
const TIME_SLOTS = [
    'รอบเช้า 08.00 - 12.00 น.',
    'รอบบ่าย 12.00 - 16.00 น.'
    // 'ไม่สนใจ'
];
const LECTURE_OPTIONS = [
    'โครงการฯ IEP / GP รอบเช้า เวลา 10.00 - 12.00 น.',
    'โครงการฯ IP / EP รอบบ่าย เวลา 13.00 - 15.00 น.',
    'ทั้งรอบเช้า และ รอบบ่าย'
    // 'ไม่สนใจ'
];

interface EventRegProps {
    email: string;  // Explicitly type the email as a string
}



export default function Eventreg({ email }: EventRegProps) {
    const supabase = createClient();
    const router = useRouter(); // Add this line
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);



    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm<event_registration>();
    // const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [course_programs, setCourse_programs] = useState<number[]>([]);

    const handleOptionToggle = (id: number) => {
        setCourse_programs((prev) =>
            prev.includes(id) ? prev.filter((option) => option !== id) : [...prev, id]
        );
    };

    const onSubmit = async (data: any) => {
        const registrationData = { ...data, course_programs };

        try {
            const { data: checkData, error: checkError } = await supabase
                .from('role')
                .select('form')
                .eq('email', email);

            if (checkError) {
                console.error('Error checking role table:', checkError);
                alert('There was an issue validating your submission. Please try again.');
                return;
            }

            console.log('Data from role table:', checkData);

            if (checkData && checkData.length > 0 && checkData[0].form === false) {
                const { error: updateError } = await supabase
                    .from('role')
                    .update({ form: true })
                    .eq('email', email);

                if (updateError) {
                    console.error('Error updating form status:', updateError);
                    alert('Failed to update your form status. Please try again.');
                    return;
                }
                console.log('Form status updated to true.');
            }

            const { error: insertError } = await supabase
                .from('event_registration')
                .insert([registrationData]);

            if (insertError) {
                console.error('Error inserting registration:', insertError);
                // alert('Failed to register. Please try again.');
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            } else {
                router.push('/home');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred. Please try again.');
        }

        // Optional: Handle additional data submission
        await submitYourData(data);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md my-5 ">
            <div className="mb-6 text-center p-2">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-blue-800">
                    ลงทะเบียนเข้าร่วมงาน{" "}
                    <span className="block md:inline">PS OPENHOUSE 2025</span>
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="mb-4">
                    <Controller
                        name="parent_email"
                        control={control}
                        defaultValue={email}  // Set the initial value from the `email` variable
                        rules={{
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                readOnly // Make the field read-only to lock the value
                            />
                        )}
                    />
                    {errors.parent_email && (
                        <p className="text-red-500">{errors.parent_email.message}</p>
                    )}
                </div>

                <p className=" text-xs md:text-sm lg:text-base text-center text-blue-800">
                    บูธนิทรรศการ กิจกรรม ณ สนามหลวงพิลาศวรรณสาร (สนามหน้าเสาธง)
                </p>

                <div>
                    <Label className="text-blue-800">เลือกรอบเวลา</Label>
                    <Controller
                        name="time_slot"  // This is for the time slot
                        control={control}
                        render={({ field }) => (
                            <Select
                                required
                                value={field.value}
                                onValueChange={(timvalue) => {
                                    console.log("Updating value:", timvalue);
                                    field.onChange(timvalue); // Manually update form state
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="------" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_SLOTS.map((title1) => (
                                        <SelectItem key={title1} value={title1}>
                                            {title1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                {/* Course Programs */}
                <div className="p-2">
                    <Label className="text-blue-800">ประเภทหลักสูตร / แผนการเรียน ที่สนใจ <span className='text-red-400'>(สามารถเลือกได้มากกว่า 1 ข้อ)</span></Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        {questionOptions.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`option-${option.id}`}
                                    checked={course_programs.includes(option.id)}
                                    onCheckedChange={() => handleOptionToggle(option.id)}
                                />
                                <Label
                                    htmlFor={`option-${option.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                    {course_programs.length === 0 && <p className="text-xs text-red-500 mt-2">กรุณาเลือกอย่างน้อยหนึ่งหลักสูตร</p>}
                </div>

                <div>
                    <Label className='text-blue-800'>สนใจฟังบรรยายหลักสูตร</Label>
                    <Controller
                        name="lecture_preference"
                        control={control}
                        render={({ field }) => (
                            <Select
                                required
                                value={field.value}
                                onValueChange={(value) => {
                                    console.log("Updating value:", value);
                                    field.onChange(value); // Manually update form state
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="------" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LECTURE_OPTIONS.map((title) => (
                                        <SelectItem key={title} value={title}>
                                            {title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Parent Information */}
                <div className="space-y-4 p-2">
                    <h2 className="text-xl font-semibold text-blue-800">ข้อมูลผู้ปกครอง</h2>

                    {/* Parent Name */}
                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2">
                            <Controller
                                name="parent_title"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        required
                                        value={field.value}
                                        onValueChange={(value) => {
                                            console.log("Updating value:", value);
                                            field.onChange(value); // Manually update form state
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="คำนำหน้า" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PARENT_TITLES.map((title) => (
                                                <SelectItem key={title} value={title}>
                                                    {title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="col-span-4">
                            <Controller
                                name="parent_first_name"
                                control={control}
                                rules={{ required: 'Parent first name is required' }}
                                render={({ field }) => <Input {...field} value={field.value || ''} placeholder="ชื่อ" />}
                            />
                            {errors.parent_first_name && <p className="text-xs text-red-500 text-xs mt-2">{errors.parent_first_name.message}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="parent_last_name"
                            control={control}
                            rules={{ required: 'Parent last name is required' }}
                            render={({ field }) => <Input {...field} value={field.value || ''} placeholder="นามสกุล" />}
                        />
                        {errors.parent_last_name && <p className="text-red-500 text-xs mt-2">{errors.parent_last_name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="parent_phone"
                            control={control}
                            rules={{
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9-]+$/,
                                    message: "Phone number must contain only digits and '-'"
                                }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="เบอร์โทรศัพท์"
                                />
                            )}
                        />
                        {errors.parent_phone && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.parent_phone.message}
                            </p>
                        )}
                    </div>

                </div>

                {/* Student Information */}
                <div className="space-y-4 p-2">
                    <h2 className="text-xl font-semibold text-blue-800">ข้อมูลนักเรียน</h2>

                    {/* Parent Name */}
                    <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-2">
                            <Controller
                                name="student_title"  // This is for the student's title
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        required
                                        value={field.value}
                                        onValueChange={(value1) => {
                                            console.log("Updating value:", value1);
                                            field.onChange(value1); // Manually update form state
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="คำนำหน้า" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STUDENT_TITLES.map((title) => (
                                                <SelectItem key={title} value={title}>
                                                    {title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="col-span-4">
                            <Controller
                                name="student_first_name"
                                control={control}
                                rules={{ required: 'Student first name is required' }}
                                render={({ field }) => <Input {...field} value={field.value || ''} placeholder="ชื่อ" />}
                            />
                            {errors.student_first_name && <p className="text-red-500 text-xs mt-2">{errors.student_first_name.message}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="student_last_name"
                            control={control}
                            rules={{ required: 'Student last name is required' }}
                            render={({ field }) => <Input {...field} value={field.value || ''} placeholder="นามสกุล" />}
                        />
                        {errors.student_last_name && <p className="text-red-500 text-xs mt-2">{errors.student_last_name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="current_school"
                            control={control}
                            rules={{ required: 'กรุณาเลือกโรงเรียน' }}
                            render={({ field }) => (
                                <Example
                                    setValue={setValue} // Pass the setValue function to Example
                                    value={field.value} // Pass the current value from the form
                                />
                            )}
                        />
                        {errors.current_school && (
                            <p className="text-red-500 text-xs mt-2">{errors.current_school.message}</p>
                        )}
                    </div>


                    <div>

                        <Controller
                            name="grade_level"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    required
                                    value={field.value}
                                    onValueChange={(value) => {
                                        console.log("Updating value:", value);
                                        field.onChange(value); // Manually update form state
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="ศึกษาในระดับชั้น" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GRADE_LEVELS.map((title) => (
                                            <SelectItem key={title} value={title}>
                                                {title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                    </div>

                    {/* Total Participants */}
                    <div>
                        <Label className='text-blue-800'>จำนวนผู้เข้างานทั้งหมด</Label>
                        <Input
                            type="number"
                            min="1"
                            {...register('total_participants', {
                                required: 'กรุณาระบุจำนวนผู้เข้าร่วม',
                                min: {
                                    value: 1,
                                    message: 'จำนวนผู้เข้าร่วมต้องมากกว่า 0'
                                }
                            })}
                            placeholder="นับรวมตัวท่านเอง บุคคลในครอบครัว และนักเรียน"
                        />
                        {errors.total_participants && <p className="text-red-500 text-xs mt-2">{errors.total_participants.message}</p>}
                    </div>


                </div>
                <BigSubmitButton
                    className="w-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    ยืนยันการลงทะเบียน
                </BigSubmitButton>
                {/* <Button type="submit" className="w-full p-2" style={{ backgroundColor: "#1537e8" }}>ยืนยันการลงทะเบียน</Button> */}
            </form>
        </div>
    );
}
async function submitYourData(data: any) {
    try {
        console.log("Submitting additional data:", data);
        // Perform any additional submission logic here, e.g., send data to an API.
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
        console.log("Data successfully submitted.");
    } catch (error) {
        console.error("Error in submitYourData:", error);
        throw new Error("Submission failed");
    }
}
