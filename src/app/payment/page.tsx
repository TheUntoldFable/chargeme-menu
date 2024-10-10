"use client"

import Wrapper from "@/components/common/wrapper"
import CheckoutForm from "@/components/Payment/CheckoutForm"
import { stringToStripeAmount } from "@/lib/utils"
import { Elements } from "@stripe/react-stripe-js"
import { Appearance, loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")

function PaymentPage() {
    const [clientSecret, setClientSecret] = useState("")
    const searchParam = useSearchParams()
    const totalAmount = searchParam.get("totalAmount") ?? ""

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: [
                    {
                        id: "xl-tshirt",
                        amount: stringToStripeAmount(totalAmount),
                    },
                ],
                currency: "bgn",
            }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [totalAmount])

    const appearance: Appearance = {
        theme: "stripe",
    }

    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    }

    return (
        <Wrapper className='bg-none w-full pt-12'>
            {clientSecret && (
                <Elements
                    options={options}
                    stripe={stripePromise}
                >
                    <CheckoutForm clientSecret={clientSecret} />
                </Elements>
            )}
        </Wrapper>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentPage />
        </Suspense>
    )
}
