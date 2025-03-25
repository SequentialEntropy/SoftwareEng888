/**
 * NotAuthorised.jsx - A React component for handling 403 errors
 * 
 * @file Displays a message when the user navigates to a page without the necessary permissions
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.0.0
 * @since 15-02-2025
 * 
 */

/**
 * NotAuthorised Component 
 * 
 * This component is rendered when a user navigates to an unauthorised route.
 * 
 * @component
 * @returns {JSX.Element} A 403 Not Authorised message
 */

export default function NotAuthorised() {
    return <div>You are not authorised to visit this page.</div>
}