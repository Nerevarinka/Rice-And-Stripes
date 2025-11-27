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

        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Initial check
        checkIsMobile();

        // Add event listener for window resize
        window.addEventListener("resize", checkIsMobile);

        // Cleanup
        return () => window.removeEventListener("resize", checkIsMobile);
    }, [breakpoint]);

    return isMobile;
};
