// Mock function to generate interview questions
export async function generateInterviewQuestions(
  jobRole: string,
  interviewType: string,
  difficulty: string,
): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock questions based on job role and type
  const questionSets = {
    "Full Stack Developer": {
      technical: [
        "Explain the difference between REST and GraphQL APIs.",
        "How would you optimize a slow-loading web application?",
        "Describe your approach to handling authentication in a web app.",
        "What are the key differences between SQL and NoSQL databases?",
        "How do you ensure code quality in a team environment?",
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
      ],
      behavioral: [
        "Tell me about a machine learning project you're proud of.",
        "How do you stay updated with the latest AI research?",
        "Describe a time when your model didn't perform as expected.",
        "How do you explain complex AI concepts to non-technical stakeholders?",
        "Tell me about a time you had to work with messy or incomplete data.",
      ],
    },
    "Product Manager": {
      behavioral: [
        "How do you prioritize features in a product roadmap?",
        "Tell me about a time you had to make a difficult product decision.",
        "How do you gather and incorporate user feedback?",
        "Describe your approach to working with engineering teams.",
        "How do you measure product success?",
      ],
      general: [
        "How would you improve our product?",
        "What metrics would you track for a new feature launch?",
        "How do you handle conflicting stakeholder requirements?",
        "Describe your process for conducting user research.",
        "How do you communicate product vision to different audiences?",
      ],
    },
  }

  const defaultQuestions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this role?",
    "What are your greatest strengths?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in 5 years?",
  ]

  const roleQuestions = questionSets[jobRole as keyof typeof questionSets]
  const typeQuestions = roleQuestions?.[interviewType as keyof typeof roleQuestions] || defaultQuestions

  // Return 5 questions, adjusting for difficulty
  const numQuestions = difficulty === "beginner" ? 4 : difficulty === "advanced" ? 6 : 5
  return typeQuestions.slice(0, numQuestions)
}

// Mock function to evaluate an answer
export async function evaluateAnswer(
  question: string,
  answer: string,
  jobRole: string,
): Promise<{ score: number; feedback: string }> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock evaluation logic
  const answerLength = answer.length
  const hasExamples = answer.toLowerCase().includes("example") || answer.toLowerCase().includes("experience")
  const isDetailed = answerLength > 200
  const isStructured = answer.includes("first") || answer.includes("second") || answer.includes("finally")

  let score = 5 // Base score

  // Adjust score based on answer quality
  if (answerLength < 50) score -= 2
  else if (answerLength > 300) score += 1

  if (hasExamples) score += 1.5
  if (isDetailed) score += 1
  if (isStructured) score += 0.5

  // Cap score at 10
  score = Math.min(10, Math.max(1, score))

  // Generate feedback based on score
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
