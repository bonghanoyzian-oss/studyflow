import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://studyflow-drab-one.vercel.app",
      lastModified: new Date(),
    },
  ];
}