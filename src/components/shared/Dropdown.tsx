import React, { startTransition, useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ICategory } from '@/lib/database/models/category.model'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'
import { createCategory, getAllCategory } from '@/lib/actions/category.actions'


type DropdownProps = {
    onChangeHandler?: () => void,
    value: string
}

export default function Dropdown({ onChangeHandler, value }: DropdownProps) {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [newCategories, setNewCategories] = useState('')

    const handleAddCategory = () => {
        createCategory({
            categoryName: newCategories.trim()
        })
            .then((category) => {
                setCategories((prevState) => [...prevState, category]);
            })
    }

    useEffect(() => {
        const getCategories = async () => {
            const categoriesList = await getAllCategory();

            categoriesList && setCategories(categoriesList as ICategory[])
            console.log(categoriesList, "p")
        }
        getCategories()
    }, [])


    return (
        <Select onValueChange={onChangeHandler} defaultValue={value}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                {
                    categories.length > 0 && categories.map((categories) => (
                        <SelectItem className='select-item p-regular-14' key={categories._id} value={categories._id}>{categories.name}</SelectItem>
                    ))
                }
                <AlertDialog>
                    <AlertDialogTrigger className='p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500  hover:bg-primary-50 focus:text-primary-500'>New Category</AlertDialogTrigger>
                    <AlertDialogContent className='bg-white'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Input type='text' placeholder='Category Name' className='input-field mt-3' onChange={(e) => setNewCategories(e.target.value)} />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => startTransition(handleAddCategory)}>Add</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </SelectContent>
        </Select>

    )
}
