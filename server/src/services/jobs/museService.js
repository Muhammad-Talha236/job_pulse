import axios from "axios";
import pool from "../../config/db.js";
const MUSE_BASE_URL =
  "https://www.themuse.com/api/public/jobs";

const MAX_RETRIES = 3;

export const searchMuseJobs = async ({ query, location, page = 0 }) => {
  // Query ke mutabiq dynamic broad category nikalain
  const mappedCategory = await getMappedMuseCategory(query);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Muse request attempt ${attempt}/${MAX_RETRIES} with category: "${mappedCategory}"`);
      
      const response = await axios.get(MUSE_BASE_URL, {
        params: {
          page,
          category: mappedCategory, // Yeh ab dynamically broad category pass karega
          ...(location ? { location } : {}),
        },
        headers: {
          Accept: "application/json",
        },
        timeout: 30000,
      });
      
      console.log(`Muse request successful on attempt ${attempt}`);
      return response.data;
    } catch (error) {
      console.error(
        `Muse attempt ${attempt} failed:`,
        error.code || error.message
      );

      if (attempt === MAX_RETRIES) {
        console.error(
          "Muse API failed after all retry attempts:",
          error.response?.data ||
            error.message
        );

        throw new Error(
          "Unable to fetch jobs from Muse"
        );
      }

      const delay = attempt * 2000;

      console.log(
        `Retrying Muse in ${
          delay / 1000
        } seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
};

// NOTE:
// The Muse's public API does NOT support a generic
// free-text "what" search parameter like Adzuna does.
// It also does NOT accept arbitrary keywords through the
// "category" param — that param only accepts a small fixed
// list of predefined categories (e.g. "Software Engineering",
// "Data Science"). Sending free text like "MERN Developer"
// or "React" there returns irrelevant/empty results, which
// is why Muse jobs were missing before.
//
// Fix: we no longer send "category" at all. We only pass
// "location" (when provided) and let the COMBINED
// (Adzuna + Muse + Jooble) results go through
// filterRelevantJobs() in jobDiscoveryService.js, which
// already matches the query against title/description/
// company/location text. This lets Muse contribute broader
// listings that still get correctly filtered by relevance.

const MUSE_BROAD_CATEGORY_MAP = {
  // Software / Engineering
  "Programming Language": "Software Engineering",
  "Frontend Framework": "Software Engineering",
  "Backend Framework": "Software Engineering",
  "Backend Runtime": "Software Engineering",
  "Mobile Framework": "Software Engineering",
  "Database": "Software Engineering",
  "API Technology": "Software Engineering",
  "Markup Language": "Software Engineering",
  "Styling Language": "Software Engineering",
  "JavaScript Library": "Software Engineering",
  "Backend Skill": "Software Engineering",
  "Job Title": "Software Engineering",
  
  // DevOps & Cloud
  "Cloud Platform": "Software Engineering",
  "DevOps Tool": "Software Engineering",
  "DevOps Practice": "Software Engineering",
  "System Skill": "Software Engineering",
  
  // Data Science & AI
  "AI / Data Science": "Data Science",
  "Analytics": "Data Science",
  "Data Library": "Data Science",
  
  // Design & Creative
  "Design": "Design",
  "Design Tool": "Design",
  
  // Management & Business
  "Management": "Product Management",
  "Agile Role": "Product Management",
  "Methodology": "Product Management",
  "Business": "Business and Strategy",
  
  // Marketing & Writing
  "Marketing": "Marketing",
  "Writing": "Writing",
  "Sales": "Sales",
  "Support": "Customer Success",
  "HR": "Human Resources",
  "Finance": "Finance",
  "Healthcare": "Healthcare"
};

export const getMappedMuseCategory = async (query) => {
  if (!query) return "Software Engineering";
  
  try {
    // Database se skill ki category fetch karein
    const result = await pool.query(
      `SELECT category FROM skills WHERE LOWER(name) = LOWER($1) LIMIT 1;`,
      [query.trim()]
    );
    
    const dbCategory = result.rows[0]?.category;
    
    // Agar database category map mein mojood hai toh woh return karein, warna default
    if (dbCategory && MUSE_BROAD_CATEGORY_MAP[dbCategory]) {
      return MUSE_BROAD_CATEGORY_MAP[dbCategory];
    }
    
    return "Software Engineering";
  } catch (error) {
    console.error("Error mapping Muse category:", error.message);
    return "Software Engineering";
  }
};