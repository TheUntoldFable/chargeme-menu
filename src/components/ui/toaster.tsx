"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(function ({ id, description, action, variant, ...props }) {
                return (
                    <Toast
                        key={id}
                        variant={variant}
                        {...props}
                    >
                        <Image
                            src={variant === "destructive" ? "/svg/icons/x.svg" : "/svg/icons/check.svg"}
                            alt=''
                            width={24}
                            height={24}
                            className='shrink-0'
                        />
                        {description && <ToastDescription className='flex-1 text-sm font-medium opacity-100'>{description}</ToastDescription>}
                        {action}
                        <ToastClose />
                    </Toast>
                )
            })}
            <ToastViewport />
        </ToastProvider>
    )
}
