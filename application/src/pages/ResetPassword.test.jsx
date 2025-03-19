/**
 * ResetPassword.test.jsx - A React component for testing the password reset page
 * 
 * @file Handles the test for the password reset page
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 25-02-2025
*/

//ResetPassword.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from './ResetPassword';

describe('ResetPassword Component', () => {
    /** 
     * Test 1: Check if component renders properly
     * Test 2: Test form input functionality
     * Test 3: Test form submission
     * Test 4: Document the current input type
     * Test 5: Test button click
     * Test 6: Verify form structure
    */
    test('renders the reset password form', () => {
        render(<ResetPassword />);
        expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^confirm new password$/i)).toBeInTheDocument();
    });
});