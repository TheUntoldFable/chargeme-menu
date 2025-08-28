"use client"

import { getRestaurantLocation, getRestaurantRadius } from "@/config/restaurant"
import { calculateDistance, isWithinRadius, type LocationCheckResult } from "@/lib/location-utils"
import { LocationService } from "@/services/location.service"
import { useCallback, useEffect, useState } from "react"

interface UseLocationCheckOptions {
    autoCheck?: boolean // Whether to check location automatically on mount
    onSuccess?: (result: LocationCheckResult) => void
    onError?: (error: string) => void
}

export function useLocationCheck(options: UseLocationCheckOptions = {}) {
    const { autoCheck = true, onSuccess, onError } = options

    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<LocationCheckResult | null>(null)
    const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null)

    const checkLocation = useCallback(async () => {
        setIsChecking(true)

        try {
            // Check permission status
            const permission = await LocationService.checkPermission()
            setPermissionStatus(permission)

            // Get current location
            const userLocation = await LocationService.getCurrentLocation()

            const restaurantLocation = getRestaurantLocation()
            const radiusInMeters = getRestaurantRadius()

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
    }, [onSuccess, onError])

    // Auto-check on mount if enabled
    useEffect(() => {
        if (autoCheck) {
            checkLocation()
        }
    }, [autoCheck, checkLocation])

    return {
        checkLocation,
        isChecking,
        result,
        permissionStatus,
        restaurantLocation: getRestaurantLocation(),
        radiusInMeters: getRestaurantRadius(),
    }
}
