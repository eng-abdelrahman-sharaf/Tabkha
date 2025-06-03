"use client";
import { cn } from "@/lib/styles";
import { FormEvent, ReactNode, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ChefIcon from "./assets/ChefIcon";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessages } from "@/server/bot.actions";
import { isBot } from "next/dist/server/web/spec-extension/user-agent";

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

const Message = ({
    message,
    time,
    isBot,
}: {
    message: string;
    time: string;
    isBot: boolean;
}) => (
    <div
        className={cn("flex items-start gap-2.5", isBot || "flex-row-reverse")}>
        {isBot ? (
            <ChefIcon className="w-5 text-gray-700" />
        ) : (
            <AccountCircleIcon className="text-black !text-lg" />
        )}
        <div
            className={cn(
                "flex flex-col grow max-w-[180px] p-4 border-gray-200 bg-gray-100 rounded-xl",
                isBot ? "rounded-ss-none" : "rounded-se-none"
            )}>
            <div
                className={cn(
                    "flex items-center space-x-2",
                    isBot ? "justify-start" : "justify-end"
                )}>
                <span className="text-sm font-semibold text-indigo-700">
                    {isBot ? "Chef Bot" : "You"}
                </span>
                <span className="text-sm font-normal text-indigo-500">
                    {time}
                </span>
            </div>
            <p className="text-sm font-normal text-gray-900">{message}</p>
        </div>
    </div>
);

const UserMessage = ({ message, time }: { message: string; time: string }) => (
    <Message message={message} time={time} isBot={false} />
);

const BotMessage = ({ message, time }: { message: string; time: string }) => (
    <Message message={message} time={time} isBot />
);

const ChatbotFloatingButton = ({
    openChatbot,
}: {
    openChatbot: () => void;
}) => (
    <div className="fixed bottom-8 right-8 z-50">
        <button
            onClick={openChatbot}
            className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none">
            <ChatIcon className="-scale-x-100 !text-2xl" />
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
    const [chatHistory, setChatHistory] = useState([
        {
            message: "Hello! How can I assist you today?",
            time: "11:45 AM",
            isBot: true,
        },
    ]);

    const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
        const time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        setChatHistory((prev) => [
            ...prev,
            { message: data.message, time, isBot: false },
        ]);
        const response = await sendMessages(
            chatHistory.map((chat) => ({
                role: chat.isBot ? "assistant" : "user",
                content: chat.message,
            }))
        );
        setChatHistory((prev) => [
            ...prev,
            { message: response || "Server is busy", time, isBot: true },
        ]);
        // await new Promise((resolve) => setTimeout(resolve, 3000));
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

                <div
                    className={cn(
                        "flex-1",
                        "overflow-y-auto scrollbar-indigo",
                        "border-t border-b space-y-2 border-gray-200", // separator lines
                        "py-2 px-1 max-h-48" // limit height to fit within the chat window
                    )}>
                    {chatHistory.map((chat, index) => (
                        <Message
                            key={index}
                            message={chat.message}
                            time={chat.time}
                            isBot={chat.isBot}
                        />
                    ))}
                    {isSubmitting && (
                        <Message message="thinking..." time=" " isBot />
                    )}
                </div>

                <form
                    className="mt-2 flex gap-2 items-center"
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
