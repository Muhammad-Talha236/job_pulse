export const cleanDescription = (
  description
) => {
  if (!description) return "";

  const value = String(description);

  if (
    !value.includes("<") &&
    !value.includes(">")
  ) {
    return value.trim();
  }

  try {
    const parser = new DOMParser();

    const document =
      parser.parseFromString(
        value,
        "text/html"
      );

    return (
      document.body.textContent
        ?.replace(/\s+/g, " ")
        .trim() || ""
    );
  } catch {
    return value
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
};

export const normalizeJob = (job) => {
  if (!job) return job;

  let salaryMin = job.salaryMin;
  let salaryMax = job.salaryMax;

  // Saved DB jobs can store:
  // "1000 - 2000"

  if (
    salaryMin == null &&
    salaryMax == null &&
    job.salary
  ) {
    const parts = String(
      job.salary
    )
      .split("-")
      .map((value) =>
        value.trim()
      );

    if (parts.length === 2) {
      const min = Number(
        parts[0].replace(
          /,/g,
          ""
        )
      );

      const max = Number(
        parts[1].replace(
          /,/g,
          ""
        )
      );

      salaryMin =
        Number.isNaN(min)
          ? null
          : min;

      salaryMax =
        Number.isNaN(max)
          ? null
          : max;
    }
  }

  return {
    ...job,

    description:
      cleanDescription(
        job.description
      ),

    contractType:
      job.contractType ||
      job.job_type ||
      null,

    salaryMin:
      salaryMin == null ||
      Number.isNaN(
        Number(salaryMin)
      )
        ? null
        : Number(salaryMin),

    salaryMax:
      salaryMax == null ||
      Number.isNaN(
        Number(salaryMax)
      )
        ? null
        : Number(salaryMax),

    postedAt:
      job.postedAt ||
      job.created_at ||
      null,
  };
};

export const getJobKey = (job) =>
  job?.id ||
  `${job?.source || "job"}-${
    job?.externalId ||
    "external"
  }-${job?.title || "untitled"}`;

export const isSameJob = (
  firstJob,
  secondJob
) => {
  if (
    !firstJob ||
    !secondJob
  ) {
    return false;
  }

  const sameUrl =
    firstJob.url &&
    secondJob.url &&
    firstJob.url ===
      secondJob.url;

  const sameExternalId =
    firstJob.externalId &&
    secondJob.externalId &&
    firstJob.externalId ===
      secondJob.externalId &&
    firstJob.source ===
      secondJob.source;

  const sameTitleCompany =
    firstJob.title ===
      secondJob.title &&
    firstJob.company ===
      secondJob.company;

  return Boolean(
    sameUrl ||
      sameExternalId ||
      sameTitleCompany
  );
};

export const formatJobDate = (
  date
) => {
  if (!date) return null;

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return null;
  }

  return parsedDate.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

export const getSourceLabel = (
  source
) => {
  if (!source) {
    return "Job Source";
  }

  if (source === "adzuna") {
    return "Adzuna";
  }

  if (source === "muse") {
    return "The Muse";
  }

  return source;
};