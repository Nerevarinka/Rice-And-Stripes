"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

import { getPageScrollElement, scrollPageToTop, usesDocumentScroll } from "@/shared/utils/pageScroll";

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

    useLayoutEffect(() => {
        if (!shouldShowScrollToTop) return;

        const progress = progressRef.current;
        const scrollContainer = anchorRef.current?.closest("main");
        if (!(scrollContainer instanceof HTMLElement)) return;
		const documentScroll = usesDocumentScroll();
		const scrollElement = getPageScrollElement(scrollContainer);

        const updateProgress = () => {
			const scrollableHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
			const ratio = scrollableHeight > 0 ? scrollElement.scrollTop / scrollableHeight : 0;
            if (progress) progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
			const distanceToBottom = scrollableHeight - scrollElement.scrollTop;

            if (isScrollingToTopRef.current) {
				if (scrollElement.scrollTop <= 1) {
                    isScrollingToTopRef.current = false;
                    setShowScrollToTop(false);
                } else {
                    setShowScrollToTop(true);
                }
                return;
            }

            setShowScrollToTop(
				scrollElement.scrollTop > 500 && (!shouldShowProgress || distanceToBottom > 240)
            );
        };

        updateProgress();
		const scrollTarget: Window | HTMLElement = documentScroll ? window : scrollContainer;
		scrollTarget.addEventListener("scroll", updateProgress, { passive: true });
        const resizeObserver = new ResizeObserver(updateProgress);
		resizeObserver.observe(scrollElement);

        return () => {
			scrollTarget.removeEventListener("scroll", updateProgress);
            resizeObserver.disconnect();
            if (scrollResetTimerRef.current) clearTimeout(scrollResetTimerRef.current);
        };
    }, [pathname, shouldShowProgress, shouldShowScrollToTop]);

    if (!shouldShowScrollToTop) return null;

    const scrollToTop = () => {
        const scrollContainer = anchorRef.current?.closest("main");
        if (!(scrollContainer instanceof HTMLElement)) return;
		const scrollElement = getPageScrollElement(scrollContainer);

        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        isScrollingToTopRef.current = true;
		scrollPageToTop(scrollContainer);

        if (scrollResetTimerRef.current) clearTimeout(scrollResetTimerRef.current);
        scrollResetTimerRef.current = setTimeout(() => {
            isScrollingToTopRef.current = false;
			setShowScrollToTop(scrollElement.scrollTop > 500);
        }, 2000);
    };

    return (
        <>
            <span ref={anchorRef} className="scroll-progress-anchor" aria-hidden="true" />
            {shouldShowProgress ? (
                <div
                    className="scroll-progress"
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        inset: "0 0 auto",
                        height: 3,
                        zIndex: 1000,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        ref={progressRef}
                        className="scroll-progress__value"
                        style={{
                            width: 0,
                            height: "100%",
                            backgroundColor: "#753105",
                        }}
                    />
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
