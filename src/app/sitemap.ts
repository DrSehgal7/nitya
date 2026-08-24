import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/work", "/goals", "/habits", "/events", "/privacy"].map((path) => ({
    url: `${site.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/work" || path === "/goals" ? "weekly" : "monthly",
    priority:
      path === "" ? 1 : ["/about", "/work", "/goals", "/events"].includes(path) ? 0.85 : 0.6,
  }));
}
