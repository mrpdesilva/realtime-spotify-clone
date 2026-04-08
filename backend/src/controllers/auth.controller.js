import { clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing user id" });
        }

        // Fetch verified user data from Clerk
        const clerkUser = await clerkClient.users.getUser(id);

        const existingUser = await User.findOne({ clerkId: id });

        if (!existingUser) {
            await User.create({
                clerkId: id,
                fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                imageUrl: clerkUser.imageUrl,
            });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.log("Error in auth callback", error);
        next(error);
    }
};