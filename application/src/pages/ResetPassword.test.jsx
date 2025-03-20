/**
 * ResetPassword.test.jsx - A React component for testing the password reset page
 * 
 * @file Handles the test for the password reset page
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 25-02-2025
*/

// ResetPassword.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ResetPassword from './ResetPassword';

describe('ResetPassword Component', () => {
    /** 
     * Test 1: Check if component renders properly
     * Test 2: Test form input functionality
     * Test 3: Test form submission
     * Test 4: Document the current input type
     * Test 5: Test submit button
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

    test('allows input in password fields', async () => {
        render(<ResetPassword />);
        const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
        const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
        await userEvent.type(newPasswordInput, 'NewSecurePassword123!');
        await userEvent.type(confirmPasswordInput, 'NewSecurePassword123!');
        expect(newPasswordInput.value).toBe('NewSecurePassword123!');
        expect(confirmPasswordInput.value).toBe('NewSecurePassword123!');
    });

    
    test('submits the form when submitted', async () => {
        const handleSubmit = jest.fn(e => e.preventDefault());
        const { container } = render(<ResetPassword />);
        const form = container.querySelector('form');
        form.onsubmit = handleSubmit;
        await userEvent.type(screen.getByPlaceholderText(/enter new password/i), 'NewSecurePassword123!');
        await userEvent.type(screen.getByPlaceholderText(/confirm new password/i), 'NewSecurePassword123!');
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    
    test('input fields have the current type attribute', () => {
        render(<ResetPassword />);
        const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
        const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
        expect(newPasswordInput).toHaveAttribute('type', 'form-control');
        expect(confirmPasswordInput).toHaveAttribute('type', 'form-control');
    });
    
    
    test('Submit button', () => {
        render(<ResetPassword />);
        const button = screen.getByRole('button', { name: /save changes/i });
        expect(button).toHaveAttribute('type', 'submit');
    });

    test('form has the expected structure', () => {
        const { container } = render(<ResetPassword />);
        const forms = container.querySelectorAll('form');
        expect(forms.length).toBe(1);
        const formGroups = container.querySelectorAll('.form-group');
        expect(formGroups.length).toBe(2);
        const form = container.querySelector('form');
        expect(form).toContainElement(screen.getByPlaceholderText(/enter new password/i));
        expect(form).toContainElement(screen.getByPlaceholderText(/confirm new password/i));
        expect(form).toContainElement(screen.getByRole('button', { name: /save changes/i }));
    });
});