import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const body = await req.json()

    const { restaurant_id, rating, description, menu_item_ids } = body

    if (!restaurant_id || rating == null || !menu_item_ids?.length) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const res = await fetch("https://analytics.chargem3.com/api/feedback/food", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.FEEDBACK_API_KEY ?? "",
        },
        body: JSON.stringify({ restaurant_id, rating, description, menu_item_ids }),
    })

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to submit feedback" }, { status: res.status })
    }

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data)
}
