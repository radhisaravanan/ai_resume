function classifyResumeText(resumeText) {
  const normalized = (resumeText || '').toLowerCase();

  if (!resumeText || !normalized.trim()) {
    return {
      isValidResume: false,
      errorMessage: 'This document does not qualify as a valid professional resume. Please upload a properly formatted CV.',
    };
  }

  const hasTimeline = /\b(january|february|march|april|may|june|july|august|september|october|november|december|20\d{2}|19\d{2})\b/i.test(resumeText);
  const hasSummary = /\b(summary|professional summary|about me|overview)\b/i.test(resumeText);
  const hasSkills = /\b(skills|technologies|technical skills|core competencies|tools)\b/i.test(resumeText);
  const hasExperience = /\b(experience|employment|work history|professional history|projects|education)\b/i.test(resumeText);
  const hasRoleSignal = /\b(software|developer|engineer|analyst|manager|intern|consultant|designer|architect)\b/i.test(resumeText);

  const signalCount = [hasTimeline, hasSummary, hasSkills, hasExperience, hasRoleSignal].filter(Boolean).length;

  if (signalCount < 3) {
    return {
      isValidResume: false,
      errorMessage: 'This document does not qualify as a valid professional resume. Please upload a properly formatted CV.',
    };
  }

  return {
    isValidResume: true,
    errorMessage: null,
  };
}

function extractResumeDetails(resumeText) {
  const skillPatterns = [
    { label: 'React', pattern: /\breact\b/i },
    { label: 'TypeScript', pattern: /\btypescript\b/i },
    { label: 'Node.js', pattern: /\bnode\.js\b|\bnodejs\b|\bnode\b/i },
    { label: 'Express', pattern: /\bexpress\b/i },
    { label: 'PostgreSQL', pattern: /\bpostgresql\b|\bpostgres\b/i },
    { label: 'Docker', pattern: /\bdocker\b/i },
    { label: 'Redux', pattern: /\bredux\b/i },
    { label: 'Python', pattern: /\bpython\b/i },
    { label: 'SQL', pattern: /\bsql\b/i },
    { label: 'Java', pattern: /\bjava\b/i },
  ];

  return skillPatterns.filter(({ pattern }) => pattern.test(resumeText)).map(({ label }) => label);
}

function buildResumeAnalysisResponse(resumeText) {
  const classification = classifyResumeText(resumeText);

  if (!classification.isValidResume) {
    return {
      isValidResume: false,
      errorMessage: classification.errorMessage,
    };
  }

  const extractedDetails = extractResumeDetails(resumeText);
  const projects = (resumeText.match(/([A-Z][A-Za-z0-9 .,'-]+):/g) || [])
    .map((value) => value.replace(/:$/, '').trim())
    .filter(Boolean);

  const buildQuestion = (index, target, question) => ({
    questionNumber: index,
    targetSkillOrProject: target,
    questionText: question,
  });

  const questions = [
    buildQuestion(
      1,
      extractedDetails[0] || projects[0] || 'your main project',
      `Walk me through how you designed and implemented ${extractedDetails[0] || projects[0] || 'your main project'} in the resume.`,
    ),
    buildQuestion(
      2,
      extractedDetails[1] || projects[1] || 'your core architecture',
      `Describe the architecture decisions you made when working with ${extractedDetails[1] || projects[1] || 'the core system'} on your resume.`,
    ),
    buildQuestion(
      3,
      extractedDetails[2] || projects[2] || 'your backend delivery',
      `Explain how you handled performance, reliability, or scaling concerns in ${extractedDetails[2] || projects[2] || 'your featured project'}.`,
    ),
    buildQuestion(
      4,
      extractedDetails[3] || 'your data layer',
      `Tell me about the data flow and integration choices you used with ${extractedDetails[3] || 'your data layer'} in your resume.`,
    ),
    buildQuestion(
      5,
      extractedDetails[4] || 'deployment and delivery',
      `How did you approach testing, deployment, or operational support for ${extractedDetails[4] || 'the solution'} described in your resume?`,
    ),
  ];

  return {
    isValidResume: true,
    errorMessage: null,
    generatedInterviewQuestions: questions,
  };
}

module.exports = {
  classifyResumeText,
  buildResumeAnalysisResponse,
};
