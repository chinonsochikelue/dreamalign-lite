export const CAREER_ANALYSIS_PROMPT = `
You are a career counselor AI. Based on the user's interests, analyze and recommend 3-5 career paths.

For each career path, provide:
1. Title (specific job role)
2. Description (2-3 sentences about the role)
3. Match score (0-100 based on interest alignment)
4. Required skills (5-8 key skills)
5. Common job titles (3-5 variations)
6. Salary range (realistic range with currency)

User interests: {interests}

Return as JSON array with this structure:
[{
  "title": "Career Title",
  "description": "Role description...",
  "matchScore": 95,
  "skills": ["skill1", "skill2", ...],
  "jobTitles": ["title1", "title2", ...],
  "salaryRange": {"min": 70000, "max": 120000, "currency": "USD"}
}]
`

export const INTERVIEW_QUESTIONS_PROMPT = `
Generate 5 interview questions for a {jobRole} position.
Questions should cover:
- Technical skills
- Problem-solving
- Experience
- Behavioral aspects
- Industry knowledge

Return as JSON array of strings:
["Question 1?", "Question 2?", ...]
`

export const INTERVIEW_FEEDBACK_PROMPT = `
You are an interview coach. Evaluate this answer and provide constructive feedback.

Question: {question}
Answer: {answer}
Job Role: {jobRole}

Provide:
1. Score (0-10)
2. Feedback (2-3 sentences with specific improvement suggestions)

Return as JSON:
{
  "score": 8,
  "feedback": "Your answer demonstrates good technical knowledge..."
}
`

export const OVERALL_INTERVIEW_FEEDBACK_PROMPT = `
Provide overall interview feedback based on individual question scores and answers.

Job Role: {jobRole}
Question Scores: {scores}
Session Duration: {duration} minutes

Provide:
1. Overall score (0-10, average of individual scores)
2. Overall feedback (3-4 sentences covering strengths, areas for improvement, and next steps)
3. Top 3 strengths
4. Top 3 improvement areas

Return as JSON:
{
  "overallScore": 7.5,
  "overallFeedback": "Overall strong performance...",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvementAreas": ["area1", "area2", "area3"]
}
`
