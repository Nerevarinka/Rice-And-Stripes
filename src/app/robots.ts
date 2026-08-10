import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/Rice-And-Stripes/",
            disallow: ["/Rice-And-Stripes/admin/"],
        },
        sitemap: "https://nerevarinka.github.io/Rice-And-Stripes/sitemap.xml",
    };
}
