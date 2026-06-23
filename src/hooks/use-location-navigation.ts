"use client"

import { LOCATION_ROUTES } from "@/constants/location"
import type { LocationCheckResult } from "@/lib/location-utils"
import { useBusinessParams, withBusinessParams } from "@/lib/navigation-utils"
import { usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"

interface UseLocationNavigationOptions {
    enabled?: boolean
}

/**
 * Custom hook that handles navigation based on location check results
 */
export function useLocationNavigation(options: UseLocationNavigationOptions = {}) {
    const { enabled = true } = options
    const router = useRouter()
    const pathname = usePathname()
    const { businessId, table } = useBusinessParams()

    const isOnErrorPage = pathname === LOCATION_ROUTES.ERROR

    /**
     * Navigate to error page when location check fails
     */
    const navigateToErrorPage = useCallback(() => {
        if (!isOnErrorPage && enabled) {
            router.push(withBusinessParams(LOCATION_ROUTES.ERROR, businessId, table))
        }
    }, [isOnErrorPage, enabled, router])

    /**
     * Navigate to home page when location check succeeds
     */
    const navigateToHomePage = useCallback(() => {
        if (isOnErrorPage && enabled) {
            router.push(withBusinessParams(LOCATION_ROUTES.HOME, businessId, table))
        }
    }, [isOnErrorPage, enabled, router])

    /**
     * Handle navigation based on location check result
     */
    const handleLocationResult = useCallback(
        (result: LocationCheckResult) => {
            if (!enabled) return

            if (result.isWithinRadius) {
                navigateToHomePage()
            } else {
                navigateToErrorPage()
            }
        },
        [enabled, navigateToHomePage, navigateToErrorPage]
    )

    /**
     * Handle location error by navigating to error page
     */
    const handleLocationError = useCallback(() => {
        navigateToErrorPage()
    }, [navigateToErrorPage])

    /**
     * Check if location check should be performed
     */
    const shouldCheckLocation = useCallback(() => {
        return !isOnErrorPage && enabled
    }, [isOnErrorPage, enabled])

    return {
        isOnErrorPage,
        shouldCheckLocation,
        handleLocationResult,
        handleLocationError,
        navigateToErrorPage,
        navigateToHomePage,
        currentPath: pathname,
    }
}
