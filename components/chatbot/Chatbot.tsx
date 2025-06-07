"use client";
import { cn } from "@/lib/styles";
import React, {
    FormEvent,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessages } from "@/server/bot.actions";
import { Message } from "./Message";
import { ChatbotFloatingButton } from "./ChatbotFloatingButton";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import { scrollDown, updateBottomReachedHandler } from "@/lib/scrolling";

const ChatbotHeader = ({ closeChat }: { closeChat: () => void }) => (
    <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-indigo-600">Chat with us</h2>
        <button
            onClick={closeChat}
            className="text-gray-500 hover:text-gray-700 h-fit rounded-full flex items-center justify-center cursor-pointer">
            <CloseIcon />
        </button>
    </div>
);

const MessageSchema = z.object({
    message: z
        .string()
        .min(1, "Message cannot be empty")
        .max(100, "Message is too long"),
});

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema),
    });
    const [botChatHistory, setBotChatHistory] = useState<
        { message: ReactNode; time: string; isBot: boolean }[]
    >([
        {
            message: "Hello! How can I assist you today?",
            time: "11:45 AM",
            isBot: true,
        },
    ]);
    const [userChatHistory, setUserChatHistory] = useState<
        { message: string; time: string; isBot: boolean }[]
    >([]);
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
    }, [MessageContainerRef.current, botChatHistory, userChatHistory]);

    const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
        const time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        const newUserHistory = [
            ...userChatHistory,
            { message: data.message, time, isBot: false },
        ];
        setUserChatHistory(newUserHistory);
        const response = await sendMessages(
            newUserHistory.map((chat) => ({
                role: "user",
                parts: [{ text: chat.message }],
            }))
        );
        setBotChatHistory((prev) => [
            ...prev,
            { message: response || "Server is busy", time, isBot: true },
        ]);
    };
    return (
        <>
            <ChatbotFloatingButton
                openChatbot={() => {
                    setIsOpen(true);
                }}
            />
            <div
                className={cn(
                    `fixed max-w-80 bg-white rounded-lg shadow-lg p-4 z-50 bottom-28 right-4 flex-col overflow-hidden`,
                    "w-[calc(100vw-2rem)]", // to ensure it doesn't exceed viewport width
                    "max-h-[calc(100vh-7rem)]", // to ensure it doesn't exceed viewport height
                    isOpen ? "flex" : "hidden"
                )}>
                <ChatbotHeader
                    closeChat={() => {
                        setIsOpen(false);
                    }}
                />

                {/* messages container */}
                <div
                    ref={MessageContainerRef}
                    className={cn(
                        "flex-1",
                        "overflow-y-auto scrollbar-indigo",
                        "border-t border-b space-y-2 border-gray-200", // separator lines
                        "py-2 px-1 max-h-48", // limit height to fit within the chat window
                        "relative" // for the scroll button
                    )}>
                    {Array.from({ length: botChatHistory.length }).map(
                        (_, index) => (
                            <React.Fragment key={index}>
                                {botChatHistory[index] && (
                                    <Message
                                        message={botChatHistory[index].message}
                                        time={botChatHistory[index].time}
                                        isBot={botChatHistory[index].isBot}
                                    />
                                )}
                                {userChatHistory[index] && (
                                    <Message
                                        message={userChatHistory[index].message}
                                        time={userChatHistory[index].time}
                                        isBot={userChatHistory[index].isBot}
                                    />
                                )}
                            </React.Fragment>
                        )
                    )}
                    {isSubmitting && (
                        <Message message="thinking..." time=" " isBot />
                    )}
                </div>

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
                        }
                    }}>
                    <button
                        type="button"
                        className={cn(
                            "absolute left-1/2 bottom-full -translate-y-4 -translate-x-1/2 h-fit w-fit z-50 transition-opacity",
                            isBottomReached
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100 pointer-events-auto"
                        )}
                        onClick={() => scrollDown(MessageContainerRef.current)}
                        disabled={isBottomReached}
                        aria-disabled={isBottomReached}
                        aria-label="Scroll to bottom">
                        <ArrowCircleDownRoundedIcon className="text-indigo-600 !text-2xl" />
                    </button>
                    <textarea
                        {...register("message")}
                        name="message"
                        rows={2}
                        placeholder="Type your message..."
                        className="flex-1 border resize-none h-auto  border-gray-300 text-black rounded px-3 py-2 text-sm scrollbar-indigo"
                    />
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className={
                            "bg-indigo-600 text-white p-4 rounded-full disabled:bg-slate-300 hover:bg-indigo-700 transition flex items-center justify-center"
                        }>
                        <RestaurantIcon className="!text-lg" />
                    </button>
                </form>
            </div>
        </>
    );
}
