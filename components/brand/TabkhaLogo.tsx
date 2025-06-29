import { cn } from "@/lib/styles";
import Link from "next/link";
import { ComponentProps } from "react";

export default function TabkhaLogo({
    href = "/",
    className,
    ...otherProps
}: Omit<ComponentProps<typeof Link>, "href"> & { href?: string }) {
    return (
        <Link
            className={cn(
                "text-2xl font-bold coiny-regular text-indigo-600",
                className
            )}
            href={href ?? "/"}
            {...otherProps}>
            Tabkha
        </Link>
    );
}
TabkhaLogo.displayName = "TabkhaLogo";
