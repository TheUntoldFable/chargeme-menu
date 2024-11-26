"use client"

import { Button } from "@/components/ui/button"
import { formatAmount } from "@/lib/utils"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripePaymentElementOptions } from "@stripe/stripe-js"
import { FormEvent, useEffect, useState } from "react"

interface CheckoutFormProps {
    clientSecret: string
}

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [paymentAmount, setPaymentAmount] = useState<number>(0)

    const [message, setMessage] = useState<string | null | undefined>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!stripe) {
            return
        }

        if (!clientSecret) {
            return
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (paymentIntent?.amount) {
                setPaymentAmount(paymentIntent?.amount)
            }

            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!")
                    break
                case "processing":
                    setMessage("Your create-payment-intent is processing.")
                    break
                case "requires_payment_method":
                    setMessage("Your create-payment-intent was not successful, please try again.")
                    break
                default:
                    setMessage("Something went wrong.")
                    break
            }
        })
    }, [stripe, clientSecret])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return
        }

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your create-payment-inten completion page
                // eslint-disable-next-line camelcase
                return_url: window.location.origin + "/",
            },
        })

        // This point will only be reached if there is an immediate error when
        // confirming the create-payment-inten. Otherwise, your customer will be redirected to
        // your `return_url`. For some create-payment-inten methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the create-payment-inten, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error?.message)
        } else {
            setMessage("An unexpected error occurred.")
        }

        setIsLoading(false)
    }

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: "tabs",
    }

    return (
        <form
            className='p-4'
            id='payment-form'
            onSubmit={handleSubmit}
        >
            <PaymentElement
                id='payment-element'
                options={paymentElementOptions}
            />

            <Button
                variant='select'
                disabled={isLoading || !stripe || !elements}
                id='submit'
            >
                <span id='button-text'>
                    {isLoading ? (
                        <div
                            className='spinner'
                            id='spinner'
                        ></div>
                    ) : (
                        `Плати ${formatAmount(paymentAmount)}`
                    )}
                </span>
            </Button>
            {/* Show any error or success messages */}
            {/*{message && <div id='payment-message'>{message}</div>}*/}
        </form>
    )
}
