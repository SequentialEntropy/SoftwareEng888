/**
 * App.jsx - The main entry point for routing in the application 
 * 
 * @file Manages the routes and navigation for the application including protected routes
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.1.0
 * @since 17-02-2025
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Board from "./pages/Board"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import Landing from "./pages/Landing"
import Map from "./pages/Map"

/**
 * Logout Component 
 * 
 * Clears local storage and redirects the user to the login page
 * 
 * @component
 * @returns {JSX.Element} A navigation redirection to the login page
 */

function Logout() {
    localStorage.clear()
    return <Navigate to="/login" />
}

/**
 * RegisterAndLogout Component 
 * 
 * Clears local storage and renders the registration page
 * 
 * @component
 * @returns {JSX.Element} The registration form
 */

function RegisterAndLogout() {
    localStorage.clear()
    return <Register />
}

/**
 * App Component 
 * 
 * Defines the application's routing structure including public and protected routes
 * 
 * @component
 * @returns {JSX.Element} The routing structure of the application
 */

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Protected home route */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>

                {/* Public routes */}
                <Route path="/" element={<Landing />}/>  
                <Route path="/login" element={<Login />}/>
                <Route path="/logout" element={<Logout />}/>
                <Route path="/register" element={<RegisterAndLogout />}/>
                <Route path="/board" element={<Board />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/map" element={<Map />}/>

                {/* Catch-all route for 404 pages */}
                <Route path="*" element={<NotFound />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
