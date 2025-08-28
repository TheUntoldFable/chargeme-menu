import type { LocationCheckResult } from "@/lib/location-utils"

/**
 * Location context type with all available methods and state
 */
export interface LocationContextType {
    checkLocation: () => Promise<void>
    isChecking: boolean
    result: LocationCheckResult | null
    permissionStatus: PermissionState | null
    restaurantLocation: LocationCoordinates
    radiusInMeters: number
}

/**
 * Location coordinates type
 */
export interface LocationCoordinates {
    latitude: number
    longitude: number
}

/**
 * Location provider props
 */
export interface LocationProviderProps {
    children: React.ReactNode
    showNotifications?: boolean
    enableAutoCheck?: boolean
    enableNavigation?: boolean
}

/**
 * Location check callbacks
 */
export interface LocationCheckCallbacks {
    onSuccess?: (result: LocationCheckResult) => void
    onError?: (error: string) => void
}

/**
 * Location provider state
 */
export interface LocationProviderState {
    isInitialized: boolean
    lastCheckTime: number | null
}
