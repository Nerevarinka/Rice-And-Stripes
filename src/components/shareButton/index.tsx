"use client";

import { Check, Copy, Forward } from "lucide-react";
import { siTelegram, siVk } from "simple-icons";
import { useEffect, useId, useRef, useState } from "react";

import "./styles.scss";

type ShareButtonProps = {
    title: string;
    text?: string;
};

export default function ShareButton({ title, text }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuId = useId();
    const rootRef = useRef<HTMLSpanElement>(null);
    const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const closeMenu = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", closeMenu);
            document.addEventListener("keydown", closeOnEscape);
        }

        return () => {
            document.removeEventListener("mousedown", closeMenu);
            document.removeEventListener("keydown", closeOnEscape);
            if (resetTimer.current) clearTimeout(resetTimer.current);
        };
    }, [isOpen]);

    const showCopiedState = () => {
        setCopied(true);
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setCopied(false), 2500);
    };

    const copyCurrentUrl = async () => {
        const url = window.location.href;

        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);
        } else {
            const input = document.createElement("textarea");
            input.value = url;
            input.style.position = "fixed";
            input.style.opacity = "0";
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
        }

        showCopiedState();
    };

    const getShareLinks = () => {
        const url = window.location.href;
        const message = text ? `${title}\n${text}` : title;
        return {
            vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}${text ? `&description=${encodeURIComponent(text)}` : ""}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`,
        };
    };

    return (
        <span className="publication-share" ref={rootRef}>
            <button
                type="button"
                className={`publication-share-button${isOpen ? " is-active" : ""}`}
                onClick={() => setIsOpen(open => !open)}
                title="Поделиться публикацией"
                aria-label="Поделиться публикацией"
                aria-expanded={isOpen}
                aria-controls={menuId}
            >
                <Forward size={17} aria-hidden="true" />
            </button>
            {isOpen ? (
                <span className="publication-share-menu" id={menuId} role="menu">
                    <a
                        href={getShareLinks().vk}
                        className="publication-share-menu__item"
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siVk.path} /></svg>
                        ВКонтакте
                    </a>
                    <a
                        href={getShareLinks().telegram}
                        className="publication-share-menu__item"
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siTelegram.path} /></svg>
                        Telegram
                    </a>
                    <button
                        type="button"
                        className={`publication-share-menu__item${copied ? " is-copied" : ""}`}
                        role="menuitem"
                        onClick={copyCurrentUrl}
                    >
                        {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                        {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
                    </button>
                </span>
            ) : null}
        </span>
    );
}
