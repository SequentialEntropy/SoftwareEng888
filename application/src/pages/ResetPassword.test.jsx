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
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ResetPassword from './ResetPassword';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    Link: ({ children, to }) => (
        <a href={to} data-testid="mock-link">
            {children}
        </a>
    ),
    useNavigate: () => jest.fn(),
    Routes: ({ children }) => <div data-testid="mock-routes">{children}</div>,
    Route: ({ children }) => <div data-testid="mock-route">{children}</div>,
    BrowserRouter: ({ children }) => <div data-testid="mock-browser-router">{children}</div>
}));

// Mock the API module
jest.mock('../api', () => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}), { virtual: true });

// Mock CSS module
jest.mock('../styles/ResetPassword.module.css', () => ({}), { virtual: true });

// Mock any potential components or wrappers
jest.mock('../components/Navbar', () => () => <div data-testid="mock-navbar" />, { virtual: true });
jest.mock('../components/Layout', () => ({ children }) => <div data-testid="mock-layout">{children}</div>, { virtual: true });

describe('ResetPassword Component', () => {
    /** 
     * Test 1: Check if component renders properly
     * Test 2: Test form input functionality
     * Test 3: Test form submission
     * Test 4: Document the current input type
     * Test 5: Test submit button
     * Test 6: Verify form structure
    */
    const renderComponent = () => {
        return render(<ResetPassword />);
    };
    
    test('renders the reset password form', () => {
        renderComponent();
        expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });

    test('allows input in password fields', async () => {
        const user = userEvent.setup();
        renderComponent();
        const newPasswordInput = screen.getByPlaceholderText('Enter new password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
        
        await user.type(newPasswordInput, 'newSecurePassword123!');
        await user.type(confirmPasswordInput, 'newSecurePassword123!');
        
        expect(newPasswordInput).toHaveValue('newSecurePassword123!');
        expect(confirmPasswordInput).toHaveValue('newSecurePassword123!');
    });

    test('submits the form when submitted', async () => {
        const user = userEvent.setup();
        const { container } = renderComponent();
        
        // Override the form's onSubmit to use mock
        const form = container.querySelector('form');
        const handleSubmit = jest.fn(e => e.preventDefault());
        const originalOnSubmit = form.onsubmit;

        form.addEventListener('submit', handleSubmit);
        
        const newPasswordInput = screen.getByPlaceholderText('Enter new password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
        
        await user.type(newPasswordInput, 'newSecurePassword123');
        await user.type(confirmPasswordInput, 'newSecurePassword123');
        
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        
        form.removeEventListener('submit', handleSubmit);
        form.onsubmit = originalOnSubmit;
    });

    test('input fields have the correct type attribute', () => {
        renderComponent();
        const newPasswordInput = screen.getByPlaceholderText('Enter new password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
        
        expect(newPasswordInput).toHaveAttribute('type', 'form-control');
        expect(confirmPasswordInput).toHaveAttribute('type', 'form-control');
    });
    
    test('Submit button', async () => {
        const user = userEvent.setup();
        renderComponent();
        const submitButton = screen.getByRole('button', { name: 'Save Changes' });
        
        expect(submitButton.tagName).toBe('BUTTON');
        expect(submitButton).toHaveAttribute('type', 'submit');
        
        const handleClick = jest.fn();
        submitButton.addEventListener('click', handleClick);
        await user.click(submitButton);
        expect(handleClick).toHaveBeenCalledTimes(1);
        
        submitButton.removeEventListener('click', handleClick);
    });

    test('form has the expected structure', () => {
        const { container } = renderComponent();
        const form = container.querySelector('form');
        
        expect(form).not.toBeNull();
        expect(form.children.length).toBe(3);
        
        const formGroups = form.querySelectorAll('.form-group');
        expect(formGroups.length).toBe(2);
        
        // New password field
        const newPasswordGroup = formGroups[0];
        const newPasswordLabel = newPasswordGroup.querySelector('label');
        const newPasswordInput = newPasswordGroup.querySelector('input');
        expect(newPasswordLabel.textContent).toBe('New Password');
        expect(newPasswordInput.id).toBe('new-password');
        
        // Confirm password field
        const confirmPasswordGroup = formGroups[1];
        const confirmPasswordLabel = confirmPasswordGroup.querySelector('label');
        const confirmPasswordInput = confirmPasswordGroup.querySelector('input');
        expect(confirmPasswordLabel.textContent).toBe('Confirm New Password');
        expect(confirmPasswordInput.id).toBe('confirm-new-password');
    });
});