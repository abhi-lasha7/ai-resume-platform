const calculateResumeStrength = (parsedResume) => {
  let score = 0;

  // Completeness (40 points max)
  const hasName = parsedResume.name && parsedResume.name.trim().length > 0;
  const hasEmail = parsedResume.email && parsedResume.email.trim().length > 0;
  const hasPhone = parsedResume.phone && parsedResume.phone.trim().length > 0;
  const hasSkills = parsedResume.skills && parsedResume.skills.length > 3;
  const hasExperience = parsedResume.experience && parsedResume.experience.length > 0;
  const hasEducation = parsedResume.education && parsedResume.education.length > 0;
  const hasSummary = parsedResume.summary && parsedResume.summary.trim().length > 50;

  const completenessScore = [hasName, hasEmail, hasPhone, hasSkills, hasExperience, hasEducation, hasSummary].filter(Boolean).length * 6;
  score += Math.min(completenessScore, 40);

  // Skill quality (20 points max)
  const skillCount = parsedResume.skills ? parsedResume.skills.length : 0;
  const skillScore = Math.min(skillCount * 2, 20);
  score += skillScore;

  // Experience depth (20 points max)
  const expCount = parsedResume.experience ? parsedResume.experience.length : 0;
  const expTotalYears = parsedResume.experience
    ? parsedResume.experience.reduce((sum, exp) => {
        const years = parseInt(exp.duration) || 1;
        return sum + years;
      }, 0)
    : 0;
  const expScore = Math.min((expCount * 5) + Math.min(expTotalYears * 2, 10), 20);
  score += expScore;

  // Education & certifications (10 points max)
  const eduCount = parsedResume.education ? parsedResume.education.length : 0;
  const certCount = parsedResume.certifications ? parsedResume.certifications.length : 0;
  const eduScore = Math.min((eduCount * 4) + (certCount * 2), 10);
  score += eduScore;

  // Content length bonus (10 points max)
  const totalContent = (parsedResume.summary || '').length + 
    (parsedResume.experience || []).reduce((sum, exp) => sum + (exp.description || '').length, 0);
  const lengthScore = Math.min(Math.floor(totalContent / 500), 10);
  score += lengthScore;

  return Math.min(Math.floor(score), 100);
};

module.exports = { calculateResumeStrength };