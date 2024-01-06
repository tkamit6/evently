'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '../ui/button'
import { eventDefaultValues } from '@/app/constants'
import Dropdown from './Dropdown'
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from './FileUploader'
import Image from 'next/image'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "@/components/ui/checkbox"
import { useUploadThing } from '@/lib/uploadthing'
import { useRouter } from 'next/navigation'
import { createEvent } from '@/lib/actions/event.action'



const formSchema = z.object({
    title: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    description: z.string().min(3, {
        message: "Description must be at least 3 characters.",
    }).max(400),
    location: z.string().min(3, {
        message: "Location must be at least 3 characters.",
    }),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),

})

type EventFormProps = {
    userId: string,
    type: "Create" | "Update"
}

export default function EventForm({ userId, type }: EventFormProps) {

    const router = useRouter()
    const [files, setFiles] = useState<File[]>([])
    const [startDate, setStartDate] = useState(new Date());

    const { startUpload } = useUploadThing('imageUploader')
    const initialValue = eventDefaultValues;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValue
    })

    // 2. Define a submit handler.
    async function FormonSubmit(values: z.infer<typeof formSchema>) {
        const eventDaa = values;

        let uploadedImageUrl = values.imageUrl;

        if (files.length > 0) {
            const uploadImages = await startUpload(files)

            if (!uploadImages) {
                return
            }

            uploadedImageUrl = uploadImages[0].url;
        }

        if (type === 'Create') {
            try {
                const newEvent = await createEvent({
                    event: { ...values, imageUrl: uploadedImageUrl },
                    userId,
                    path: '/profile'
                })

                if (newEvent) {
                    form.reset();
                    router.push(`/events/${newEvent._id}`)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(FormonSubmit)} className="flex flex-col gap-5">

                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Input placeholder="Event title"  {...field} className='input-field' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    {/* <Input placeholder="Event title"  {...field} className='input-field' /> */}
                                    <Dropdown onChangeHandler={field.onChange} value={field.value} />
                                </FormControl>
                                {/* <FormMessage /> */}
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Textarea className='rounded-2xl textarea h-72' {...field} placeholder='Description' />

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <FileUploader onFieldsChange={field.onChange} imageUrl={field.value} setFiles={setFiles} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex flx-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 items-center px-4 py-2'>
                                        <Image src='/assets/icons/location-grey.svg' alt='img' height={24} width={24} />
                                        <Input placeholder='Event Location' className='input-field' {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex flx-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 items-center px-4 py-2'>
                                        <Image src='/assets/icons/calendar.svg' alt='img' height={24} width={24} />
                                        <p className='ml-3 whitespace-nowrap text-grey-600'>Start Date:</p>
                                        <DatePicker selected={field.value} onChange={(date: Date) => field.onChange(date)} showTimeSelect timeInputLabel='Time' dateFormat={'dd/MM/yyyy h:mm aa'} />

                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex flx-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 items-center px-4 py-2'>
                                        <Image src='/assets/icons/calendar.svg' alt='img' height={24} width={24} />
                                        <p className='ml-3 whitespace-nowrap text-grey-600'>End Date:</p>
                                        <DatePicker selected={field.value} onChange={(date: Date) => field.onChange(date)} showTimeSelect timeInputLabel='Time' dateFormat={'dd/MM/yyyy h:mm aa'} />

                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex flx-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 items-center px-4 py-2'>
                                        <Image src='/assets/icons/dollar.svg' alt='img' height={24} width={24} />
                                        <Input type='number' placeholder='Price' {...field} className='p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-offset-0 focus-visible:ring-0' />
                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem className=''>
                                                    <FormControl>
                                                        <div className='flex flx-center h-[54px] w-full overflow-hidden rounded-full  items-center px-4 py-2'>
                                                            <label htmlFor='isFree' className='whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Free Ticket</label>
                                                            <Checkbox onCheckedChange={field.onChange} checked={field.value} id='idFree' className='mr-2' />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex flx-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 items-center px-4 py-2'>
                                        <Image src='/assets/icons/link.svg' alt='img' height={24} width={24} />
                                        <Input placeholder='Event Location' className='input-field' {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={form.formState.isSubmitting} className='button col-span-2 w-full ' type="submit">{form.formState.isSubmitting ? ('Submitting...') : `${type} Event`}</Button>
            </form>
        </Form>
    )
}
