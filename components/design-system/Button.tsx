import { cn } from "@/lib/styles";
import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const getButtonClassName = tv({
    base: "flex justify-center items-center rounded-full focus:outline-none",
    variants: {
        color: {
            primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
            secondary: "hover:bg-indigo-50 text-indigo-600",
        },
    },
});

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    color?: "primary" | "secondary";
}

export default function Button({
    className,
    color = "primary",
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(getButtonClassName({ color }), className)}
            {...props}
        />
    );
}
Button.displayName = "Button";
