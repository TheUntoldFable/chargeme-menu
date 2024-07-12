"use client"

import { Button } from "@/components/ui/button"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripePaymentElementOptions } from "@stripe/stripe-js"
import React, { FormEvent } from "react"

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = React.useState<string | null | undefined>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret")

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          break
        case "processing":
          setMessage("Your create-payment-inten is processing.")
          break
        case "requires_payment_method":
          setMessage("Your create-payment-inten was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe])

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
        return_url: "http://localhost:1337/",
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
      id='payment-form'
      onSubmit={handleSubmit}
    >
      <PaymentElement
        id='payment-element'
        options={paymentElementOptions}
      />
      <Button
        className='bg-yellow text-white hover:opacity-80 hover:scale-110 transition-all ease-in-out w-full mt-6'
        variant='default'
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
            "Pay now"
          )}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id='payment-message'>{message}</div>}
    </form>
  )
}
