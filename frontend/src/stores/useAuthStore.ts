import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface AuthState {
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });

        try {
            
            const response = await axiosInstance.get("/admin/check")
            set({ isAdmin: response.data.admin })

        } catch (error:any) {
            const message = error.response?.data?.message ?? error.message ?? "Failed to fetch album"
            set({ error: message })
        
        }finally{
            set({ isLoading: false })
        }
    },

    reset: () => set({ isAdmin: false, isLoading: false, error: null }),
}))