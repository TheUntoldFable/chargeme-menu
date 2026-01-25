export type PaymentProvider = "none" | "stripe" | "paypercut"

export interface GetRestaurantResponse {
    id: string
    vendor: string
    iban: string
    vendorHost: string
    vendorUsername: string
    vendorPassword: string
    tipEnabled: boolean
    paymentInAdvance: boolean
    paymentProvider?: PaymentProvider // New field for payment provider selection
    latitude: number
    longitude: number
    tableNumbers: Array<{
        id: string
        name: string
    }>
}
