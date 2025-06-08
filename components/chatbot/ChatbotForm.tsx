"use client";

import React, { useState } from "react";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import { MessageFormDataType } from "@/types/bot.types";
import { cn } from "@/lib/styles";

interface ChatbotFormProps {
    onSubmit: (data: MessageFormDataType) => void;
    isBottomReached: boolean;
    scrollDown: () => void;
}

export const ChatbotForm: React.FC<
    ChatbotFormProps &
        ReturnType<
            typeof import("react-hook-form").useForm<MessageFormDataType>
        >
> = ({
    register,
    handleSubmit,
    onSubmit,
    formState: { isValid, isSubmitting },

    isBottomReached,
    scrollDown,
}) => {
    const [textAreaHeight, setTextAreaHeight] = useState("2.5rem");
    return (
        <form
            className="mt-2 flex gap-2 items-center relative"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit, (error) => {
                    console.error(
                        "Form submission error:",
                        error.message?.message
                    );
                })(e);
                if (isValid) {
                    e.currentTarget.reset();
                    setTextAreaHeight("2.5rem"); // reset height after submission
                }
            }}>
            {/* Scroll-to-bottom button, only visible if not at bottom */}
            <button
                type="button"
                className={cn(
                    "absolute left-1/2 bottom-full -translate-y-4 -translate-x-1/2 h-fit w-fit z-50 transition-opacity",
                    isBottomReached
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100 pointer-events-auto"
                )}
                onClick={() => scrollDown()}
                disabled={isBottomReached}
                aria-disabled={isBottomReached}
                aria-label="Scroll to bottom">
                <div className="w-[19px] h-[19px] bg-white absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-20 rounded-full"></div>
                <ArrowCircleDownRoundedIcon className="text-indigo-600 !text-2xl relative" />
            </button>
            {/* Auto-resizing textarea for chat input */}
            <textarea
                {...register("message")}
                style={{
                    height: textAreaHeight,
                    maxHeight: "5rem", // to limit the maximum height
                }}
                onInput={(e) => {
                    const target = e.currentTarget;
                    target.style.height = "2.5rem"; // reset height to default (when one line or empty)
                    target.style.height =
                        Math.min(
                            target.scrollHeight + 2, // some tolerance for hiding scrollbar when no overflow (increasing or reducing it will cause a startup shift)
                            5 * 16
                        ) + "px"; // to not exceed a specified height
                    setTextAreaHeight(target.style.height);
                }}
                name="message"
                rows={1}
                placeholder="Type your message..."
                className="flex-1 border resize-none  border-gray-300 text-black rounded px-3 py-2 text-sm scrollbar-indigo"
            />
            <button
                disabled={isSubmitting || !isValid}
                type="submit"
                className={
                    "bg-indigo-600 text-white p-4 rounded-full disabled:bg-slate-300 hover:bg-indigo-700 transition flex items-center justify-center disabled:!cursor-not-allowed"
                }>
                <RestaurantIcon className="!text-lg" />
            </button>
        </form>
    );
};
