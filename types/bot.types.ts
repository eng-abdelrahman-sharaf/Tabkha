import { ReactNode } from "react";

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
