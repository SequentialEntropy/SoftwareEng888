/**
 * Register.jsx - A React component for user registration
 * 
 * @file renders the registration form using the Form component 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.0.0 
 * @since 15-02-2025
 * 
 */

import Form from "../components/Form"

/**
 * Register Component 
 * 
 * This component renders a registration form that allows users to create an account. 
 * 
 * @component 
 * @returns {JSX.Element} The registration form
 */

function Register() {
    return <Form route="/accounts/user/register/" method="register"/>

}

export default Register