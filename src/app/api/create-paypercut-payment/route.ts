import { NextRequest, NextResponse } from "next/server"

/**
 * Paypercut Checkout API Integration
 * Following official documentation: https://docs.paypercut.io/docs/accept-payments/custom-checkout
 * 
 * Required Environment Variables:
 * - PAYPERCUT_API_SECRET: Your private/secret API key for server-side operations
 * - PAYPERCUT_API_KEY: Your public API key ID (01K9FEG4F3V3GTDWQP4STD7A94)
 * 
 * Get these from your Paypercut merchant dashboard under API Keys section.
 */

// Correct Paypercut API endpoint from official documentation
const PAYPERCUT_API_ENDPOINT = "https://api.paypercut.io/v1/checkouts"

const PAYPERCUT_API_BASE = "https://api.paypercut.io"
const API_SECRET = process.env.PAYPERCUT_API_SECRET  // Server-side secret key
const API_KEY = process.env.PAYPERCUT_API_KEY        // Client-side public key (for reference)

const calculateOrderAmount = (items: []): number => {
    const sum = items.reduce((acc, curr: { id: string; amount: number }) => {
        return acc + curr?.amount
    }, 0)
    return sum
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text()
        console.log("Raw request body:", rawBody)
        
        const parsedBody = JSON.parse(rawBody)
        console.log("Parsed request:", parsedBody)

        const { totalAmount, currency, returnUrl } = parsedBody

        // Validate required fields
        if (!totalAmount || !currency) {
            return NextResponse.json(
                { error: "Missing required fields: totalAmount and currency" },
                { status: 400 }
            )
        }

        // Check API credentials
        if (!API_SECRET) {
            console.error("Missing PAYPERCUT_API_SECRET environment variable")
            return NextResponse.json(
                { error: "Paypercut API credentials not configured" },
                { status: 500 }
            )
        }

        console.log("Environment check:", {
            hasApiKey: !!API_KEY,
            hasApiSecret: !!API_SECRET,
            apiSecretMasked: API_SECRET ? `${API_SECRET.substring(0, 8)}...` : 'not set',
            nodeEnv: process.env.NODE_ENV
        })

        // Convert amount to cents (Paypercut expects integer cents)
        const amountInCents = Math.round(parseFloat(totalAmount) * 100)
        
        // Create checkout session following Paypercut documentation exactly
        const checkoutData = {
            amount: amountInCents,
            currency: currency.toUpperCase(),
            success_url: returnUrl || `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/order`,
            cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/cart`,
            line_items: [
                {
                    name: "Restaurant Order",
                    amount: amountInCents,
                    quantity: 1
                }
            ]
        }

        console.log("Checkout data to send:", JSON.stringify(checkoutData, null, 2))

        // Make API call to Paypercut
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${API_SECRET}`
        }

        console.log("Making request to:", PAYPERCUT_API_ENDPOINT)
        
        const response = await fetch(PAYPERCUT_API_ENDPOINT, {
            method: "POST",
            headers,
            body: JSON.stringify(checkoutData)
        })

        console.log("Paypercut API response:", {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        })

        const responseText = await response.text()
        console.log("Raw API response:", responseText)

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`
            
            try {
                const errorData = JSON.parse(responseText)
                errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage
                console.error("Structured error response:", errorData)
            } catch (e) {
                console.error("Failed to parse error response as JSON")
                errorMessage = responseText || errorMessage
            }
            
            return NextResponse.json(
                { error: `Paypercut API Error: ${errorMessage}`, status: response.status },
                { status: response.status }
            )
        }

        // Parse successful response
        let checkoutSession
        try {
            checkoutSession = JSON.parse(responseText)
        } catch (e) {
            console.error("Failed to parse success response as JSON:", responseText)
            return NextResponse.json(
                { error: "Invalid response from Paypercut API" },
                { status: 500 }
            )
        }

        console.log("Checkout session created:", checkoutSession)

        // Extract checkout URL (try different possible field names)
        const checkoutUrl = checkoutSession.url || 
                           checkoutSession.checkout_url || 
                           checkoutSession.payment_url ||
                           checkoutSession.redirect_url

        if (!checkoutUrl) {
            console.error("No checkout URL found in response:", checkoutSession)
            return NextResponse.json(
                { error: "No checkout URL received from Paypercut" },
                { status: 500 }
            )
        }

        // Return successful response
        return NextResponse.json({ 
            sessionId: checkoutSession.id,
            checkoutUrl: checkoutUrl,
            amount: checkoutSession.amount || amountInCents,
            currency: checkoutSession.currency || currency.toUpperCase()
        })

    } catch (error: any) {
        console.error("Unexpected error in Paypercut API:", error)
        return NextResponse.json(
            { error: "Internal server error", details: error.message, stack: error.stack },
            { status: 500 }
        )
    }
}
