"use server";
import {  UserContextType } from "@/types/bot.types";
import {  GoogleGenAI } from "@google/genai";


const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

export async function sendMessages(conversationHistory: UserContextType) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
        responseMimeType: "text/plain",
    };

    // const model = "gemma-3n-e4b-it";
    const model = "gemini-2.0-flash-lite";

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

    console.log(
        contents.map(
            (item: { parts: { text: string }[] }) => item.parts[0].text
        )
    );

    let text = "";
    for await (const chunk of response) {
        console.log(chunk.text);
        if (chunk.text) {
            text += chunk.text;
        }
    }

    let foodArray = [];
    try {
        foodArray = JSON.parse(text.replaceAll("```", "").replace("json", ""));
    } catch (error) {
        console.log(error);
    }

    if (foodArray) {
        return (
            <div className="flex flex-col">
                {foodArray.map((foodName: string, index: number) => {
                    return <div key={index}>{foodName}</div>;
                })}
            </div>
        );
    } else {
        return "No food Suggested";
    }

    // const client = new OpenAI({
    //     baseURL: "https://models.github.ai/inference",
    //     apiKey: token,
    // });

    // console.log(token, endpoint, modelName);

    // const response = await client.chat.completions.create({
    //     messages: [
    //         { role: "system", content: "You are a helpful assistant." },
    //         ...conversationHistory,
    //     ],
    //     model: "openai/gpt-4o",
    //     temperature: 1,
    //     max_tokens: 2048,
    //     top_p: 1,
    // });

    // // Get the assistant's reply
    // const assistantReply = response.choices[0].message.content;
    // console.log(assistantReply);

    // return assistantReply;
}
