import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const saveChatMessage = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("chatMessages", {
      userId: args.userId,
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    })

    return messageId
  },
})

export const getChatHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50) // Get last 50 messages
      .then((messages) => messages.reverse()) // Reverse to show oldest first
  },
})

export const clearChatHistory = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    for (const message of messages) {
      await ctx.db.delete(message._id)
    }

    return { deleted: messages.length }
  },
})