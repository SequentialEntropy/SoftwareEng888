/**
 * NotFound.jsx - A React component for handling 404 errors
 * 
 * @file Displays a message when the user navigates to a non-existent page
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.0.0
 * @since 15-02-2025
 * 
 */

import styles from "../styles/Landing.module.css"

/**
 * NotFound Component 
 * 
 * This component is rendered when a user navigates to an invalid route.
 * 
 * @component
 * @returns {JSX.Element} A 404 Not Found message
 */

function NotFound() {
    return <div>This page could not be found.</div>
}

export default NotFound