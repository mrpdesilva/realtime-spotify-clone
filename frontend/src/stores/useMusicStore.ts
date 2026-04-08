import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import type { Album, Song, Stats } from "../types";
import toast from "react-hot-toast";

interface MusicStore {
    albums: Album[];
    songs: Song[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    madeForYouSongs: Song[];
    featuredSongs: Song[];
    trendingSongs: Song[];
    stats: Stats

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0
    },

    deleteAlbum: async (id: string) => {
        set({ isLoading: true, error: null })

        try {
            await axiosInstance.delete(`admin/albums/${id}`)

            set((state) => ({
                albums: state.albums.filter((album) => album._id !== id), // ✅ fix != to !==
                stats: {               // ✅ update stats immediately
                    ...state.stats,
                    totalAlbums: state.stats.totalAlbums - 1
                }
            }))
            toast.success("Album deleted successfully")
        } catch (error: any) {
            toast.error("Failed to delete the album" + error.message)
            // set({ error: error.response?.data?.message ?? error.message ?? "Failed to delete song" })
        } finally {
            set({ isLoading: false })
        }
    },

    deleteSong: async (id: string) => {
        set({ isLoading: true, error: null })

        try {
            await axiosInstance.delete(`admin/songs/${id}`)
            set(state => ({
                songs: state.songs.filter(song => song._id !== id),
                stats: {               // ✅ update stats immediately
                    ...state.stats,
                    totalSongs: state.stats.totalSongs - 1
                }
            }))

            toast.success("Song deleted successfully")

        } catch (error: any) {
            toast.error("Failed to delete song" + error.message)
            // set({ error: error.response?.data?.message ?? error.message ?? "Failed to delete song" })

        } finally {
            set({ isLoading: false })
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/songs")
            set({ songs: response.data })
        } catch (error: any) {
            const message = error.response?.data?.message ?? error.message ?? "Failed to fetch albums"
            set({ error: message }) // ✅ optional chaining prevents crash when server is down
        } finally {
            set({ isLoading: false })
        }
    },
    fetchStats: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/stats")
            set({ stats: response.data })
        } catch (error: any) {
            const message = error.response?.data?.message ?? error.message ?? "Failed to fetch albums"
            set({ error: message }) // ✅ optional chaining prevents crash when server is down
        } finally {
            set({ isLoading: false })
        }
    },

    fetchAlbums: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await axiosInstance.get("/albums")
            set({ albums: response.data })
        } catch (error: any) {
            const message = error.response?.data?.message ?? error.message ?? "Failed to fetch albums"
            set({ error: message }) // ✅ optional chaining prevents crash when server is down
        } finally {
            set({ isLoading: false })
        }
    },

    fetchAlbumById: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axiosInstance.get(`/albums/${id}`)
            set({ currentAlbum: response.data })
        } catch (error: any) {
            const message = error.response?.data?.message ?? error.message ?? "Failed to fetch album"
            set({ error: message }) // ✅ optional chaining prevents crash when server is down
        } finally {
            set({ isLoading: false })
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/songs/featured")
            set({ featuredSongs: response.data })

        } catch (error: any) {
            const message = error.response?.data?.message ?? error.message ?? "Failed to fetch album"
            set({ error: message })

        } finally {
            set({ isLoading: false })
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/songs/made-for-you")
            set({ madeForYouSongs: response.data })

        } catch (error: any) {
            const message = error.response?.data?.message ?? error.message ?? "Failed to fetch album"
            set({ error: message })

        } finally {
            set({ isLoading: false })
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/songs/trending")
            set({ trendingSongs: response.data })
        } catch (error: any) {
            set({ error: error.response?.data?.message ?? error.message ?? "Failed to fetch album" })
        } finally {
            set({ isLoading: false })
        }
    },
}))