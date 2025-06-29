import { cn, mainContentPadding } from "@/lib/styles";
import NavLinks from "./NavLinks";
import GitHubStarLink from "../brand/GitHubStarLink";
import TabkhaLogo from "../brand/TabkhaLogo";
import MobileMenu from "./MobileMenu";

export default function Header() {
    return (
        <>
            <header className="bg-white shadow fixed inset-0 bottom-auto z-40">
                <div
                    className={cn(
                        "max-w-7xl mx-auto flex justify-between h-16 items-center",
                        mainContentPadding
                    )}>
                    <div>
                        <TabkhaLogo />
                        
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <NavLinks className="hidden md:flex gap-10" />

                    <div className="flex items-center gap-2">
                        <GitHubStarLink />

                        <MobileMenu />
                    </div>
                </div>
            </header>
        </>
    );
}
