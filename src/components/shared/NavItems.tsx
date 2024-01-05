'use client'
import { headerLinks } from '@/app/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NavItems() {
    const pathName = usePathname()


    return (
        <ul className='flex gap-10 md:flex-between w-full flex-col md:flex-row'>
            {
                headerLinks.map((link, id) => {
                    const isActive = pathName === link.route
                    return (
                        <li className={`${isActive && 'text-primary-500'} flex-center p-medium-16 whitespace-nowrap`} key={link.label}><Link href={link.route}>{link.label}</Link></li>

                    )
                })
            }

        </ul>
    )
}
