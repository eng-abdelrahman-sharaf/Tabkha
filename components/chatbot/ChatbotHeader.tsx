import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export const ChatbotHeader = ({ closeChat }: { closeChat: () => void }) => (
    <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-indigo-600">Chat with us</h2>
        <button
            onClick={closeChat}
            className="text-gray-500 hover:text-gray-700 h-fit rounded-full flex items-center justify-center cursor-pointer">
            <CloseIcon />
        </button>
    </div>
);
