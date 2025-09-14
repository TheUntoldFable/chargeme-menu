"use client"

import { useRestaurantDetails } from "@/hooks/get-restaurant"
import { useLocationCheck } from "@/hooks/use-location-check"
import { useLocationNavigation } from "@/hooks/use-location-navigation"
import { useLocationNotifications } from "@/hooks/use-location-notifications"
import type { LocationCheckResult } from "@/lib/location-utils"
import type { LocationContextType, LocationProviderProps } from "@/types/location"
import { createContext, useCallback, useContext, useEffect, useMemo } from "react"

const LocationContext = createContext<LocationContextType | undefined>(undefined)

/**
 * Custom hook to access location context
 * @throws {Error} If used outside of LocationProvider
 */
export function useLocation(): LocationContextType {
    const context = useContext(LocationContext)
    if (!context) {
        throw new Error("useLocation must be used within a LocationProvider")
    }
    return context
}

/**
 * LocationProvider component that manages location checking and related functionality
 */
export function LocationProvider({
    children,
    showNotifications = true,
    enableAutoCheck = false,
    enableNavigation = false,
}: LocationProviderProps) {
    const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID
    const { data: restaurantDetails } = useRestaurantDetails(restaurantId)
    const restaurantLocation = restaurantDetails
        ? { latitude: restaurantDetails.latitude, longitude: restaurantDetails.longitude }
        : undefined

    const navigation = useLocationNavigation({ enabled: enableNavigation })
    const notifications = useLocationNotifications({
        enabled: showNotifications,
        showDistanceNotifications: true,
    })

    const handleLocationSuccess = useCallback(
        (result: LocationCheckResult) => {
            navigation.handleLocationResult(result)
            notifications.notifySuccess(result)
        },
        [navigation, notifications]
    )

    const handleLocationError = useCallback(
        (error: string) => {
            navigation.handleLocationError()
            notifications.notifyError(error)
        },
        [navigation, notifications]
    )

    const locationCheck = useLocationCheck({
        autoCheck: enableAutoCheck && !navigation.isOnErrorPage && Boolean(restaurantLocation),
        onSuccess: handleLocationSuccess,
        onError: handleLocationError,
        restaurantLocation,
    })

    useEffect(() => {
        if (restaurantLocation && navigation.shouldCheckLocation()) {
            locationCheck.checkLocation()
        }
    }, [navigation.currentPath, restaurantLocation])

    // Re-check when coordinates load from API
    useEffect(() => {
        if (restaurantLocation && enableAutoCheck && !navigation.isOnErrorPage) {
            locationCheck.checkLocation()
        }
    }, [restaurantLocation, enableAutoCheck, navigation.isOnErrorPage])

    const contextValue = useMemo<LocationContextType>(
        () => ({
            ...locationCheck,
        }),
        [locationCheck]
    )

    return <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>
}
