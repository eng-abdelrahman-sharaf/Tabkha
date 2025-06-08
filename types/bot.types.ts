import { ReactNode } from "react";
import { z } from "zod";

export type BotContextType = {
    role: "model";
    parts: {
        text: ReactNode;
    }[];
}[];

export type UserContextType = {
    role: "user";
    parts: {
        text: string;
    }[];
}[];

export type MessageObjType = BotMessageObjType | UserMessageObjType;

export type BotMessageObjType = {
    message: React.ReactNode;
    isBot: boolean;
};

export type BotChatHistoryType = BotMessageObjType[];

export type UserMessageObjType = {
    message: string;
    isBot: boolean;
};

export type UserChatHistoryType = UserMessageObjType[];

export const MessageSchema = z.object({
    message: z
        .string()
        .min(1, "Message cannot be empty")
        .max(100, "Message is too long"),
});

export type MessageFormDataType = z.infer<typeof MessageSchema>;
