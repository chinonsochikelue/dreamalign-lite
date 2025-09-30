import { Resend } from "resend"


export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {


  const resend = new Resend(process.env.RESEND_API_KEY)

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set in environment variables.")
  }

  try {
    console.log(`[Resend] Sending welcome email to ${userEmail}`)

    const { data, error } = await resend.emails.send({
      from: "DreamAlign <noreply@dreamalign.app>",
      to: [userEmail],
      subject: "Welcome to DreamAlign!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to DreamAlign!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Where Dreams Meet Opportunity</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">Hello ${userName}! 🎉</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
              We're thrilled to have you join our community of ambitious professionals who are transforming their careers with AI-powered guidance.
            </p>
            
            <div style="background: #f7fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">🚀 Here's what you can do next:</h3>
              <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Complete your personalized interest assessment</li>
                <li>Discover AI-curated career paths tailored to you</li>
                <li>Practice with our intelligent interview coach</li>
                <li>Connect with like-minded professionals</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://dreamalign-lite.vercel.app/onboarding" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                🎯 Start Your Journey
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 35px;">
              <p style="color: #718096; font-size: 14px; margin: 0; text-align: center;">
                Need help? Reply to this email or visit our <a href="https://dreamalign-lite.vercel.app/support" style="color: #667eea;">support center</a>
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[Resend] Error sending welcome email:", error)
      return false
    }

    console.log("[Resend] Welcome email sent successfully:", data?.id)
    return true
  } catch (error) {
    console.error("[Resend] Error sending welcome email:", error)
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
    console.log(`[Resend] Sending interview completion email to ${userEmail}`)

    const scoreColor = score >= 8 ? "#22c55e" : score >= 6 ? "#f59e0b" : "#ef4444"
    const scoreEmoji = score >= 8 ? "🎉" : score >= 6 ? "👍" : "💪"
    const encouragement =
      score >= 8
        ? "Outstanding performance!"
        : score >= 6
          ? "Great job! You're on the right track."
          : "Keep practicing - you're improving!"

    const { data, error } = await resend.emails.send({
      from: "DreamAlign <noreply@dreamalign.app>",
      to: [userEmail],
      subject: `Interview Complete - ${jobRole} (Score: ${score}/10) ${scoreEmoji}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Interview Complete! ${scoreEmoji}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${jobRole} Practice Session</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">Great work, ${userName}!</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
              You've completed your ${jobRole} interview practice session. ${encouragement}
            </p>
            
            <div style="background: #f7fafc; padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center; border: 2px solid ${scoreColor};">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">📊 Your Results</h3>
              <div style="font-size: 48px; font-weight: bold; color: ${scoreColor}; margin: 15px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${score}/10
              </div>
              <p style="color: #4a5568; margin: 0; font-size: 16px; font-weight: 500;">${encouragement}</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">🎯 Keep Improving</h3>
              <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Review your performance insights</li>
                <li>Practice more interview scenarios</li>
                <li>Explore other career paths</li>
                <li>Connect with industry mentors</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://dreamalign-lite.vercel.app/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); margin-right: 15px;">
                📈 View Dashboard
              </a>
              <a href="https://dreamalign-lite.vercel.app/careers" 
                 style="background: transparent; color: #667eea; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; border: 2px solid #667eea;">
                🎯 Practice More
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 35px;">
              <p style="color: #718096; font-size: 14px; margin: 0; text-align: center;">
                Keep up the great work! Every practice session brings you closer to your dream job.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[Resend] Error sending interview completion email:", error)
      return false
    }

    console.log("[Resend] Interview completion email sent successfully:", data?.id)
    return true
  } catch (error) {
    console.error("[Resend] Error sending interview completion email:", error)
    return false
  }
}

export async function sendCareerRecommendationEmail(
  userEmail: string,
  userName: string,
  careerPaths: string[],
): Promise<boolean> {
  try {
    console.log(`[Resend] Sending career recommendation email to ${userEmail}`)

    const { data, error } = await resend.emails.send({
      from: "DreamAlign <noreply@dreamalign.app>",
      to: [userEmail],
      subject: "🎯 Your Personalized Career Recommendations Are Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Your Career Paths Are Ready! 🎯</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">AI-Curated Just For You</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">Hello ${userName}! ✨</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
              Based on your interests, skills, and career goals, our AI has identified these personalized career paths that align perfectly with your aspirations:
            </p>
            
            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 20px;">🚀 Your Recommended Career Paths</h3>
              <div style="space-y: 15px;">
                ${careerPaths
          .map(
            (path, index) => `
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 3px solid #667eea;">
                    <div style="display: flex; align-items: center;">
                      <span style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px;">${index + 1}</span>
                      <span style="color: #2d3748; font-weight: 600; font-size: 16px;">${path}</span>
                    </div>
                  </div>
                `,
          )
          .join("")}
              </div>
            </div>
            
            <div style="background: #f0fff4; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #9ae6b4;">
              <h3 style="color: #22543d; margin: 0 0 15px 0; font-size: 18px;">🎯 Next Steps</h3>
              <ul style="color: #2f855a; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Explore detailed career path information</li>
                <li>Start practicing interviews for your target roles</li>
                <li>Connect with professionals in these fields</li>
                <li>Build relevant skills through our learning resources</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://dreamalign-lite.vercel.app/careers" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); margin-right: 15px;">
                🎯 Explore Career Paths
              </a>
              <a href="https://dreamalign-lite.vercel.app/dashboard" 
                 style="background: transparent; color: #667eea; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; border: 2px solid #667eea;">
                📊 View Dashboard
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 35px;">
              <p style="color: #718096; font-size: 14px; margin: 0; text-align: center;">
                Your dream career is within reach! Start exploring these paths and take the first step toward your future.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[Resend] Error sending career recommendation email:", error)
      return false
    }

    console.log("[Resend] Career recommendation email sent successfully:", data?.id)
    return true
  } catch (error) {
    console.error("[Resend] Error sending career recommendation email:", error)
    return false
  }
}
