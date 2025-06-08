import React, { forwardRef } from "react";
import { Message } from "./Message";
import { BotChatHistoryType, UserChatHistoryType } from "@/types/bot.types";
import { cn } from "@/lib/styles";

export const MessageContainer = forwardRef<
    HTMLDivElement,
    {
        botChatHistory: BotChatHistoryType;
        userChatHistory: UserChatHistoryType;
        isSubmitting: boolean;
        isBottomReached: boolean;
    }
>(({ botChatHistory, userChatHistory, isSubmitting }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex-1",
            "overflow-y-auto scrollbar-indigo",
            "border-t border-b space-y-2 border-gray-200", // Separator lines
            "py-2 px-1 max-h-48", // Limit height to fit within the chat window
            "relative" // fot the scroll button
        )}>
        {Array.from({ length: botChatHistory.length }).map((_, index) => (
            <React.Fragment key={index}>
                {botChatHistory[index] && (
                    <Message messageObj={botChatHistory[index]} />
                )}
                {userChatHistory[index] && (
                    <Message messageObj={userChatHistory[index]} />
                )}
            </React.Fragment>
        ))}
        {isSubmitting && (
            <Message messageObj={{ message: "thinking...", isBot: true }} />
        )}
    </div>
));

MessageContainer.displayName = "MessageContainer";
