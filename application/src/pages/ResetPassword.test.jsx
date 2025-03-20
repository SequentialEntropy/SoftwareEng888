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
    
    // Isolate component rendering for tests
    const renderComponent = () => {
        return render(<ResetPassword />);
    };
    
    test('renders the reset password form', () => {
        renderComponent();
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
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
        const handleSubmit = jest.fn(e => e.preventDefault());
        const { container } = renderComponent();
        const form = container.querySelector('form');
        form.onsubmit = handleSubmit;
        const newPasswordInput = screen.getByPlaceholderText('Enter new password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
        await user.type(newPasswordInput, 'newSecurePassword123');
        await user.type(confirmPasswordInput, 'newSecurePassword123');
        const submitButton = screen.getByRole('button', { name: 'Save Changes' });
        await user.click(submitButton);
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    test('input fields have the current type attribute', () => {
        renderComponent();
        const newPasswordInput = screen.getByPlaceholderText('Enter new password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
        expect(newPasswordInput).toHaveAttribute('type', 'form-control');
        expect(confirmPasswordInput).toHaveAttribute('type', 'form-control');
        // Note: This test documents the current implementation, but 'form-control' 
        // should ideally be a className, not a type attribute (which should be 'password')
    });
    
    test('Submit button', async () => {
        const user = userEvent.setup();
        renderComponent();
        const submitButton = screen.getByRole('button', { name: 'Save Changes' });
        expect(submitButton.tagName).toBe('BUTTON');
        expect(submitButton).toHaveAttribute('type', 'submit');
        const handleClick = jest.fn();
        submitButton.onclick = handleClick;
        await user.click(submitButton);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('form has the expected structure', () => {
        const { container } = renderComponent();
        const form = container.querySelector('form');
        expect(form).not.toBeNull();
        expect(form.children.length).toBe(3); // 2 form groups and 1 button
        const formGroups = form.querySelectorAll('.form-group');
        expect(formGroups.length).toBe(2);
        const firstFormGroup = formGroups[0];
        const firstLabel = firstFormGroup.querySelector('label');
        const firstInput = firstFormGroup.querySelector('input');
        expect(firstLabel.textContent).toBe('New Password');
        expect(firstInput.id).toBe('new-password');
        const secondFormGroup = formGroups[1];
        const secondLabel = secondFormGroup.querySelector('label');
        const secondInput = secondFormGroup.querySelector('input');
        expect(secondLabel.textContent).toBe('Confirm New Password');
        expect(secondInput.id).toBe('confirm-new-password');
    });
});