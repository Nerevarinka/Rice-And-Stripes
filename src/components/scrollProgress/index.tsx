"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

import "./styles.scss";

export default function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<HTMLSpanElement>(null);
    const isScrollingToTopRef = useRef(false);
    const scrollResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const pathname = usePathname();
    const localPathname = pathname.replace(/^\/Rice-And-Stripes(?=\/|$)/, "").replace(/\/$/, "") || "/";
    const shouldShowProgress =
        localPathname === "/about" ||
        localPathname === "/finches" ||
        localPathname.startsWith("/articles/") ||
        localPathname.startsWith("/notes/");
    const shouldShowScrollToTop = shouldShowProgress || localPathname === "/articles" || localPathname === "/notes";

    useEffect(() => {
        if (!shouldShowScrollToTop) return;

        const progress = progressRef.current;
        const scrollContainer = anchorRef.current?.closest("main");
        if (!(scrollContainer instanceof HTMLElement)) return;

        const updateProgress = () => {
            const scrollableHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            const ratio = scrollableHeight > 0 ? scrollContainer.scrollTop / scrollableHeight : 0;
            if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
            const distanceToBottom = scrollableHeight - scrollContainer.scrollTop;

            if (isScrollingToTopRef.current) {
                if (scrollContainer.scrollTop <= 1) {
                    isScrollingToTopRef.current = false;
                    setShowScrollToTop(false);
                } else {
                    setShowScrollToTop(true);
                }
                return;
            }

            setShowScrollToTop(
                scrollContainer.scrollTop > 500 && (!shouldShowProgress || distanceToBottom > 240)
            );
        };

        updateProgress();
        scrollContainer.addEventListener("scroll", updateProgress, { passive: true });
        const resizeObserver = new ResizeObserver(updateProgress);
        resizeObserver.observe(scrollContainer);

        return () => {
            scrollContainer.removeEventListener("scroll", updateProgress);
            resizeObserver.disconnect();
            if (scrollResetTimerRef.current) clearTimeout(scrollResetTimerRef.current);
        };
    }, [pathname, shouldShowProgress, shouldShowScrollToTop]);

    if (!shouldShowScrollToTop) return null;

    const scrollToTop = () => {
        const scrollContainer = anchorRef.current?.closest("main");
        if (!(scrollContainer instanceof HTMLElement)) return;

        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        isScrollingToTopRef.current = true;
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });

        if (scrollResetTimerRef.current) clearTimeout(scrollResetTimerRef.current);
        scrollResetTimerRef.current = setTimeout(() => {
            isScrollingToTopRef.current = false;
            setShowScrollToTop(scrollContainer.scrollTop > 500);
        }, 2000);
    };

    return (
        <>
            <span ref={anchorRef} className="scroll-progress-anchor" aria-hidden="true" />
            {shouldShowProgress ? (
                <div className="scroll-progress" aria-hidden="true">
                    <div ref={progressRef} className="scroll-progress__value" />
                </div>
            ) : null}
            <button
                type="button"
                className={`scroll-to-top${showScrollToTop ? " scroll-to-top--visible" : ""}`}
                onClick={scrollToTop}
                title="Наверх"
                aria-label="Наверх"
                tabIndex={showScrollToTop ? 0 : -1}
            >
                <ArrowUp size={20} />
            </button>
        </>
    );
}
