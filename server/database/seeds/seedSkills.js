// Run once: node database/seeds/seedSkills.js
//
// Populates `skills` with a realistic taxonomy (tech stacks,
// languages, tools, common job titles). pg_trgm is what gives
// typo/partial matching — this list stays small and real.

import "dotenv/config";
import pool from "../../src/config/db.js";

const SKILLS = [
  ["JavaScript", "Programming Language"], ["TypeScript", "Programming Language"],
  ["Python", "Programming Language"], ["Java", "Programming Language"],
  ["C++", "Programming Language"], ["C#", "Programming Language"],
  ["PHP", "Programming Language"], ["Ruby", "Programming Language"],
  ["Go", "Programming Language"], ["Rust", "Programming Language"],
  ["Swift", "Programming Language"], ["Kotlin", "Programming Language"],
  ["Dart", "Programming Language"], ["Scala", "Programming Language"],

  ["React", "Frontend Framework"], ["React Developer", "Job Title"],
  ["React Native", "Mobile Framework"], ["Redux", "State Management"],
  ["Vue.js", "Frontend Framework"], ["Angular", "Frontend Framework"],
  ["Next.js", "Frontend Framework"], ["Nuxt.js", "Frontend Framework"],
  ["Svelte", "Frontend Framework"], ["Tailwind CSS", "CSS Framework"],
  ["Bootstrap", "CSS Framework"], ["HTML5", "Markup Language"],
  ["CSS3", "Styling Language"], ["jQuery", "JavaScript Library"],
  ["REST API", "API Technology"], ["REST API Design", "Backend Skill"],

  ["Node.js", "Backend Runtime"], ["Express.js", "Backend Framework"],
  ["NestJS", "Backend Framework"], ["Django", "Backend Framework"],
  ["Flask", "Backend Framework"], ["FastAPI", "Backend Framework"],
  ["Spring Boot", "Backend Framework"], ["Laravel", "Backend Framework"],
  ["Ruby on Rails", "Backend Framework"], ["ASP.NET", "Backend Framework"],
  ["GraphQL", "API Technology"], ["Python Developer", "Job Title"],
  ["Java Developer", "Job Title"],

  ["MongoDB", "Database"], ["PostgreSQL", "Database"], ["MySQL", "Database"],
  ["Redis", "Database"], ["SQLite", "Database"], ["Firebase", "Database / Backend"],
  ["DynamoDB", "Database"], ["Oracle Database", "Database"],

  ["AWS", "Cloud Platform"], ["Microsoft Azure", "Cloud Platform"],
  ["Google Cloud Platform", "Cloud Platform"], ["Docker", "DevOps Tool"],
  ["Kubernetes", "DevOps Tool"], ["CI/CD", "DevOps Practice"],
  ["Jenkins", "DevOps Tool"], ["Terraform", "DevOps Tool"],
  ["Linux Administration", "System Skill"],

  ["iOS Development", "Mobile Development"], ["Android Development", "Mobile Development"],
  ["Flutter", "Mobile Framework"],

  ["Machine Learning", "AI / Data Science"], ["Machine Learning Engineer", "Job Title"],
  ["Deep Learning", "AI / Data Science"], ["Data Science", "AI / Data Science"],
  ["Data Analysis", "Analytics"], ["Data Engineering", "Analytics"],
  ["Artificial Intelligence", "AI / Data Science"],
  ["Natural Language Processing", "AI / Data Science"], ["Computer Vision", "AI / Data Science"],
  ["TensorFlow", "ML Framework"], ["PyTorch", "ML Framework"],
  ["Pandas", "Data Library"], ["NumPy", "Data Library"],
  ["Power BI", "Analytics Tool"], ["Excel", "Analytics Tool"],

  ["UI/UX Design", "Design"], ["Graphic Design", "Design"], ["Figma", "Design Tool"],
  ["Adobe Photoshop", "Design Tool"], ["Adobe Illustrator", "Design Tool"],
  ["Product Design", "Design"],

  ["Project Management", "Management"], ["Product Management", "Management"],
  ["Scrum Master", "Agile Role"], ["Agile Methodology", "Methodology"],
  ["Business Analyst", "Business"], ["Digital Marketing", "Marketing"],
  ["SEO", "Marketing"], ["Content Writing", "Writing"], ["Copywriting", "Writing"],
  ["Sales Executive", "Sales"], ["Customer Support", "Support"],
  ["Human Resources", "HR"], ["Accounting", "Finance"], ["Financial Analyst", "Finance"],
  ["Recruiter", "HR"], ["Research Analyst", "Analytics"],
  ["Retail Sales Associate", "Sales"], ["Registered Nurse", "Healthcare"],
  ["Real Estate Agent", "Sales"], ["Relationship Manager", "Business"],

  ["Software Engineer", "Job Title"], ["Frontend Developer", "Job Title"],
  ["Backend Developer", "Job Title"], ["Full Stack Developer", "Job Title"],
  ["MERN Stack Developer", "Job Title"], ["DevOps Engineer", "Job Title"],
  ["QA Engineer", "Job Title"], ["Data Scientist", "Job Title"],
  ["Data Analyst", "Job Title"], ["Mobile App Developer", "Job Title"],
  ["UI/UX Designer", "Job Title"], ["Product Manager", "Job Title"],
  ["Project Manager", "Job Title"], ["Technical Writer", "Job Title"],
  ["System Administrator", "Job Title"], ["Network Engineer", "Job Title"],
  ["Cybersecurity Analyst", "Job Title"], ["Cloud Architect", "Job Title"],
  ["Database Administrator", "Job Title"], ["Site Reliability Engineer", "Job Title"],
  ["WordPress Developer", "Job Title"], ["Shopify Developer", "Job Title"],
];

const seedSkills = async () => {
  console.log(`Seeding ${SKILLS.length} skills...`);

  for (const [name, category] of SKILLS) {
    await pool.query(
      `INSERT INTO skills (name, category) VALUES ($1, $2)
       ON CONFLICT (name) DO NOTHING;`,
      [name, category]
    );
  }

  console.log("Done.");
  await pool.end();
};

seedSkills().catch((error) => {
  console.error("Skill seeding failed:", error);
  process.exit(1);
});