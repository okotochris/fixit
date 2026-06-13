import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const jobs = await fetch(
      "https://fixit-production-75f3.up.railway.app/api/jobs/sitemap"
    ).then((res) => res.json());

    const professionals = await fetch(
      "https://fixit-production-75f3.up.railway.app/api/professionals/sitemap"
    ).then((res) => res.json());

    const skills = await fetch("https://fixit-production-75f3.up.railway.app/api/workers/skills/sitemap")
    .then(result=>result.json())
 
    return [
      {
        url: "https://servicehub.space",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: "https://servicehub.space/service",
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "https://servicehub.space/available_jobs",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },

      ...jobs.map((job: {slug:string, updatedAt:string}) => ({
        url: `https://servicehub.space/job/${job.slug}`,
        lastModified: job.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),

      ...professionals.map((pro: {slug:string, updatedAt:string}) => ({
        url: `https://servicehub.space/profile/${pro.slug}`,
        lastModified: pro.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...skills.map((skill:{skill:string})=>({
         url: `https://servicehub.space/${skill.skill}`,
         changeFrequency: "weekly" as const,
         priority: 0.7,
      }))
    ];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);

    return [
      {
        url: "https://servicehub.space",
        lastModified: new Date(),
        priority: 1,
      },
    ];
  }
}