"use server";
import { MealsResponseType, MealType } from "@/types/meal.types";
import { errorToString } from "@/lib/errors";
import { UserContextType } from "@/types/bot.types";
import { GoogleGenAI } from "@google/genai";
import { searchMealByName } from "./mealDB.actions";

export async function sendMessages(conversationHistory: UserContextType) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
        responseMimeType: "text/plain",
    };

    const model = process.env.MODEL_NAME;

    const lastMessages = conversationHistory
        .filter((item) => typeof item.parts[0].text === "string")
        .splice(-1);
    const contents = [
        {
            role: "user",
            parts: [
                {
                    text: process.env.SYSTEM_PROMPT,
                },
            ],
        },
        {
            role: "model",
            parts: [{ text: "```json []```" }],
        },
        ...lastMessages,
    ] as any;

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });

    let text = "";
    for await (const chunk of response) {
        if (chunk.text) {
            text += chunk.text;
        }
    }

    let foodArray = [];
    try {
        foodArray = JSON.parse(
            text.replaceAll("```", "").replace("json", "")
        ).map((item: string) => item.toLowerCase());
    } catch (error) {
        throw new Error(
            `Failed to parse food suggestions: ${errorToString(error)}`
        );
    }

    console.log(foodArray);

    let suggestedMeals: MealType[] = [];
    try {
        const seenMealIds = new Set<string>();
        const maxMealsPerFoodItem = 2;
        const maxMealsSuggestions = 8;
        for (const foodName of foodArray) {
            const mealsResponse: MealsResponseType = await searchMealByName(
                foodName
            );
            if (!mealsResponse || !mealsResponse.meals) {
                continue;
            }
            let picked_meals = 0;
            for (const meal of mealsResponse.meals) {
                if (!seenMealIds.has(meal.idMeal)) {
                    suggestedMeals.push(meal);
                    seenMealIds.add(meal.idMeal);
                    picked_meals++;
                    if (
                        picked_meals >= maxMealsPerFoodItem ||
                        suggestedMeals.length >= maxMealsSuggestions
                    )
                        break; // Limit to 5 meals per food item
                }
            }
            if (suggestedMeals.length >= maxMealsSuggestions) break; // Limit to 6~11 meals meals maximum
        }
        foodArray = suggestedMeals.map((meal) => meal.strMeal);
    } catch (error) {
        throw new Error(
            `Failed to generate food suggestions: ${errorToString(error)}`
        );
    }

    if (suggestedMeals.length > 0) {
        return (
            <div className="flex flex-col gap-2">
                <div className="font-bold text-gray-700 text-sm">
                    Suggested Meals:
                </div>
                {suggestedMeals.map((meal: MealType, index: number) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow p-2 flex items-center gap-3 max-w-xs">
                        <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="w-16 h-16 object-cover rounded"
                        />

                        <div className="font-semibold text-gray-800 text-wrap text-xs truncate flex-1">
                            {meal.strMeal}
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div className="text-sm text-gray-700">
                Could not find any meal suggestions based on your input
            </div>
        );
    }
}
