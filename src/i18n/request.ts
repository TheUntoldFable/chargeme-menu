import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
    // This will be called on every request
    const locale = "bg" // Default locale

    return {
        locale,
        timeZone: "Europe/Sofia",
        messages: (await import(`../../messages/${locale}.json`)).default,
    }
})
