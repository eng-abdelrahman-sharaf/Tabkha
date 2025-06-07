import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ReactNode } from "react";
import ChefIcon from "../assets/ChefIcon";
import { cn } from "@/lib/styles";

export const Message = ({
    message,
    time,
    isBot,
}: {
    message: ReactNode;
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
            {/* <div
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
            </div> */}
            <div className="text-sm font-normal text-gray-900">{message}</div>
        </div>
    </div>
);
