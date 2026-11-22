export type BusinessType = "RESTAURANT" | "BAR" | "RETAIL" | "SERVICES" | "OTHER"

export type PaymentProvider = "none" | "stripe" | "paypercut"

export interface GetBusinessResponse {
    id: string
    type: BusinessType
    vendor: string
    iban: string
    vendorHost: string
    vendorUsername: string
    vendorPassword: string
    tipEnabled: boolean
    paymentInAdvance: boolean
    paymentProvider?: PaymentProvider // New field for payment provider selection
    selfService: boolean
    restaurantGoogleUrl: string
    latitude: number
    longitude: number
    tableNumbers: Array<{
        id: string
        name: string
    }>
}
