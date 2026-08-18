import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the site is opened on a mobile device
 * @param breakpoint - Maximum width in pixels to consider as mobile (default: 768)
 * @returns boolean indicating if the device is mobile
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Check if window is defined (for SSR compatibility)
        if (typeof window === "undefined") return;

        const media = window.matchMedia(`(max-width: ${breakpoint - 0.02}px), (hover: none) and (pointer: coarse)`);
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener("change", update);

        // Cleanup
        return () => {
            media.removeEventListener("change", update);
        };
    }, [breakpoint]);

    return isMobile;
};
