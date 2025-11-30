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
            // Basic UA check for mobile devices (works when phone is in landscape)
            const ua = typeof navigator !== "undefined" ? navigator.userAgent || navigator.vendor || "" : "";
            const uaIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(ua);

            // Consider device mobile if UA indicates mobile OR width is below breakpoint
            const byWidth = window.innerWidth < breakpoint;
            setIsMobile(uaIsMobile || byWidth);
        };

        // Initial check
        checkIsMobile();

        // Add event listener for window resize
        window.addEventListener("resize", checkIsMobile);
        // Also react to orientation changes (covers landscape on phones)
        window.addEventListener("orientationchange", checkIsMobile);

        // Cleanup
        return () => {
            window.removeEventListener("resize", checkIsMobile);
            window.removeEventListener("orientationchange", checkIsMobile);
        };
    }, [breakpoint]);

    return isMobile;
};
