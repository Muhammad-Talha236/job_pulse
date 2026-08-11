export function normalizeMuseJob(job) {
  return {
    externalId: String(job.id),

    source: "muse",

    title: job.name || "Untitled Job",

    company:
      job.company?.name ||
      job.company?.short_name ||
      "Unknown Company",

    location:
      job.locations
        ?.map((location) => location?.name)
        .filter(Boolean)
        .join(", ") ||
      "Unknown Location",

    description:
      job.contents || "",

    url:
      job.refs?.landing_page || "",

    category:
      job.categories
        ?.map((category) => category?.name)
        .filter(Boolean)
        .join(", ") || null,

    contractType:
      job.type || null,

    salaryMin: null,

    salaryMax: null,

    salaryPredicted: false,

    postedAt: job.publication_date
      ? new Date(job.publication_date)
      : null,

    adref: null,
  };
}