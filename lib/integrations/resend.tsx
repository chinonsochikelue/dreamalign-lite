// Mock Resend integration for email notifications
export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  try {
    // In real implementation, this would use Resend API
    console.log(`Sending welcome email to ${userEmail}`)

    const emailData: EmailTemplate = {
      to: userEmail,
      subject: "Welcome to DreamAlign!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome to DreamAlign, ${userName}!</h1>
          <p>We're excited to help you on your career development journey.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your interest assessment</li>
            <li>Explore personalized career paths</li>
            <li>Practice with our AI interview coach</li>
          </ul>
          <a href="https://dreamalign-lite.vercel.app/onboarding" 
             style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Get Started
          </a>
        </div>
      `,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}

export async function sendInterviewCompletionEmail(
  userEmail: string,
  userName: string,
  score: number,
  jobRole: string,
): Promise<boolean> {
  try {
    console.log(`Sending interview completion email to ${userEmail}`)

    const emailData: EmailTemplate = {
      to: userEmail,
      subject: `Interview Complete - ${jobRole} (Score: ${score}/10)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Great job, ${userName}!</h1>
          <p>You've completed your ${jobRole} interview practice session.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0;">Your Results:</h2>
            <p style="font-size: 24px; font-weight: bold; color: ${score >= 8 ? "#22c55e" : score >= 6 ? "#f59e0b" : "#ef4444"}; margin: 0;">
              ${score}/10
            </p>
          </div>
          <p>Keep practicing to improve your interview skills!</p>
          <a href="https://dreamalign-lite.vercel.app/dashboard" 
             style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Dashboard
          </a>
        </div>
      `,
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  } catch (error) {
    console.error("Error sending interview completion email:", error)
    return false
  }
}

export async function sendCareerRecommendationEmail(
  userEmail: string,
  userName: string,
  careerPaths: string[],
): Promise<boolean> {
  try {
    console.log(`Sending career recommendation email to ${userEmail}`)

    const emailData: EmailTemplate = {
      to: userEmail,
      subject: "Your Personalized Career Recommendations",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Your Career Paths Are Ready, ${userName}!</h1>
          <p>Based on your interests, we've identified these career paths for you:</p>
          <ul style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            ${careerPaths.map((path) => `<li style="margin: 10px 0;">${path}</li>`).join("")}
          </ul>
          <p>Start exploring these paths and take your first interview practice!</p>
          <a href="https://dreamalign-lite.vercel.app/career-paths" 
             style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Explore Career Paths
          </a>
        </div>
      `,
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  } catch (error) {
    console.error("Error sending career recommendation email:", error)
    return false
  }
}
