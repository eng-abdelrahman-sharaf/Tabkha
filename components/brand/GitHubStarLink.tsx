import Link from "next/link";
import { GitHubLogo } from "../assets/platforms/GitHubLogo";
import { cn } from "@/lib/styles";
import { tv } from "tailwind-variants";

const getGitHubLinkClassName = tv({
    base: "flex items-center gap-1 text-xl",
    variants: {
        variant: {
            plain: "text-gray-700 hover:text-indigo-600",
            primary:
                "bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-3 py-1",
        },
    },
});

export default function GitHubStarLink({
    variant = "primary",
}: {
    variant?: "plain" | "primary";
}) {
    return (
        <Link
            href="https://github.com/eng-abdelrahman-sharaf/Tabkha"
            aria-label="Give the repo a star on github"
            className={cn(getGitHubLinkClassName({ variant }))}>
            <GitHubLogo className="text-xl" />
            Star
        </Link>
    );
}
