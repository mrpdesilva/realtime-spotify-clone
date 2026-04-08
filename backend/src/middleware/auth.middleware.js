import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {

    const auth = req.auth()

    //  console.log("req.auth:", req.auth)

    if (!auth?.userId) {
        return res.status(401).json({ message: "Unauthorized - You must be Logged in" })
    }
    next()
}

export const requireAdmin = async (req, res, next) => {
    try {
        const auth = req.auth()  // ✅ call it as a function
        const currentUser = await clerkClient.users.getUser(auth.userId)
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress

        if (!isAdmin) {
            return res.status(401).json({ message: "Unauthorized - You must be an Admin" })
        }

        next()
    } catch (error) {
        next(error)
    }
}