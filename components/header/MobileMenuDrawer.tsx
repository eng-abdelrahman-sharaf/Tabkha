import { cn } from "@/lib/styles";
import TabkhaLogo from "../brand/TabkhaLogo";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavLinks from "./NavLinks";
import GitHubStarLink from "../brand/GitHubStarLink";
  
export default function MobileMenuDrawer({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <div
            className={cn(
                "fixed inset-0 bg-black/30 z-50",
                isOpen || "bg-transparent pointer-events-none"
            )}
            onClick={onClose} // Close the menu when clicking outside the drawer
        >
            <div
                className={cn(
                    "absolute top-0 left-0 w-64 bg-white h-full shadow-lg flex flex-col transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                onClick={(e) => e.stopPropagation()} // Prevent click from propagating to outside the drawer
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <TabkhaLogo />
                    <button
                        className="text-indigo-600 hover:bg-indigo-50 w-10 h-10 flex justify-center items-center rounded focus:outline-none"
                        aria-label="Close menu"
                        onClick={onClose}>
                        <CloseRoundedIcon sx={{ fontSize: "1.75rem" }} />
                    </button>
                </div>

                <div className="flex flex-col justify-between h-full px-6 py-4 ">
                    <NavLinks className="flex-col gap-y-3 *:text-lg" />
                    <GitHubStarLink variant="plain" />
                </div>
            </div>
        </div>
    );
}
MobileMenuDrawer.displayName = "MobileMenuDrawer";
