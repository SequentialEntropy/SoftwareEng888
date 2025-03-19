/**
 * Login.jsx - A React component for user authentication.
 * 
 * @file Renders the login form using the Form component 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.1.0
 * @since 14-02-2025
 */

import { useEffect } from "react"
import Form from "../components/Form"

/**
 * Login Component 
 * 
 * This component renders a login form that will send user credentials to the authentication API 
 * 
 * @component 
 * @returns {JSX.Element} The login form
 */

function Login() {
    useEffect(() => {
        document.title = "Login"
    }, [])

    return <Form route="/accounts/token/" method="login" />
}

export default Login