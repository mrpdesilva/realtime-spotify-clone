import { create } from "zustand"
import { persist } from "zustand/middleware"  // ✅ add persist
import { axiosInstance } from "../lib/axios";
import type { Message, User } from "../types";
import { io } from "socket.io-client";

interface ChatStore {
    users: User[];
    isLoading: boolean;
    messagesLoading: boolean;
    error: string | null;
    socket: any;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: Message[];
    selectedUser: User | null;

    fetchUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disconnectSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/"

const socket = io(baseURL, {
    autoConnect: false,
    withCredentials: true
})

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            users: [],
            isLoading: false,
            messagesLoading: false,
            error: null,
            socket: socket,
            isConnected: false,
            messages: [],
            onlineUsers: new Set<string>(),
            userActivities: new Map<string, string>(),
            selectedUser: null,

            setSelectedUser: (user: User | null) => {
                set({ selectedUser: user })
            },

            fetchUsers: async () => {
                set({ isLoading: true, error: null })
                try {
                    const response = await axiosInstance.get("/users")
                    set({ users: response.data })
                } catch (error: any) {
                    set({ error: error.response?.data?.message ?? error.message ?? "Failed to fetch users" })
                } finally {
                    set({ isLoading: false })
                }
            },

            initSocket: (userId: string) => {
                if (!get().isConnected) {
                    socket.auth = { userId }
                    socket.connect()
                    socket.emit("user_connected", userId)
                    set({ isConnected: true })

                    socket.off("users_online")
                    socket.off("activities")
                    socket.off("user_connected")
                    socket.off("user_disconnected")
                    socket.off("receive_message")
                    socket.off("message_sent")
                    socket.off("activity_updated")  // ✅ add this

                    socket.on("users_online", (users: string[]) => {
                        set({ onlineUsers: new Set(users) })
                    })

                    socket.on("activities", (activities: [string, string][]) => {
                        set({ userActivities: new Map(activities) })
                    })

                    // ✅ add this — backend emits "activity_updated" not "activities" for updates
                    socket.on("activity_updated", ({ userId, activity }: { userId: string, activity: string }) => {
                        set((state) => {
                            const newActivities = new Map(state.userActivities)
                            newActivities.set(userId, activity)
                            return { userActivities: newActivities }
                        })
                    })

                    socket.on("user_connected", (userId: string) => {
                        set((state) => ({
                            onlineUsers: new Set([...state.onlineUsers, userId])
                        }))
                    })

                    socket.on("user_disconnected", (userId: string) => {
                        set((state) => {
                            const newOnlineUsers = new Set(state.onlineUsers)
                            newOnlineUsers.delete(userId)
                            return { onlineUsers: newOnlineUsers }
                        })
                    })

                    socket.on("receive_message", (message: Message) => {
                        set((state) => ({
                            messages: [...state.messages, message]
                        }))
                    })

                    socket.on("message_sent", (message: Message) => {
                        set((state) => ({
                            messages: [...state.messages, message]
                        }))
                    })
                }
            },

            disconnectSocket: () => {
                if (get().isConnected) {
                    socket.disconnect()
                    set({ isConnected: false })
                }
            },

            sendMessage: (receiverId: string, senderId: string, content: string) => {
                const socket = get().socket
                if (!socket) return
                socket.emit("send_message", { receiverId, senderId, content })
            },

            fetchMessages: async (userId: string) => {
                set({ messagesLoading: true, error: null })
                try {
                    const response = await axiosInstance.get(`/users/messages/${userId}`)
                    set({ messages: response.data })
                } catch (error: any) {
                    set({ error: error.response?.data?.message ?? error.message ?? "Failed to fetch messages" })
                } finally {
                    set({ messagesLoading: false })
                }
            }
        }),
        {
            name: "chat-store",  // ✅ localStorage key
            partialize: (state) => ({
                selectedUser: state.selectedUser  // ✅ only persist selectedUser
            })
        }
    )
)