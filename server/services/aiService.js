const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const parseResume = async (resumeText) => {
  const prompt = `You are a resume parsing assistant. Extract structured data from the resume text below.
Return ONLY a valid JSON object with this exact shape, no markdown formatting, no backticks, no extra text:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "skills": ["string"],
  "experience": [{ "title": "string", "company": "string", "duration": "string", "description": "string" }],
  "education": [{ "degree": "string", "institution": "string", "year": "string" }],
  "certifications": ["string"],
  "summary": "string"
}

Resume text:
${resumeText}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3
  });

  const text = completion.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const matchResumeToJob = async (parsedResume, jobDescription) => {
  const prompt = `You are a job matching assistant. Compare this resume against the job description and score the match.
Return ONLY a valid JSON object with this exact shape, no markdown formatting, no backticks, no extra text:
{
  "matchScore": number (0-100),
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "experienceGap": "string describing any experience level gap",
  "atsScore": number (0-100, how well resume would pass ATS systems for this job),
  "suggestions": ["string array of 3-5 specific actionable improvements"],
  "overallFeedback": "string, 2-3 sentences summarizing fit"
}

Resume data:
${JSON.stringify(parsedResume)}

Job Description:
${jobDescription}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3
  });

  const text = completion.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { parseResume, matchResumeToJob };