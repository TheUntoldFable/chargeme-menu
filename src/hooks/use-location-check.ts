"use client"

import { getRestaurantRadius } from "@/config/restaurant"
import { calculateDistance, isWithinRadius, type LocationCheckResult } from "@/lib/location-utils"
import { LocationService } from "@/services/location.service"
import type { LocationCoordinates } from "@/types/location"
import { useCallback, useEffect, useState } from "react"

interface UseLocationCheckOptions {
    autoCheck?: boolean // Whether to check location automatically on mount
    onSuccess?: (result: LocationCheckResult) => void
    onError?: (error: string) => void
    restaurantLocation?: LocationCoordinates
    radius?: number
}

interface UseLocationCheckReturn {
    checkLocation: () => Promise<void>
    isChecking: boolean
    result: LocationCheckResult | null
    permissionStatus: PermissionState | null
    restaurantLocation: LocationCoordinates | null
    radiusInMeters: number
}

export function useLocationCheck(options: UseLocationCheckOptions = {}): UseLocationCheckReturn {
    const { autoCheck = true, onSuccess, onError, restaurantLocation, radius } = options

    // Check if location checking is enabled via environment variable
    const isLocationCheckEnabled = process.env.NEXT_PUBLIC_ENABLE_LOCATION_CHECKER === "true"

    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<LocationCheckResult | null>(null)
    const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null)

    const checkLocation = useCallback(async () => {
        // Return early if location checking is disabled
        if (!isLocationCheckEnabled) {
            return
        }

        setIsChecking(true)

        try {
            // Check permission status
            const permission = await LocationService.checkPermission()
            setPermissionStatus(permission)

            // Get current location
            const userLocation = await LocationService.getCurrentLocation()

            if (!restaurantLocation) {
                throw new Error("Restaurant coordinates not loaded")
            }

            const radiusInMeters = radius ?? getRestaurantRadius()

            // Check if within radius
            const withinRadius = isWithinRadius(
                userLocation.latitude,
                userLocation.longitude,
                restaurantLocation.latitude,
                restaurantLocation.longitude,
                radiusInMeters
            )

            // Calculate distance
            const distance = Math.round(
                calculateDistance(userLocation.latitude, userLocation.longitude, restaurantLocation.latitude, restaurantLocation.longitude)
            )

            const checkResult: LocationCheckResult = {
                isWithinRadius: withinRadius,
                distance,
                userLocation,
                error: null,
            }

            setResult(checkResult)
            onSuccess?.(checkResult)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
            const checkResult: LocationCheckResult = {
                isWithinRadius: false,
                distance: 0,
                userLocation: null,
                error: errorMessage,
            }

            setResult(checkResult)
            onError?.(errorMessage)
        } finally {
            setIsChecking(false)
        }
    }, [onSuccess, onError, restaurantLocation, radius])

    // Auto-check on mount if enabled
    useEffect(() => {
        if (autoCheck && isLocationCheckEnabled) {
            checkLocation()
        }
    }, [autoCheck, isLocationCheckEnabled, checkLocation])

    return {
        checkLocation,
        isChecking,
        result,
        permissionStatus,
        restaurantLocation: restaurantLocation ?? null,
        radiusInMeters: radius ?? getRestaurantRadius(),
    }
}
