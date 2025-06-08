"use client";
import { cn } from "@/lib/styles";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessages } from "@/server/bot.actions";
import { ChatbotFloatingButton } from "./ChatbotFloatingButton";
import {
    BotChatHistoryType,
    MessageSchema,
    UserChatHistoryType,
} from "@/types/bot.types";
import { scrollDown, updateBottomReachedHandler } from "@/lib/scrolling";
import { ChatbotHeader } from "./ChatbotHeader";

import { MessageContainer } from "./MessageContainer";
import { ChatbotForm } from "./ChatbotForm";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema),
    });
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = form;
    const [botChatHistory, setBotChatHistory] = useState<BotChatHistoryType>([
        {
            message: "Hello! How can I assist you today?",
            isBot: true,
        },
    ]);
    const [userChatHistory, setUserChatHistory] = useState<UserChatHistoryType>(
        []
    );
    const [isBottomReached, setIsBottomReached] = useState(true);
    const MessageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollDown(MessageContainerRef.current); // scroll to the bottom when a new message is added
        if (MessageContainerRef.current) {
            const container = MessageContainerRef.current;
            container.addEventListener(
                "scroll",
                updateBottomReachedHandler(container, setIsBottomReached)
            );
            return () => {
                container.removeEventListener(
                    "scroll",
                    updateBottomReachedHandler(container, setIsBottomReached)
                );
            };
        }
    }, [userChatHistory]);

    const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
        const newUserHistory = [
            ...userChatHistory,
            { message: data.message, isBot: false },
        ];
        setUserChatHistory(newUserHistory);

        try {
            const response = await sendMessages(
                newUserHistory.map((chat) => ({
                    role: "user",
                    parts: [{ text: chat.message }],
                }))
            );
            setBotChatHistory((prev) => [
                ...prev,
                {
                    message: response,
                    isBot: true,
                },
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            setBotChatHistory((prev) => [
                ...prev,
                {
                    message: "An error occurred. Please try again.",
                    isBot: true,
                },
            ]);
            return;
        }
    };
    return (
        <>
            <ChatbotFloatingButton openChatbot={() => setIsOpen(true)} />
            <div
                className={cn(
                    `fixed max-w-80 bg-white rounded-lg shadow-lg p-4 z-50 bottom-28 right-4 flex-col overflow-hidden`,
                    "w-[calc(100vw-2rem)]", // to ensure it doesn't exceed viewport width
                    "max-h-[calc(100vh-7rem)]", // to ensure it doesn't exceed viewport height
                    isOpen ? "flex" : "hidden"
                )}>
                <ChatbotHeader closeChat={() => setIsOpen(false)} />
                <MessageContainer
                    ref={MessageContainerRef}
                    botChatHistory={botChatHistory}
                    userChatHistory={userChatHistory}
                    isSubmitting={isSubmitting}
                    isBottomReached={isBottomReached}
                />
                <ChatbotForm
                    {...form}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    isBottomReached={isBottomReached}
                    scrollDown={() => scrollDown(MessageContainerRef.current)}
                />
            </div>
        </>
    );
}
