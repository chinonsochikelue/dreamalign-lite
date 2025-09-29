"use client"

import { createContext, useContext } from "react"

interface UserDetail {
  _id?: string
  email?: string
  name?: string
  imageUrl?: string
  interests?: string[]
  profileCompleted?: boolean
  createdAt?: number
  updatedAt?: number
}

interface UserDetailContextType {
  userDetail: UserDetail | null
  setUserDetail: (userDetail: UserDetail | null) => void
}

const UserDetailContext = createContext<UserDetailContextType | null>(null)

export const UserDetailProvider = UserDetailContext.Provider

export const useUserDetails = () => {
  const context = useContext(UserDetailContext)
  if (!context) {
    return { userDetail: null, setUserDetail: () => {} }
  }
  return context
}
