// =========================================================
// JOB PULSE - SEARCH SUGGESTIONS
// =========================================================

const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "React.js",
  "React Developer",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Node.js Developer",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQL",
  "Python",
  "Python Developer",
  "Django",
  "FastAPI",
  "Java",
  "Java Developer",
  "Spring Boot",
  "C++",
  "C#",
  ".NET",
  "PHP",
  "Laravel",
  "Ruby",
  "Ruby on Rails",
  "Go",
  "Rust",
  "Flutter",
  "React Native",
  "Android",
  "iOS",
  "Kotlin",
  "Swift",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Git",
  "GitHub",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "DevOps",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Data Analyst",
  "TensorFlow",
  "PyTorch",
  "Cybersecurity",
  "UI/UX Design",
  "Figma",
  "WordPress",
];

const JOB_ROLES = [
  "Software Engineer",
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Full Stack Engineer",
  "Web Developer",
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Mobile Developer",
  "React Native Developer",
  "Flutter Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cybersecurity Engineer",
  "QA Engineer",
  "QA Tester",
  "Automation Tester",
  "UI/UX Designer",
  "Product Designer",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "Database Administrator",
  "System Administrator",
];

const LOCATIONS = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Abbottabad",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Dubai",
  "Abu Dhabi",
  "Remote",
];

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getSuggestions = ({
  query = "",
  type = "skill",
}) => {
  const search = normalize(query);

  if (!search) {
    return [];
  }

  let source = [];

  if (type === "location") {
    source = LOCATIONS;
  } else if (type === "role") {
    source = JOB_ROLES;
  } else {
    source = [
      ...SKILLS,
      ...JOB_ROLES,
    ];
  }

  return source
    .filter((item) =>
      normalize(item).includes(search)
    )
    .sort((a, b) => {
      const aValue = normalize(a);
      const bValue = normalize(b);

      // Exact beginning match first
      const aStarts = aValue.startsWith(search);
      const bStarts = bValue.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aValue.localeCompare(bValue);
    })
    .slice(0, 8);
};

const isValidSearchQuery = (query) => {
  const search = normalize(query);

  if (!search) {
    return false;
  }

  const allTerms = [
    ...SKILLS,
    ...JOB_ROLES,
  ];

  return allTerms.some((item) => {
    const value = normalize(item);

    return (
      value === search ||
      value.includes(search) ||
      search.includes(value)
    );
  });
};

export {
  getSuggestions,
  isValidSearchQuery,
};