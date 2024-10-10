// eslint-disable-next-line @typescript-eslint/no-var-requires
import { NextRequest, NextResponse } from "next/server" // eslint-disable-next-line @typescript-eslint/no-var-requires

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const calculateOrderAmount = (items: []): number => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    const sum = items.reduce((acc, curr: { id: string; amount: number }) => {
        return acc + curr?.amount
    }, 0)
    return sum
}

export async function POST(req: NextRequest) {
    const rawBody = await req.text()
    const parsedBody = JSON.parse(rawBody)

    const { items, currency } = parsedBody

    if (!items || !currency) throw new Error(`Missing body property!`)

    // Create a PaymentIntent with the order amount and currency
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency,
            // eslint-disable-next-line camelcase
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            // eslint-disable-next-line camelcase
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (e) {
        throw new Error("Error creating payment intent!")
    }
}
