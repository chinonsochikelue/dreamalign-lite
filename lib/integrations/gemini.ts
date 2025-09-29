import { generateText } from "ai"

// Gemini integration using AI SDK
export async function analyzeCareerInterests(interests: string[]): Promise<any[]> {
  try {
    const prompt = `
You are a career counselor AI. Based on the user's interests: ${interests.join(", ")}, 
analyze and recommend 3-5 career paths.

For each career path, provide:
1. Title (specific job role)
2. Description (2-3 sentences about the role)
3. Match score (0-100 based on interest alignment)
4. Required skills (5-8 key skills)
5. Common job titles (3-5 variations)
6. Salary range (realistic range with currency)

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

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
      temperature: 0.7,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing career interests with Gemini:", error)
    // Fallback to mock data
    return [
      {
        title: "Full Stack Developer",
        description: "Build end-to-end web applications using modern frameworks and technologies.",
        matchScore: 95,
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "SQL", "Git"],
        jobTitles: ["Full Stack Developer", "Software Engineer", "Web Developer"],
        salaryRange: { min: 75000, max: 130000, currency: "USD" },
      },
    ]
  }
}

export async function generateInterviewQuestions(jobRole: string, interviewType: string): Promise<string[]> {
  try {
    const prompt = `
Generate 5 interview questions for a ${jobRole} position.
Interview type: ${interviewType}

Questions should cover:
- Technical skills (if technical interview)
- Problem-solving
- Experience
- Behavioral aspects
- Industry knowledge

Make the questions thoughtful and relevant to the specific role and interview type.
Focus on practical scenarios and real-world applications.

Return as JSON array of strings:
["Question 1?", "Question 2?", ...]
`

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
      temperature: 0.8,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating interview questions with Gemini:", error)
    // Fallback questions
    return [
      "Tell me about yourself and your background.",
      "Why are you interested in this role?",
      "What are your greatest strengths?",
      "Describe a challenging situation you faced and how you handled it.",
      "Where do you see yourself in 5 years?",
    ]
  }
}

export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  jobRole: string,
): Promise<{ score: number; feedback: string }> {
  try {
    const prompt = `
You are an experienced interview coach with expertise in ${jobRole} positions. 
Evaluate this interview answer and provide constructive, actionable feedback.

Question: ${question}
Answer: ${answer}
Job Role: ${jobRole}

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

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
      temperature: 0.3,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error evaluating answer with Gemini:", error)
    // Fallback evaluation
    return {
      score: 7.5,
      feedback: "Good answer with solid content. Consider adding more specific examples to strengthen your response.",
    }
  }
}
