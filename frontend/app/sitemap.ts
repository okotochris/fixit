import { MetadataRoute } from "next";

const SITE_URL = "https://servicehub.space";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithTimeout<T>(
  url: string,
  timeout = 10000
): Promise<T | null> {
  try {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Sitemap API failed: ${response.status} ${url}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Sitemap request failed: ${url}`, error);
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/service`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/available_jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not configured.");
    return staticUrls;
  }

  const [jobs, professionals, skills] = await Promise.all([
    fetchWithTimeout<
      { slug: string; updatedAt: string }[]
    >(`${API_URL}/api/jobs/sitemap`),

    fetchWithTimeout<
      { slug: string; updatedAt: string }[]
    >(`${API_URL}/api/professionals/sitemap`),

    fetchWithTimeout<
      { skill: string }[]
    >(`${API_URL}/api/workers/skills/sitemap`),
  ]);

  const jobUrls: MetadataRoute.Sitemap = (jobs ?? []).map((job) => ({
    url: `${SITE_URL}/job/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const professionalUrls: MetadataRoute.Sitemap = (
    professionals ?? []
  ).map((pro) => ({
    url: `${SITE_URL}/profile/${pro.slug}`,
    lastModified: pro.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const skillUrls: MetadataRoute.Sitemap = (skills ?? []).map((skill) => ({
    url: `${SITE_URL}/${skill.skill}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticUrls,
    ...jobUrls,
    ...professionalUrls,
    ...skillUrls,
  ];
}