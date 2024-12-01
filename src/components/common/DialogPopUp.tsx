import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface DialogProps {
    title: string
    description: string
    buttonTitle: string
    icon?: ReactNode
    isOpen?: boolean
    onPress: () => void
}

const DialogPopUp = ({ title, description, buttonTitle, isOpen, icon, onPress }: DialogProps) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className='bg-lightBg border-0 max-w-[90%] rounded-lg'>
                <AlertDialogHeader className='items-center'>
                    {icon && <div>{icon}</div>}
                    <AlertDialogTitle className='text-white'>{title}</AlertDialogTitle>
                    <AlertDialogDescription className='text-lightGray'>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='items-center'>
                    <Button
                        onClick={onPress}
                        className='w-full bg-lighterGray rounded-2xl'
                        variant='default'
                    >
                        {buttonTitle}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DialogPopUp
