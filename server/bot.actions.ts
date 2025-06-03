"use server";
import OpenAI from "openai";

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

export async function sendMessages(
    conversationHistory: ChatCompletionMessageParam[]
) {
    const client = new OpenAI({
        baseURL: "https://models.github.ai/inference",
        apiKey: token,
    });

    console.log(token, endpoint, modelName);

    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...conversationHistory,
        ],
        model: "openai/gpt-4o",
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
    });

    // Get the assistant's reply
    const assistantReply = response.choices[0].message.content;
    console.log(assistantReply);

    return assistantReply;
}
