import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (context) => {
  const identity = await context.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized!");
  return await context.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },

  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized!");

    const currentUser = await context.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser) throw new Error("User not found!");

    const imageUrl = await context.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image not found!");

    // createPost
    const postId = await context.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    // increment the number of posts of the user
    await context.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});
