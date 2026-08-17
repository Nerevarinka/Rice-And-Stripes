const SITE_URL = "https://nerevarinka.github.io/Rice-And-Stripes";
const AUTHOR_URL = `${SITE_URL}/about`;
const LOGO_URL = `${SITE_URL}/logoV2-preview-v2.jpg`;

export const PERSON_ID = `${AUTHOR_URL}#author`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

function absoluteUrl(path: string) {
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/Rice-And-Stripes/")) {
        return `https://nerevarinka.github.io${path}`;
    }
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createSiteStructuredData() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": PERSON_ID,
                name: "Nerevarinka",
                url: AUTHOR_URL,
                sameAs: [
                    "https://t.me/rice_and_stripes",
                    "https://vk.com/rice_and_stripes",
                    "https://github.com/Nerevarinka",
                ],
            },
            {
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                name: "Rice & Stripes",
                url: SITE_URL,
                logo: {
                    "@type": "ImageObject",
                    url: LOGO_URL,
                },
            },
            {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                name: "Rice & Stripes",
                url: SITE_URL,
                description: "Блог о жизни амадин: уход, наблюдения, наука",
                inLanguage: "ru-RU",
                author: { "@id": PERSON_ID },
                publisher: { "@id": ORGANIZATION_ID },
            },
        ],
    };
}

type PublicationStructuredDataInput = {
    title: string;
    description: string;
    slug: string;
    section: "articles" | "notes";
    coverUrl?: string;
    publishDate: string;
    updatedAt: string;
    tags?: string[];
};

export function createPublicationStructuredData({
    title,
    description,
    slug,
    section,
    coverUrl,
    publishDate,
    updatedAt,
    tags = [],
}: PublicationStructuredDataInput) {
    const publicationUrl = `${SITE_URL}/${section}/${slug}`;
    const sectionName = section === "articles" ? "Статьи" : "Заметки";
    const sectionUrl = `${SITE_URL}/${section}`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `${publicationUrl}#publication`,
                headline: title,
                description,
                url: publicationUrl,
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": publicationUrl,
                },
                ...(coverUrl ? { image: absoluteUrl(coverUrl) } : {}),
                datePublished: publishDate,
                dateModified: updatedAt,
                inLanguage: "ru-RU",
                ...(tags.length ? { keywords: tags.join(", ") } : {}),
                author: { "@id": PERSON_ID },
                publisher: { "@id": ORGANIZATION_ID },
                isPartOf: { "@id": WEBSITE_ID },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${publicationUrl}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Главная",
                        item: SITE_URL,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: sectionName,
                        item: sectionUrl,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: title,
                        item: publicationUrl,
                    },
                ],
            },
        ],
    };
}
