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
Generate {numQuestions} interview questions for a {jobRole} position.
Interview type: {interviewType}

Questions should cover:
- Technical skills (if technical interview)
- Problem-solving abilities
- Relevant experience
- Behavioral aspects
- Industry knowledge
- Real-world challenges

Make the questions thoughtful, relevant to the specific role and interview type.
Focus on practical scenarios and real-world applications.

Return as JSON array of strings:
["Question 1?", "Question 2?", ...]
`

export const INTERVIEW_FEEDBACK_PROMPT = `
You are an experienced interview coach with expertise in {jobRole} positions.
Evaluate this interview answer and provide constructive, actionable feedback.

Question: {question}
Answer: {answer}
Job Role: {jobRole}

Provide:
1. Score (0-10) - Be fair but thorough in your assessment
2. Feedback (2-3 sentences with specific improvement suggestions)

Consider:
- Relevance to the question and role
- Clarity and structure of the response
- Use of specific examples or experiences
- Technical accuracy (if applicable)
- Communication skills demonstrated

Return as JSON:
{
  "score": 8,
  "feedback": "Your answer demonstrates good technical knowledge..."
}
`

export const OVERALL_INTERVIEW_FEEDBACK_PROMPT = `
Provide comprehensive overall interview feedback based on individual question scores and answers.

Job Role: {jobRole}
Interview Type: {interviewType}
Question Scores: {scores}
Session Duration: {duration} minutes
Number of Questions: {numQuestions}

Provide:
1. Overall score (0-10, weighted average of individual scores)
2. Overall feedback (3-4 sentences covering performance, strengths, areas for improvement, and next steps)
3. Top 3 strengths demonstrated during the interview
4. Top 3 improvement areas with specific actionable advice

Return as JSON:
{
  "overallScore": 7.5,
  "overallFeedback": "Overall strong performance with good technical knowledge and communication skills. Your responses showed depth of experience, though some answers could benefit from more specific examples. Continue practicing the STAR method for behavioral questions.",
  "strengths": ["Clear communication", "Strong technical foundation", "Good problem-solving approach"],
  "improvementAreas": ["Add more quantifiable results", "Structure answers more clearly", "Provide more specific examples"]
}
`
