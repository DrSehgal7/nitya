import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work", "/goals", "/habits", "/races", "/privacy"].map((path) => ({
    url: `${site.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/races" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/privacy" ? 0.6 : 0.85,
  }));
}
