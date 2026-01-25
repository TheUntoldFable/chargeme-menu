"use client"

import Wrapper from "@/components/common/wrapper"
import PaypercutCheckoutForm from "@/components/Payment/PaypercutCheckoutForm"
import { stringToStripeAmount } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

interface PaypercutSession {
    sessionId: string
    checkoutUrl: string
    amount: number
    currency: string
}

function PaypercutPage() {
    const [paymentSession, setPaymentSession] = useState<PaypercutSession | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const searchParam = useSearchParams()
    const totalAmount = searchParam.get("totalAmount") ?? ""
    const t = useTranslations("payment.paypercut")
    const tCommon = useTranslations("common")

    useEffect(() => {
        // Create Paypercut payment session as soon as the page loads
        if (!totalAmount) {
            setError("Missing payment amount")
            setIsLoading(false)
            return
        }

        const createPaymentSession = async () => {
            console.log("Creating Paypercut session with amount:", totalAmount)
            
            try {
                const requestData = {
                    totalAmount: totalAmount, // Send as string (e.g., "25.50")
                    currency: "eur",
                    returnUrl: window.location.origin + "/order"
                }
                
                console.log("Request data:", requestData)
                
                const response = await fetch("https://api.paypercut.io/v1/checkouts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData),
                })

                console.log("API response status:", response.status)

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error("API error response:", errorText)
                    
                    let errorMessage = "Failed to create payment session"
                    try {
                        const errorData = JSON.parse(errorText)
                        errorMessage = errorData.error || errorData.details || errorMessage
                    } catch (e) {
                        errorMessage = errorText || errorMessage
                    }
                    
                    throw new Error(errorMessage)
                }

                const data = await response.json()
                console.log("Payment session data:", data)
                
                if (!data.checkoutUrl) {
                    throw new Error("No checkout URL received from API")
                }
                
                setPaymentSession({
                    sessionId: data.sessionId,
                    checkoutUrl: data.checkoutUrl,
                    amount: data.amount,
                    currency: data.currency
                })
            } catch (err: any) {
                console.error("Payment session creation error:", err)
                setError(err.message || "Failed to initialize payment")
            } finally {
                setIsLoading(false)
            }
        }

        createPaymentSession()
    }, [totalAmount])

    if (isLoading) {
        return (
            <Wrapper className='w-full bg-none pt-12'>
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lightGray">{tCommon("loading") || "Loading..."}</p>
                </div>
            </Wrapper>
        )
    }

    if (error) {
        return (
            <Wrapper className='w-full bg-none pt-12'>
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong className="font-bold">{t("error") || "Error"}:</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                    <button 
                        onClick={() => window.history.back()} 
                        className="text-blue-500 underline"
                    >
                        {tCommon("goBack") || "Go Back"}
                    </button>
                </div>
            </Wrapper>
        )
    }

    return (
        <Wrapper className='w-full bg-none pt-12'>
            {paymentSession && (
                <PaypercutCheckoutForm
                    sessionId={paymentSession.sessionId}
                    checkoutUrl={paymentSession.checkoutUrl}
                    amount={paymentSession.amount}
                    currency={paymentSession.currency}
                />
            )}
        </Wrapper>
    )
}

export default function Page() {
    const t = useTranslations("common")

    return (
        <Suspense fallback={<div>{t("loading")}</div>}>
            <PaypercutPage />
        </Suspense>
    )
}
