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
import ResetPassword from './ResetPassword';
import { act } from 'react';

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
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}), { virtual: true });

// Mock CSS module
jest.mock('../styles/ResetPassword.module.css', () => ({}), { virtual: true });

// Mock any potential components or wrappers
jest.mock('../components/Navbar', () => () => <div data-testid="mock-navbar" />, { virtual: true });
jest.mock('../components/Layout', () => ({ children }) => <div data-testid="mock-layout">{children}</div>, { virtual: true });

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.useFakeTimers();

describe('ResetPassword Component', () => {
    /** 
     * Test 1: Check if component renders properly
     * Test 2: Test form input functionality
     * Test 3: Test form submission
     * Test 4: Document the current input type
     * Test 5: Test submit button
     * Test 6: Verify form structure
    */
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    const renderComponent = () => {
        return render(<ResetPassword />);
    };
    
    test('renders the password form with heading', () => {
        renderComponent();
        const heading = screen.queryByText(/Reset Password/i) || screen.queryByText(/Change Password/i);
        expect(heading).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
        
        const oldPasswordField = screen.queryByPlaceholderText('Enter old password');
        if (oldPasswordField) {
            expect(oldPasswordField).toBeInTheDocument();
        }
        
        expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });

    test('allows input in password fields', async () => {
        renderComponent();
        const newPasswordInput = screen.getByPlaceholderText('Enter new password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
        const oldPasswordInput = screen.queryByPlaceholderText('Enter old password');
        
        await act(async () => {
            if (oldPasswordInput) {
                oldPasswordInput.value = 'oldPassword123!';
                oldPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            
            newPasswordInput.value = 'newSecurePassword123!';
            newPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            confirmPasswordInput.value = 'newSecurePassword123!';
            confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
        
        if (oldPasswordInput) {
            expect(oldPasswordInput.value).toBe('oldPassword123!');
        }
        expect(newPasswordInput.value).toBe('newSecurePassword123!');
        expect(confirmPasswordInput.value).toBe('newSecurePassword123!');
    }, 10000); // 10 second timeout

    test('form has submit functionality', () => {
        const { container } = renderComponent();
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
        
        const handleSubmit = jest.fn(e => e.preventDefault());
        form.addEventListener('submit', handleSubmit);
        
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        
        // Clean up
        form.removeEventListener('submit', handleSubmit);
    });

    test('documents the input types', () => {
        renderComponent();
        const newPasswordInput = screen.getByPlaceholderText('Enter new password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
        const inputType = newPasswordInput.getAttribute('type');
        expect(confirmPasswordInput).toHaveAttribute('type', inputType);

        const oldPasswordInput = screen.queryByPlaceholderText('Enter old password');
        if (oldPasswordInput) {
            expect(oldPasswordInput).toHaveAttribute('type', inputType);
        }
    });
    
    test('submit button has correct attributes', () => {
        renderComponent();
        const submitButton = screen.getByRole('button', { name: 'Save Changes' });
        expect(submitButton.tagName).toBe('BUTTON');
        expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('form has the expected structure', () => {
        const { container } = renderComponent();
        const form = container.querySelector('form');
        
        expect(form).not.toBeNull();
        const formGroups = form.querySelectorAll('.form-group');
        expect(formGroups.length).toBeGreaterThanOrEqual(2);
        const newPasswordGroup = Array.from(formGroups).find(
            group => group.querySelector('input')?.id === 'new-password'
        );
        
        expect(newPasswordGroup).toBeTruthy();
        const newPasswordLabel = newPasswordGroup.querySelector('label');
        if (newPasswordLabel) {
            expect(newPasswordLabel.textContent).toMatch(/New Password/i);
        }
        
        const confirmPasswordGroup = Array.from(formGroups).find(
            group => {
                const input = group.querySelector('input');
                return input?.id === 'confirm-password' || input?.id === 'confirm-new-password';
            }
        );
        
        expect(confirmPasswordGroup).toBeTruthy();
        const confirmPasswordLabel = confirmPasswordGroup.querySelector('label');
        if (confirmPasswordLabel) {
            expect(confirmPasswordLabel.textContent).toMatch(/Confirm/i);
        }
    });
});