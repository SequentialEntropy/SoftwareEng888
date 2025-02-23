/**
 * ProtectedRoute.jsx - A higher-order component to protect routes based on authentication.
 * 
 * @file Ensures that only authenticated users can access certain routes
 * @author Carina Jose
 * @author Amreet Dhillon 
 * @version 1.1.0
 * @since 15-02-2025
 */

import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

/**
 * 
 * This component restricts access to certain pages by checking if the user is authenticated. 
 * If the user is not authenticated, they are then redirected to the login page. 
 * 
 * @component
 * @param {JSX.Element} children - The components to render if authorized.
 * @returns {JSX.Element} - The protected route component.
 */

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => {setIsAuthorized(false)})
    }, [])

    /**
     * Refreshes the access token using the stored refresh token.
     * 
     * @async
     */

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/accounts/token/refresh/", {
                refresh: refreshToken
            })
            if (res.status === 200) {
                // Stores new access token and authorizes user
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    /**
     * Checks if the user is authenticated by decoding the stored access token. 
     * If the token is expired, it will attempt to refresh it
     * 
     * @async
     */

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken() // Token is expired, attempt refresh
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div> // Show a loading state while authentication is being verified
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute