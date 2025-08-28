"use client"

import { useToast } from "@/components/ui/use-toast"
import { LOCATION_MESSAGES } from "@/constants/location"
import type { LocationCheckResult } from "@/lib/location-utils"
import { useCallback, useRef } from "react"

interface UseLocationNotificationsOptions {
    enabled?: boolean
    showDistanceNotifications?: boolean // Option to show distance notifications
}

/**
 * Custom hook for handling location-related notifications
 */
export function useLocationNotifications(options: UseLocationNotificationsOptions = {}) {
    const { enabled = true, showDistanceNotifications = false } = options
    const { toast } = useToast()

    // Track last notification to prevent spam
    const lastNotificationRef = useRef<{
        type: "success" | "error" | "distance"
        message: string
        timestamp: number
    } | null>(null)

    /**
     * Check if we should show notification (prevent spam)
     */
    const shouldShowNotification = useCallback((type: "success" | "error" | "distance", message: string) => {
        const now = Date.now()
        const lastNotification = lastNotificationRef.current

        // Don't show same notification within 5 seconds
        if (
            lastNotification &&
            lastNotification.type === type &&
            lastNotification.message === message &&
            now - lastNotification.timestamp < 5000
        ) {
            return false
        }

        return true
    }, [])

    /**
     * Update last notification tracker
     */
    const updateLastNotification = useCallback((type: "success" | "error" | "distance", message: string) => {
        lastNotificationRef.current = {
            type,
            message,
            timestamp: Date.now(),
        }
    }, [])

    /**
     * Show success notification
     */
    const notifySuccess = useCallback(
        (result: LocationCheckResult) => {
            if (!enabled) return

            // Removed success notification for being within radius
            // Only show distance notifications if explicitly enabled
            if (!result.isWithinRadius && showDistanceNotifications) {
                const message = `Намирате се на ${result.distance}м от ресторанта.`
                if (shouldShowNotification("distance", message)) {
                    toast({
                        title: "Проверка на локацията",
                        description: message,
                        variant: "default",
                    })
                    updateLastNotification("distance", message)
                }
            }
        },
        [enabled, showDistanceNotifications, toast, shouldShowNotification, updateLastNotification]
    )

    /**
     * Show error notification
     */
    const notifyError = useCallback(
        (error: string) => {
            if (!enabled) return

            if (shouldShowNotification("error", error)) {
                toast({
                    title: LOCATION_MESSAGES.ERRORS.TITLE,
                    description: error,
                    variant: "destructive",
                })
                updateLastNotification("error", error)
            }
        },
        [enabled, toast, shouldShowNotification, updateLastNotification]
    )

    return {
        notifySuccess,
        notifyError,
    }
}
