import type { MetadataRoute } from "next";
import { absoluteSiteUrl, siteConfig } from "@/shared/siteConfig";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: `${siteConfig.basePath}/`,
            disallow: [`${siteConfig.basePath}/admin/`],
        },
        sitemap: absoluteSiteUrl("/sitemap.xml"),
    };
}
