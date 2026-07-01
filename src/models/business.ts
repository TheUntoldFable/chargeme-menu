export type BusinessType = "RESTAURANT" | "SERVICES" | "OTHER"

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
    selfService: boolean
    restaurantGoogleUrl: string
    latitude: number
    longitude: number
    tableNumbers: Array<{
        id: string
        name: string
    }>
}
