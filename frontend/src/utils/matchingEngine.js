import { detectSkills } from './skillsDatabase';

// ─── Industrial Matching Engine ───
// Implements TF-IDF + keyword overlap + semantic skill matching

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function computeTF(tokens) {
  const tf = {};
  const total = tokens.length;
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1 / total;
  }
  return tf;
}

function computeIDF(documents) {
  const idf = {};
  const N = documents.length;

  for (const doc of documents) {
    const seen = new Set(tokenize(doc));
    for (const token of seen) {
      idf[token] = (idf[token] || 0) + 1;
    }
  }

  for (const token in idf) {
    idf[token] = Math.log(N / (idf[token] || 1)) + 1;
  }

  return idf;
}

function computeTFIDF(tf, idf) {
  const tfidf = {};
  for (const token in tf) {
    tfidf[token] = (tf[token] || 0) * (idf[token] || 0);
  }
  return tfidf;
}

function cosineSimilarity(vecA, vecB) {
  const allTokens = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, magA = 0, magB = 0;

  for (const token of allTokens) {
    const a = vecA[token] || 0;
    const b = vecB[token] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function skillOverlapScore(resumeSkills, jobText) {
  if (!resumeSkills || resumeSkills.length === 0) return 0;

  const jobTokens = new Set(tokenize(jobText));
  let matched = 0;

  for (const skill of resumeSkills) {
    const skillTokens = tokenize(skill);
    // A skill matches if any of its tokens appear in the job
    const hasMatch = skillTokens.some(t => jobTokens.has(t));
    if (hasMatch) matched++;
  }

  return matched / resumeSkills.length;
}

function experienceScore(resumeYears, jobText) {
  const jobTokens = tokenize(jobText);
  const reqPatterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
    /minimum\s+(\d+)\s*years?/i,
    /at\s+least\s+(\d+)\s*years?/i,
    /(\d+)[\s-]*(\d+)?\s*years?\s+(?:of\s+)?(?:relevant\s+)?experience/i,
  ];

  let requiredYears = 0;
  for (const pattern of reqPatterns) {
    const match = jobText.match(pattern);
    if (match) {
      requiredYears = parseInt(match[1]);
      break;
    }
  }

  if (requiredYears === 0) return 0.5; // Neutral if not specified

  if (resumeYears >= requiredYears) {
    // Bonus for exceeding, capped at 1.0
    return Math.min(1.0, 0.7 + (resumeYears - requiredYears) * 0.05);
  } else {
    // Penalty for missing
    const gap = requiredYears - resumeYears;
    return Math.max(0, 0.7 - gap * 0.15);
  }
}

export function calculateMatchScore(resumeData, job) {
  if (!resumeData || !job) return { match_percentage: 0, breakdown: {} };

  const resumeText = `${resumeData.text_content || ''} ${(resumeData.extracted_skills || []).join(' ')}`;
  const jobText = `${job.title || ''} ${job.description || ''} ${job.excerpt || ''} ${(job.tags || []).join(' ')}`;

  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobText);

  // TF-IDF similarity
  const documents = [resumeText, jobText];
  const idf = computeIDF(documents);
  const resumeTF = computeTF(resumeTokens);
  const jobTF = computeTF(jobTokens);
  const resumeTFIDF = computeTFIDF(resumeTF, idf);
  const jobTFIDF = computeTFIDF(jobTF, idf);
  const tfidfScore = cosineSimilarity(resumeTFIDF, jobTFIDF);

  // Skill overlap
  const resumeSkills = resumeData.extracted_skills || detectSkills(resumeText);
  const skillScore = skillOverlapScore(resumeSkills, jobText);

  // Experience match
  const expScore = experienceScore(resumeData.experience_years || 0, jobText);

  // Title relevance bonus
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
  const jobTitleLower = (job.title || '').toLowerCase();
  const titleBonus = resumeSkillsLower.some(s => jobTitleLower.includes(s)) ? 0.1 : 0;

  // Weighted combination
  const weights = {
    tfidf: 0.35,
    skills: 0.40,
    experience: 0.20,
    title: 0.05,
  };

  const rawScore =
    tfidfScore * weights.tfidf +
    skillScore * weights.skills +
    expScore * weights.experience +
    titleBonus * weights.title;

  // Normalize to 0-100
  const matchPercentage = Math.round(Math.min(100, Math.max(0, rawScore * 100)));

  return {
    match_percentage: matchPercentage,
    breakdown: {
      tfidf: Math.round(tfidfScore * 100),
      skills: Math.round(skillScore * 100),
      experience: Math.round(expScore * 100),
      titleBonus: Math.round(titleBonus * 100),
    },
    matchedSkills: resumeSkills.filter(s =>
      tokenize(jobText).some(t => s.toLowerCase().includes(t) || t.includes(s.toLowerCase()))
    ),
    missingSkills: resumeSkills.filter(s =>
      !tokenize(jobText).some(t => s.toLowerCase().includes(t) || t.includes(s.toLowerCase()))
    ),
  };
}
