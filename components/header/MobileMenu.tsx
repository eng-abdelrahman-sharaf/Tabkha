"use client";
import { useState } from "react";
import Button from "../design-system/Button";
import MobileMenuDrawer from "./MobileMenuDrawer";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button
                className="md:hidden w-10 h-10 focus:outline-none"
                color="secondary"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu">
                <MenuRoundedIcon className="!text-[1.75rem]" />
            </Button>
            <MobileMenuDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
MobileMenu.displayName = "MobileMenu";
