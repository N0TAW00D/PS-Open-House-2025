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
import CourseProgramSelector from './multiplecheck';

// Predefined data for dropdowns
const PARENT_TITLES = ['นาย', 'นาง', 'นางสาว'];
const STUDENT_TITLES = ['นาย', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'];
const GRADE_LEVELS = [
    'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6',
    'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'
];
const COURSE_PROGRAMS = [
    'International Program',
    'English Program',
    'Intensive English Program',
    'General Program'
];

const questionOptions = [
    { id: 1, label: 'International Program' },
    { id: 2, label: 'English Program' },
    { id: 3, label: 'Intensive English Program' },
    { id: 4, label: 'General Program' },
];



const TIME_SLOTS = [
    'รอบเช้า 08.00 - 12.00 น.',
    'รอบบ่าย 12.00 - 16.00 น.',
    'ไม่สนใจ'
];
const LECTURE_OPTIONS = [
    'โครงการฯ IEP / GP รอบเช้า เวลา 10.00 - 12.00 น.',
    'โครงการฯ IP / EP รอบบ่าย เวลา 13.00 - 15.00 น.',
    'ทั้งรอบเช้า และ รอบบ่าย',
    'ไม่สนใจ'
];



export default function EventRegistrationPage() {
    const supabase = createClient();

    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);



    const { control, handleSubmit, setValue, formState: { errors } } = useForm<event_registration>();
    // const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [course_programs, setCourse_programs] = useState<number[]>([]);

    const handleOptionToggle = (id: number) => {
        setCourse_programs((prev) =>
            prev.includes(id) ? prev.filter((option) => option !== id) : [...prev, id]
        );
    };

    const onSubmit = async (data: any) => {
        
        const registrationData = { ...data, course_programs };
        console.log('Form Data:', registrationData);

        try {
            const { error } = await supabase.from('event_registration').insert([registrationData]);
            if (error) {
                console.error('Error registering event:', error);
            } else {
                alert('Event registration successful!');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Event Registration</h1>

            {/* Event Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4 p-4 border rounded">
                {/* Course Programs */}
                <div className="p-2">
                    <Label className="text-blue-800">ประเภทหลักสูตร / แผนการเรียน ที่สนใจ</Label>
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
                </div>




                <div className="mb-4">
                    <Label htmlFor="time_slot">Time Slot</Label>
                    <Controller
                        name="time_slot"
                        control={control}
                        render={({ field }) => (
                            <Select {...field}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Time Slot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_SLOTS.length > 0 ? (
                                        TIME_SLOTS.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                                {slot}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem {...field} value="">Loading...</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="parent_title">Parent's title</Label>
                    <Controller
                        name="parent_title"
                        control={control}
                        rules={{ required: 'Parent first name is required' }}
                        render={({ field }) => <Input {...field} placeholder="Enter Parent's title" />}
                    />
                    {errors.parent_title && <p className="text-red-500">{errors.parent_title.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="parent_first_name">Parent's First Name</Label>
                    <Controller
                        name="parent_first_name"
                        control={control}
                        rules={{ required: 'Parent first name is required' }}
                        render={({ field }) => <Input {...field} placeholder="Enter Parent's First Name" />}
                    />
                    {errors.parent_first_name && <p className="text-red-500">{errors.parent_first_name.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="parent_last_name">Parent's Last Name</Label>
                    <Controller
                        name="parent_last_name"
                        control={control}
                        rules={{ required: 'Parent last name is required' }}
                        render={({ field }) => <Input {...field} placeholder="Enter Parent's Last Name" />}
                    />
                    {errors.parent_last_name && <p className="text-red-500">{errors.parent_last_name.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="parent_email">Parent's Email</Label>
                    <Controller
                        name="parent_email"
                        control={control}
                        rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' } }}
                        render={({ field }) => <Input {...field} type="email" placeholder="Enter Parent's Email" />}
                    />
                    {errors.parent_email && <p className="text-red-500">{errors.parent_email.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="parent_phone">Parent's Phone Number</Label>
                    <Controller
                        name="parent_phone"
                        control={control}
                        rules={{ required: 'Phone number is required' }}
                        render={({ field }) => <Input {...field} placeholder="Enter Parent's Phone Number" />}
                    />
                    {errors.parent_phone && <p className="text-red-500">{errors.parent_phone.message}</p>}
                </div>

                {/* <div className="mb-4">
                    <Label htmlFor="student_title">Student's Title</Label>
                    <Controller
                        name="student_title"
                        control={control}
                        render={({ field }) => (
                            <Select {...field}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Student Title" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STUDENT_TITLES.map((title) => (
                                        <SelectItem key={title} value={title}>{title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div> */}


                <Controller
                    name="student_title"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                console.log("Updating value:", value);
                                field.onChange(value); // Manually update form state
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Student Title" />
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




                <div className="mb-4">
                    <Label htmlFor="student_first_name">Student's First Name</Label>
                    <Controller
                        name="student_first_name"
                        control={control}
                        rules={{ required: 'Student first name is required' }}
                        render={({ field }) => <Input {...field} placeholder="Enter Student's First Name" />}
                    />
                    {errors.student_first_name && <p className="text-red-500">{errors.student_first_name.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="student_last_name">Student's Last Name</Label>
                    <Controller
                        name="student_last_name"
                        control={control}
                        rules={{ required: 'Student last name is required' }}
                        render={({ field }) => <Input {...field} placeholder="Enter Student's Last Name" />}
                    />
                    {errors.student_last_name && <p className="text-red-500">{errors.student_last_name.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="current_school">Current School</Label>
                    <Controller
                        name="current_school"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Enter Current School" />}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <Controller
                        name="grade_level"
                        control={control}
                        render={({ field }) => (
                            <Select {...field}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Grade Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GRADE_LEVELS.map((level) => (
                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>




                <div className="mb-4">
                    <Label htmlFor="lecture_preference">Lecture Preference</Label>
                    <Controller
                        name="lecture_preference"
                        control={control}
                        render={({ field }) => (
                            <Select {...field}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Lecture Preference" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LECTURE_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                    Register
                </Button>
            </form>
        </div>
    );
}
