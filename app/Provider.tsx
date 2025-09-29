"use client"
import { useEffect, useState } from "react"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { UserDetailProvider } from "@/context/UserDetailContext"
import { setUser, trackEvent } from "@/lib/analytics"
import { sendWelcomeEmail } from "@/lib/integrations/resend"

function Provider({ children }: any) {
  const { user } = useUser()
  const CreateUser = useMutation(api.users.CreateNewUser)
  const getUserByEmail = useQuery(
    api.users.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )
  const [userDetail, setUserDetail] = useState<any>()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (user && !isInitialized) {
      if (getUserByEmail) {
        // User exists in database
        setUserDetail(getUserByEmail)
        setIsInitialized(true)
        setUser(getUserByEmail._id, user.primaryEmailAddress?.emailAddress, {
          name: user.fullName,
          experienceLevel: getUserByEmail.experienceLevel,
          interests: getUserByEmail.interests,
          onboardingCompleted: getUserByEmail.profileCompleted,
        })
      } else if (getUserByEmail === null) {
        // User doesn't exist, create new user
        CreateNewUser()
      }
    }
  }, [user, getUserByEmail, isInitialized])

  const CreateNewUser = async () => {
    if (user && !isInitialized) {
      try {
        console.log("Creating new user:", user.primaryEmailAddress?.emailAddress)
        trackEvent("user_registered", {
          userEmail: user.primaryEmailAddress?.emailAddress,
          userName: user.fullName,
          registrationMethod: "clerk",
        })

        const result = await CreateUser({
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          name: user?.fullName ?? "",
          imageUrl: user?.imageUrl ?? "",
        })
        console.log("User created successfully:", result)
        setUserDetail(result)
        setIsInitialized(true)

        setUser(result._id, user.primaryEmailAddress?.emailAddress, {
          name: user.fullName,
          isNewUser: true,
        })

        trackEvent("user_created", {
          userId: result._id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          userName: user.fullName,
        })

        if (user.primaryEmailAddress?.emailAddress && user.fullName) {
          try {
            const emailSent = await sendWelcomeEmail(user.primaryEmailAddress.emailAddress, user.fullName)

            if (emailSent) {
              console.log("[Provider] Welcome email sent successfully")
              trackEvent("welcome_email_sent", {
                userId: result._id,
                userEmail: user.primaryEmailAddress.emailAddress,
              })
            } else {
              console.error("[Provider] Failed to send welcome email")
              trackEvent("welcome_email_failed", {
                userId: result._id,
                userEmail: user.primaryEmailAddress.emailAddress,
              })
            }
          } catch (emailError) {
            console.error("[Provider] Error sending welcome email:", emailError)
            trackEvent("error_occurred", {
              errorMessage: emailError.message,
              context: "welcome_email",
              userEmail: user.primaryEmailAddress.emailAddress,
            })
          }
        }
      } catch (error) {
        console.error("Error creating user:", error)
        trackEvent("error_occurred", {
          errorMessage: error.message,
          context: "user_creation",
          userEmail: user.primaryEmailAddress?.emailAddress,
        })

        // If user creation fails, try to fetch existing user
        if (getUserByEmail) {
          setUserDetail(getUserByEmail)
          setIsInitialized(true)
        }
      }
    }
  }

  return (
    <UserDetailProvider value={{ userDetail, setUserDetail }}>
      <div>{children}</div>
    </UserDetailProvider>
  )
}

export default Provider
