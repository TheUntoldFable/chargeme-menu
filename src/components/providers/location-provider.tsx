"use client"

import { useLocationCheck } from "@/hooks/use-location-check"
import { useLocationNavigation } from "@/hooks/use-location-navigation"
import { useLocationNotifications } from "@/hooks/use-location-notifications"
import type { LocationCheckResult } from "@/lib/location-utils"
import type { LocationContextType, LocationProviderProps } from "@/types/location"
import { createContext, useCallback, useContext, useEffect, useMemo } from "react"

// Create context with undefined default
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
    enableAutoCheck = true,
    enableNavigation = true,
}: LocationProviderProps) {
    // Hooks for different concerns
    const navigation = useLocationNavigation({ enabled: enableNavigation })
    // Enable notifications including distance notifications for testing
    const notifications = useLocationNotifications({
        enabled: showNotifications,
        showDistanceNotifications: true, // Show distance notifications to see toast messages
    })

    // Handle location success
    const handleLocationSuccess = useCallback(
        (result: LocationCheckResult) => {
            navigation.handleLocationResult(result)
            notifications.notifySuccess(result)
        },
        [navigation, notifications]
    )

    // Handle location error
    const handleLocationError = useCallback(
        (error: string) => {
            navigation.handleLocationError()
            notifications.notifyError(error)
        },
        [navigation, notifications]
    )

    // Initialize location checking with callbacks
    const locationCheck = useLocationCheck({
        autoCheck: enableAutoCheck && !navigation.isOnErrorPage,
        onSuccess: handleLocationSuccess,
        onError: handleLocationError,
    })

    // Check location when pathname changes (except on error page)
    useEffect(() => {
        if (navigation.shouldCheckLocation()) {
            locationCheck.checkLocation()
        }
    }, [navigation.currentPath]) // Only re-run when path changes

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo<LocationContextType>(
        () => ({
            ...locationCheck,
        }),
        [locationCheck]
    )

    return <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>
}
