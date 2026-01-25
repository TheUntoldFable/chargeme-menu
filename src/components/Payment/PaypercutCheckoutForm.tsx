"use client"

import { Button } from "@/components/ui/button"
import { formatAmount } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { FormEvent, useEffect, useState } from "react"

interface PaypercutCheckoutFormProps {
    sessionId: string
    checkoutUrl: string
    amount: number
    currency: string
}

export default function PaypercutCheckoutForm({ 
    sessionId, 
    checkoutUrl, 
    amount, 
    currency
}: PaypercutCheckoutFormProps) {
    const t = useTranslations("payment.paypercut")
    const tCommon = useTranslations("common")
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
        // Set ready state once component mounts
        setIsReady(true)
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        
        console.log("Payment form submitted with:", { checkoutUrl, sessionId, amount, currency })
        
        if (!checkoutUrl) {
            console.error("Missing checkout URL")
            setError("No checkout URL available")
            return
        }

        if (!sessionId) {
            console.error("Missing session ID")
            setError("No session ID available")
            return
        }

        setIsLoading(true)

        try {
            console.log("Redirecting to Paypercut checkout:", checkoutUrl)
            // Small delay to show loading state
            setTimeout(() => {
                window.location.href = checkoutUrl
            }, 500)
        } catch (error) {
            console.error("Error redirecting to Paypercut:", error)
            setError("Failed to redirect to payment page")
            setIsLoading(false)
        }
    }

    const [error, setError] = useState<string | null>(null)

    const displayAmount = amount ? amount / 100 : 0 // Convert from cents

    return (
        <div className="p-4">
            <div className="mb-6 space-y-4">
                <div className="bg-lightBg rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-2">{t("title") || "Paypercut Payment"}</h3>
                    <p className="text-lightGray text-sm mb-4">
                        {t("description") || "Complete your payment securely with Paypercut"}
                    </p>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-lightGray">{tCommon("total")}:</span>
                        <span className="font-bold text-lg">
                            {formatAmount(amount)} {currency?.toUpperCase()}
                        </span>
                    </div>
                </div>

                {sessionId && (
                    <div className="bg-lightBg rounded-xl p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-lightGray text-sm">{t("sessionId") || "Session"}:</span>
                            <span className="text-sm font-mono">
                                {sessionId.substring(0, 8)}...
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <Button
                    variant='select'
                    disabled={isLoading || !isReady || !checkoutUrl}
                    className="w-full"
                    type="submit"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>{t("redirecting") || "Redirecting..."}</span>
                        </div>
                    ) : (
                        <span>
                            {t("payButton") || `${tCommon("pay")} ${formatAmount(amount)}`}
                        </span>
                    )}
                </Button>
            </form>

            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="mt-4 text-center">
                <p className="text-xs text-lightGray">
                    {t("securePayment") || "Secure payment powered by Paypercut"}
                </p>
            </div>
        </div>
    )
}
