import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface ExperienceFeedbackPayload {
    restaurant_id: string
    rating: number
    description: string
}

export const useSubmitExperienceFeedback = () =>
    useMutation({
        mutationFn: async (payload: ExperienceFeedbackPayload) => {
            const { data } = await axios.post("/api/feedback/experience", payload)
            return data
        },
    })

interface FoodFeedbackPayload {
    restaurant_id: string
    rating: number
    description: string
    menu_item_ids: string[]
}

export const useSubmitFoodFeedback = () =>
    useMutation({
        mutationFn: async (payload: FoodFeedbackPayload) => {
            const { data } = await axios.post("/api/feedback/food", payload)
            return data
        },
    })
