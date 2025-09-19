export interface GetRestaurantResponse {
    id: string
    vendor: string
    iban: string
    vendorHost: string
    vendorUsername: string
    vendorPassword: string
    tipEnabled: boolean
    paymentInAdvance: boolean
    latitude: number
    longitude: number
    tableNumbers: Array<{
        id: string
        name: string
    }>
}
