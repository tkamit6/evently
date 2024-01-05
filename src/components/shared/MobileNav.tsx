import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import NavItems from "./NavItems"


export default function MobileNav() {
    return (
        <nav className="md:hidden flex">
            <Sheet>
                <SheetTrigger className="align-middle">
                    <Image src={'/assets/icons/menu.svg'} alt="img" width={24} height={24} className="cursor-pinter" />
                </SheetTrigger>
                <SheetContent className="flex flex-col bg-white md:hidden">
                    <Image src={'/assets/images/logo.svg'} alt="img" width={128} height={38} />
                    <Separator />
                    <NavItems />
                </SheetContent>
            </Sheet>

        </nav>
    )
}
