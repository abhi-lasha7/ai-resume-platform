const { PrismaClient } = require('@prisma/client');
const { extractText } = require('../services/fileParser');
const { parseResume, matchResumeToJob } = require('../services/aiService');

const prisma = new PrismaClient();

const uploadAndAnalyze = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const { jobDescription } = req.body;
  if (!jobDescription || jobDescription.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'Please provide a job description (at least 20 characters)' });
  }

  let rawText;
  try {
    rawText = await extractText(req.file.buffer, req.file.mimetype);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (!rawText || rawText.trim().length < 50) {
    return res.status(400).json({ success: false, message: 'Could not extract text from this file. It may be a scanned image or empty.' });
  }

  let parsedData, matchResult;
  try {
    parsedData = await parseResume(rawText);
    matchResult = await matchResumeToJob(parsedData, jobDescription);
  } catch (err) {
    console.error('AI processing error:', err);
    return res.status(500).json({ success: false, message: 'AI analysis failed. Please try again.' });
  }

  const resume = await prisma.resume.create({
    data: {
      userId: req.user.id,
      fileName: req.file.originalname,
      fileUrl: 'local-storage',
      parsedData: parsedData,
      rawText: rawText.substring(0, 5000)
    }
  });

  const analysis = await prisma.analysis.create({
    data: {
      userId: req.user.id,
      resumeId: resume.id,
      matchScore: matchResult.matchScore,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      suggestions: matchResult.suggestions,
      atsScore: matchResult.atsScore,
      experienceGap: matchResult.experienceGap,
      overallFeedback: matchResult.overallFeedback
    }
  });

  res.status(201).json({
    success: true,
    message: 'Analysis complete',
    data: {
      resume: { id: resume.id, fileName: resume.fileName, parsedData },
      analysis
    }
  });
};

const getMyAnalyses = async (req, res) => {
  const analyses = await prisma.analysis.findMany({
    where: { userId: req.user.id },
    include: { resume: { select: { fileName: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, analyses });
};

module.exports = { uploadAndAnalyze, getMyAnalyses };