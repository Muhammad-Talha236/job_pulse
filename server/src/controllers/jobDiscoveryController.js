import { discoverJobs } from "../services/jobs/jobDiscoveryService.js";

export const searchJobs = async (req, res) => {
  try {
    const {
      query,
      location,
      page = 1,
    } = req.query;

    if (!query?.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const data = await discoverJobs({
      query: query.trim(),
      location: location?.trim(),
      page: Number(page),
    });

    return res.status(200).json(data);
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