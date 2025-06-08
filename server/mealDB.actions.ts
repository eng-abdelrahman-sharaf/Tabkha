import { safeFetch } from "@/lib/errors";
import {
    MealsResponseSchema,
    MealsResponseType,
    MealType,
} from "@/types/meal.types";

export const searchMealByName = async (mealName: string) => {
    const response = await safeFetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );

    if (!response.ok) {
        throw new Error(`Failed to search for meal (${mealName})`);
    }

    const data = await response.json();

    if (data?.meals === "no data found") {
        return { meals: [] } as MealsResponseType;
    }
    try {
        MealsResponseSchema.parse(data);
    } catch (error) {
        throw new Error(`Failed to fetch meal data: ${error}`);
    }

    return data as MealsResponseType;
};
