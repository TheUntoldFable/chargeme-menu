import { LOCATION_MESSAGES, LOCATION_PERMISSIONS } from "@/constants/location"
import type { Location } from "@/lib/location-utils"

/**
 * Options for getting current position
 */
const GEOLOCATION_OPTIONS: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
}

/**
 * Location service for handling geolocation API interactions
 */
export class LocationService {
    /**
     * Check if geolocation is supported
     */
    static isSupported(): boolean {
        return "geolocation" in navigator
    }

    /**
     * Check permission status
     */
    static async checkPermission(): Promise<PermissionState | null> {
        if (!("permissions" in navigator)) {
            return null
        }

        try {
            const permission = await navigator.permissions.query({
                name: LOCATION_PERMISSIONS.QUERY_NAME,
            })
            return permission.state
        } catch (error) {
            console.warn("Permissions API not available:", error)
            return null
        }
    }

    /**
     * Get current location
     */
    static getCurrentLocation(): Promise<Location> {
        return new Promise((resolve, reject) => {
            if (!this.isSupported()) {
                reject(new Error(LOCATION_MESSAGES.ERRORS.NOT_SUPPORTED))
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })
                },
                (error) => {
                    reject(this.mapGeolocationError(error))
                },
                GEOLOCATION_OPTIONS
            )
        })
    }

    /**
     * Map geolocation error to user-friendly message
     */
    private static mapGeolocationError(error: GeolocationPositionError): Error {
        let message = LOCATION_MESSAGES.ERRORS.GENERIC

        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = LOCATION_MESSAGES.ERRORS.PERMISSION_DENIED
                break
            case error.POSITION_UNAVAILABLE:
                message = LOCATION_MESSAGES.ERRORS.UNAVAILABLE
                break
            case error.TIMEOUT:
                message = LOCATION_MESSAGES.ERRORS.TIMEOUT
                break
        }

        return new Error(message)
    }

    /**
     * Watch position changes
     */
    static watchPosition(onSuccess: (location: Location) => void, onError: (error: Error) => void): number | null {
        if (!this.isSupported()) {
            onError(new Error(LOCATION_MESSAGES.ERRORS.NOT_SUPPORTED))
            return null
        }

        return navigator.geolocation.watchPosition(
            (position) => {
                onSuccess({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (error) => {
                onError(this.mapGeolocationError(error))
            },
            GEOLOCATION_OPTIONS
        )
    }

    /**
     * Clear position watch
     */
    static clearWatch(watchId: number): void {
        if (this.isSupported() && watchId !== null) {
            navigator.geolocation.clearWatch(watchId)
        }
    }
}
