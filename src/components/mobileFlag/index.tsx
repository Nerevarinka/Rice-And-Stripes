"use client";

import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Client component that writes `--is-mobile` CSS variable and `is-mobile` class
 * to the root element so CSS (and JS) can react to the hook result.
 */
export default function MobileFlag() {
    const isMobile = useIsMobile();

    useEffect(() => {
        try {
            const root = document.documentElement;
            root.style.setProperty("--is-mobile", isMobile ? "1" : "0");

            if (isMobile) {
                root.classList.add("is-mobile");
            } else {
                root.classList.remove("is-mobile");
            }
        } catch (e) {
            // ignore in non-browser environments
        }
    }, [isMobile]);

    return null;
}
