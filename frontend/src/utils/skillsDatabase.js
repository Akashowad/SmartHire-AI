// Industrial-grade skills database for resume parsing and matching

export const TECH_SKILLS = new Set([
  // Frontend
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
  'HTML', 'CSS', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI',
  'Redux', 'Zustand', 'MobX', 'Recoil', 'Context API', 'React Query', 'TanStack Query',
  'Webpack', 'Vite', 'Parcel', 'Rollup', 'esbuild', 'Babel', 'ESLint', 'Prettier',
  'Jest', 'Testing Library', 'Cypress', 'Playwright', 'Selenium', 'Storybook',
  'GraphQL', 'Apollo', 'Relay', 'REST API', 'WebSocket', 'WebRTC', 'PWA', 'Service Workers',
  'Three.js', 'D3.js', 'Chart.js', 'Canvas', 'SVG', 'WebGL',
  // Backend
  'Node.js', 'Express', 'Fastify', 'Koa', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Ruby on Rails', 'Laravel', 'Symfony', 'ASP.NET', '.NET Core', 'Go', 'Golang', 'Rust',
  'Python', 'Java', 'Kotlin', 'Scala', 'C', 'C++', 'C#', 'PHP', 'Ruby', 'Perl', 'R',
  'GraphQL', 'gRPC', 'WebSocket', 'SOAP', 'RabbitMQ', 'Kafka', 'Redis', 'Memcached',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB', 'Cassandra',
  'Redis', 'Elasticsearch', 'Neo4j', 'Firebase', 'Supabase', 'Prisma', 'TypeORM', 'Sequelize',
  'Mongoose', 'SQL', 'NoSQL', 'ORM', 'Database Design', 'ETL',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Google Cloud', 'Firebase', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean',
  'Docker', 'Kubernetes', 'K8s', 'Terraform', 'Ansible', 'Pulumi', 'CloudFormation',
  'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI', 'ArgoCD',
  'Nginx', 'Apache', 'HAProxy', 'Load Balancing', 'CDN', 'CloudFront', 'CloudFlare',
  'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'ELK Stack', 'Logstash', 'Kibana',
  'Linux', 'Ubuntu', 'CentOS', 'Debian', 'Bash', 'Shell Scripting', 'PowerShell',
  // Mobile
  'React Native', 'Flutter', 'Swift', 'Objective-C', 'Kotlin', 'Java Android', 'Ionic', 'Cordova',
  'Xamarin', 'NativeScript', 'Mobile Development', 'iOS', 'Android',
  // Data & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas',
  'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter', 'OpenCV', 'NLTK', 'spaCy',
  'Hugging Face', 'LangChain', 'OpenAI', 'GPT', 'LLM', 'RAG', 'Vector DB', 'Pinecone', 'Weaviate',
  'Data Science', 'Data Analysis', 'Big Data', 'Hadoop', 'Spark', 'Flink', 'Airflow', 'dbt',
  // Security
  'OAuth', 'JWT', 'SSO', 'SAML', 'LDAP', 'Active Directory', ' penetration testing', 'OWASP',
  'Encryption', 'SSL/TLS', 'HTTPS', 'CORS', 'CSP', 'WAF', 'DDoS Protection',
  // Other
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Jira', 'Confluence', 'Trello', 'Notion',
  'Slack', 'Discord', 'Zoom', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Miro',
  'Agile', 'Scrum', 'Kanban', 'Lean', 'Waterfall', 'SDLC', 'TDD', 'BDD', 'DDD',
  'Microservices', 'Monolith', 'Serverless', 'Lambda', 'Event-Driven', 'CQRS', 'Event Sourcing',
  'System Design', 'Distributed Systems', 'High Availability', 'Scalability', 'Performance Optimization',
]);

export const SOFT_SKILLS = new Set([
  'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
  'Time Management', 'Project Management', 'Agile', 'Scrum', 'Mentoring', 'Collaboration',
  'Adaptability', 'Creativity', 'Emotional Intelligence', 'Negotiation', 'Presentation',
  'Stakeholder Management', 'Cross-functional', 'Remote Work', 'Documentation',
]);

export const EDUCATION_KEYWORDS = [
  'Bachelor', 'B.Tech', 'B.E', 'BS', 'BSc', 'BA', 'Master', 'M.Tech', 'MS', 'MSc', 'MBA',
  'PhD', 'Doctorate', 'Diploma', 'Certificate', 'Associate', 'High School', 'GED',
];

export function detectSkills(text) {
  const found = new Set();
  const lowerText = text.toLowerCase();

  TECH_SKILLS.forEach(skill => {
    // Check for exact match or common variations
    const variations = [skill.toLowerCase()];
    if (skill.includes('.')) variations.push(skill.toLowerCase().replace(/\./g, ''));
    if (skill.includes(' ')) variations.push(skill.toLowerCase().replace(/ /g, ''));
    if (skill.includes('/')) {
      variations.push(...skill.toLowerCase().split('/').map(s => s.trim()));
    }

    for (const v of variations) {
      // Use word boundary matching for short skills
      if (v.length <= 3) {
        const regex = new RegExp(`\\b${v}\\b`, 'i');
        if (regex.test(text)) { found.add(skill); break; }
      } else if (lowerText.includes(v)) {
        found.add(skill);
        break;
      }
    }
  });

  return Array.from(found);
}

export function detectEducation(text) {
  const education = [];
  const lines = text.split('\n');

  for (const line of lines) {
    for (const keyword of EDUCATION_KEYWORDS) {
      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        education.push(line.trim());
        break;
      }
    }
  }

  return [...new Set(education)];
}

export function detectExperienceYears(text) {
  // Look for patterns like "X years", "X+ years", "X-Y years"
  const patterns = [
    /(\d+)\+?\s*years?\s+of\s+experience/i,
    /(\d+)\+?\s*years?\s+experience/i,
    /(\d+)\+?\s*years?\s+in/i,
    /(\d+)[\s-]*(\d+)?\s*years?/i,
    /experience[:\s]+(\d+)\+?\s*years?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const years = parseInt(match[1]);
      if (years >= 0 && years <= 50) return years;
    }
  }

  // Count experience entries
  const expMatches = text.match(/(\d{4})\s*[-–]\s*(Present|Current|\d{4})/gi);
  if (expMatches && expMatches.length > 0) {
    let totalYears = 0;
    for (const match of expMatches) {
      const years = match.match(/(\d{4})\s*[-–]\s*(Present|Current|(\d{4}))/i);
      if (years) {
        const start = parseInt(years[1]);
        const end = years[2].toLowerCase() === 'present' || years[2].toLowerCase() === 'current'
          ? new Date().getFullYear()
          : parseInt(years[3] || years[2]);
        totalYears += Math.max(0, end - start);
      }
    }
    return Math.round(totalYears);
  }

  return 0;
}
