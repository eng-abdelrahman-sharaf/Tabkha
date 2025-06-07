import ChatIcon from "@mui/icons-material/Chat";

export const ChatbotFloatingButton = ({
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
