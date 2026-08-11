import { searchAdzunaJobs } from "../services/jobs/adzunaService.js";

export const searchJobs = async (req, res) => {
  try {
    const {
      query,
      location,
      page = 1,
    } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const currentPage = Math.max(
      1,
      Number(page) || 1
    );

    const data = await searchAdzunaJobs({
      query,
      location,
      page: currentPage,
    });

    return res.status(200).json({
      source: "adzuna",
      count: data.count || 0,
      jobs: data.results || [],
      page: currentPage,

      // Adzuna doesn't necessarily give us a simple
      // total-pages field, so the frontend can use
      // whether the returned page has jobs.
      hasResults: (data.results || []).length > 0,
    });
  } catch (error) {
    console.error(
      "Job discovery error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to discover jobs",
    });
  }
};