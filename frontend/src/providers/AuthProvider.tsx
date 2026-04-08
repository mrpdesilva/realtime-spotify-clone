import React, { useEffect, useState } from 'react'
import { Loader } from "lucide-react";
import { useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../stores/useAuthStore';
import { useChatStore } from '../stores/useChatStore';

const updateApiToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axiosInstance.defaults.headers.common['Authorization']
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken, isLoaded, isSignedIn, userId } = useAuth() // ✅ track auth state
    const [loading, setLoading] = useState(true)
    const { checkAdminStatus } = useAuthStore()
    const {initSocket, disconnectSocket} = useChatStore()

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken()
                console.log("Token:", token)
                updateApiToken(token)

                if (token) {
                    await checkAdminStatus()
                    //init socket
                    if(userId) initSocket(userId)
                }

                console.log("Auth header:", axiosInstance.defaults.headers.common['Authorization'])

            } catch (error) {
                updateApiToken(null)
                console.log("Error in AuthProvider", error)
            } finally {
                setLoading(false)
            }
        }

        if (isLoaded) { // ✅ only run after Clerk is ready
            initAuth()
        }

        //clean up
        return () => disconnectSocket()
    }, [getToken, isLoaded, isSignedIn, userId, checkAdminStatus, initSocket, disconnectSocket]) // ✅ re-run when sign in state changes

    if (loading)
        return (
            <div className='h-screen w-full flex items-center justify-center'>
                <Loader className='size-8 text-emerald-500 animate-spin' />
            </div>
        );

    return <>{children}</>;
}

export default AuthProvider