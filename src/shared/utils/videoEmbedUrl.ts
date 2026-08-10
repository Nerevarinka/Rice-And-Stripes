import type { EditableArticleVideoKind } from "@/models/editableArticle";

function getYoutubeEmbedUrl(url: string) {
    if (url.includes("youtube.com/embed/") || url.includes("youtube-nocookie.com/embed/")) {
        return url;
    }

    try {
        const parsed = new URL(url);
        const videoId = parsed.hostname.includes("youtu.be")
            ? parsed.pathname.split("/").filter(Boolean)[0]
            : parsed.hostname.includes("youtube.com")
                ? parsed.searchParams.get("v")
                : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } catch {
        return "";
    }
}

function getVimeoEmbedUrl(url: string) {
    if (url.includes("player.vimeo.com/video/")) {
        return url;
    }

    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return match?.[1] ? `https://player.vimeo.com/video/${match[1]}` : "";
}

function getRutubeEmbedUrl(url: string) {
    try {
        const parsed = new URL(url);
        if (!parsed.hostname.endsWith("rutube.ru")) {
            return "";
        }

        const match = parsed.pathname.match(/\/(?:play\/embed|video(?:\/private)?|shorts)\/([^/]+)/i);
        if (!match?.[1]) {
            return "";
        }

        const privateKey = parsed.searchParams.get("p");
        return `https://rutube.ru/play/embed/${match[1]}${privateKey ? `/?p=${encodeURIComponent(privateKey)}` : ""}`;
    } catch {
        return "";
    }
}

function getVkEmbedUrl(url: string) {
    try {
        const parsed = new URL(url);
        const isVkHost = parsed.hostname === "vk.com"
            || parsed.hostname.endsWith(".vk.com")
            || parsed.hostname === "vk.ru"
            || parsed.hostname.endsWith(".vk.ru")
            || parsed.hostname === "vkvideo.ru"
            || parsed.hostname.endsWith(".vkvideo.ru");
        if (!isVkHost) {
            return "";
        }

        if (parsed.pathname.endsWith("/video_ext.php")) {
            const ownerId = parsed.searchParams.get("oid");
            const videoId = parsed.searchParams.get("id");
            return ownerId && videoId ? url : "";
        }

        const match = decodeURIComponent(url).match(/(?:video|clip)(-?\d+)_(\d+)/i);
        if (!match?.[1] || !match[2]) {
            return "";
        }

        return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2`;
    } catch {
        return "";
    }
}

export function getVideoEmbedUrl(kind: EditableArticleVideoKind, url: string) {
    if (!url) {
        return "";
    }

    if (kind === "youtube") return getYoutubeEmbedUrl(url);
    if (kind === "vk") return getVkEmbedUrl(url);
    if (kind === "rutube") return getRutubeEmbedUrl(url);
    if (kind === "vimeo") return getVimeoEmbedUrl(url);
    return "";
}
