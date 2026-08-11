export function normalizeAdzunaJob(job) {
  return {
    externalId: String(job.id),

    source: "adzuna",

    title: job.title || "Untitled Job",

    company:
      job.company?.display_name || "Unknown Company",

    location:
      job.location?.display_name || "Unknown Location",

    description: job.description || "",

    url: job.redirect_url || "",

    category: job.category?.label || null,

    contractType: job.contract_type || null,

    salaryMin: job.salary_min ?? null,

    salaryMax: job.salary_max ?? null,

    salaryPredicted:
      job.salary_is_predicted === "1",

    postedAt: job.created
      ? new Date(job.created)
      : null,

    adref: job.adref || null,
  };
}