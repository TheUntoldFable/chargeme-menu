/**
 * Location-related constants
 */

export const LOCATION_ROUTES = {
    ERROR: "/location-error",
    HOME: "/",
} as const

export const LOCATION_CHECK_INTERVAL = 5000 // 5 seconds

export const LOCATION_MESSAGES = {
    ERRORS: {
        TITLE: "Грешка при локализация",
        PERMISSION_DENIED: "Достъпът до локацията е отказан",
        UNAVAILABLE: "Информацията за локацията не е налична",
        TIMEOUT: "Заявката за локация изтече",
        NOT_SUPPORTED: "Геолокацията не се поддържа от вашия браузър",
        GENERIC: "Не може да се получи вашата локация",
    },
    SUCCESS: {
        WELCOME: "Добре дошли!",
        AT_RESTAURANT: "Намирате се в ресторанта.",
    },
}

export const LOCATION_PERMISSIONS = {
    QUERY_NAME: "geolocation" as PermissionName,
} as const
