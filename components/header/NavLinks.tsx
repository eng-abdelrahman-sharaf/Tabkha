import { cn } from "@/lib/styles";
import Link from "next/link";
import React from "react";

interface NavLinksProps extends React.HTMLAttributes<HTMLElement> {
    isBgDark?: boolean;
    appendedLinks?: React.ReactNode;
}

export default function NavLinks({
    isBgDark = false,
    className,
    appendedLinks = null,
    ...props
}: NavLinksProps) {
    return (
        <nav
            className={cn(
                "flex",
                isBgDark
                    ? "text-indigo-200 hover:text-white"
                    : "*:text-gray-700 *:hover:text-indigo-600",
                className
            )}
            {...props}>
            <Link href="#">Explore</Link>
            <Link href="#">Search</Link>
            <Link href="#">Categories</Link>
            <Link href="#">Areas</Link>
            {appendedLinks}
        </nav>
    );
}
