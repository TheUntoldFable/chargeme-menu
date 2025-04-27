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
    cancelTitle?: string
    defaultTitle: string
    icon?: ReactNode
    isOpen?: boolean
    onConfirm: () => void
    onCancel?: () => void
    shouldConfirm?: boolean
}

const DialogPopUp = ({
    title,
    description,
    cancelTitle,
    defaultTitle,
    isOpen,
    icon,
    onConfirm,
    onCancel,
    shouldConfirm = false,
}: DialogProps) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className='max-w-[90%] rounded-lg border-0 bg-lightBg'>
                <AlertDialogHeader className='items-center'>
                    {icon && <div>{icon}</div>}
                    <AlertDialogTitle className='text-white'>{title}</AlertDialogTitle>
                    <AlertDialogDescription className='text-lightGray'>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex-row items-center gap-2'>
                    <Button
                        onClick={onConfirm}
                        className='w-full rounded-2xl bg-yellowNew'
                        variant='default'
                    >
                        {defaultTitle}
                    </Button>
                    {shouldConfirm && (
                        <Button
                            onClick={onCancel}
                            className='w-full rounded-2xl bg-lighterGray'
                            variant='default'
                        >
                            {cancelTitle}
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DialogPopUp
