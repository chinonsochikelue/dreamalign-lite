import { type AIProvider, getAIService } from "./ai-provider"

// Generate interview questions using real AI models
export async function generateInterviewQuestions(
  jobRole: string,
  interviewType: string,
  difficulty: string,
  provider: AIProvider = "openai",
): Promise<string[]> {
  const aiService = getAIService(provider)

  try {
    const questions = await aiService.generateInterviewQuestions(jobRole, interviewType)

    // Adjust number of questions based on difficulty
    const numQuestions = difficulty === "beginner" ? 4 : difficulty === "advanced" ? 6 : 5
    return questions.slice(0, numQuestions)
  } catch (error) {
    console.error("[v0] Error generating interview questions:", error)
    // Return fallback questions on error
    return getFallbackQuestions(jobRole, interviewType, difficulty)
  }
}

// Evaluate an answer using real AI models
export async function evaluateAnswer(
  question: string,
  answer: string,
  jobRole: string,
  provider: AIProvider = "openai",
): Promise<{ score: number; feedback: string }> {
  const aiService = getAIService(provider)

  try {
    return await aiService.evaluateInterviewAnswer(question, answer, jobRole)
  } catch (error) {
    console.error("[v0] Error evaluating answer:", error)
    // Return fallback evaluation on error
    return getFallbackEvaluation(answer)
  }
}

// Fallback questions when AI is unavailable
function getFallbackQuestions(jobRole: string, interviewType: string, difficulty: string): string[] {
  const questionSets: Record<string, Record<string, string[]>> = {
    "Full Stack Developer": {
      technical: [
        "Explain the difference between REST and GraphQL APIs.",
        "How would you optimize a slow-loading web application?",
        "Describe your approach to handling authentication in a web app.",
        "What are the key differences between SQL and NoSQL databases?",
        "How do you ensure code quality in a team environment?",
        "Explain the concept of server-side rendering vs client-side rendering.",
      ],
      behavioral: [
        "Tell me about a challenging project you worked on recently.",
        "How do you handle tight deadlines and pressure?",
        "Describe a time when you had to learn a new technology quickly.",
        "How do you approach debugging a complex issue?",
        "Tell me about a time you disagreed with a team member.",
      ],
      "system-design": [
        "Design a URL shortening service like bit.ly.",
        "How would you design a chat application for millions of users?",
        "Explain how you would scale a web application to handle high traffic.",
        "Design a notification system for a social media platform.",
        "How would you implement a real-time collaborative document editor?",
      ],
    },
    "AI/ML Engineer": {
      technical: [
        "Explain the bias-variance tradeoff in machine learning.",
        "How would you handle overfitting in a deep learning model?",
        "Describe the difference between supervised and unsupervised learning.",
        "What evaluation metrics would you use for a classification problem?",
        "How do you approach feature selection in machine learning?",
        "Explain how transformers work in natural language processing.",
      ],
      behavioral: [
        "Tell me about a machine learning project you're proud of.",
        "How do you stay updated with the latest AI research?",
        "Describe a time when your model didn't perform as expected.",
        "How do you explain complex AI concepts to non-technical stakeholders?",
        "Tell me about a time you had to work with messy or incomplete data.",
      ],
    },
  }

  const defaultQuestions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this role?",
    "What are your greatest strengths?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in 5 years?",
    "What motivates you in your work?",
  ]

  const roleQuestions = questionSets[jobRole]
  const typeQuestions = roleQuestions?.[interviewType] || defaultQuestions

  const numQuestions = difficulty === "beginner" ? 4 : difficulty === "advanced" ? 6 : 5
  return typeQuestions.slice(0, numQuestions)
}

// Fallback evaluation when AI is unavailable
function getFallbackEvaluation(answer: string): { score: number; feedback: string } {
  const answerLength = answer.length
  const hasExamples = answer.toLowerCase().includes("example") || answer.toLowerCase().includes("experience")
  const isDetailed = answerLength > 200
  const isStructured = answer.includes("first") || answer.includes("second") || answer.includes("finally")

  let score = 5

  if (answerLength < 50) score -= 2
  else if (answerLength > 300) score += 1

  if (hasExamples) score += 1.5
  if (isDetailed) score += 1
  if (isStructured) score += 0.5

  score = Math.min(10, Math.max(1, score))

  let feedback = ""
  if (score >= 8) {
    feedback =
      "Excellent answer! You provided specific examples and demonstrated clear understanding. Your response was well-structured and showed strong communication skills."
  } else if (score >= 6) {
    feedback =
      "Good answer with solid content. Consider adding more specific examples from your experience to strengthen your response. Your technical knowledge comes through well."
  } else if (score >= 4) {
    feedback =
      "Your answer covers the basics but could be more detailed. Try to include specific examples and explain your thought process more clearly. Consider structuring your response with clear points."
  } else {
    feedback =
      "Your answer needs more development. Include specific examples, explain your reasoning, and provide more detail about your experience. Practice structuring your responses clearly."
  }

  return {
    score: Math.round(score * 10) / 10,
    feedback,
  }
}
