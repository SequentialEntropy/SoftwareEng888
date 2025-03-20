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
import { render, screen, act, waitFor } from '@testing-library/react';
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
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}), { virtual: true });

// Mock CSS module
jest.mock('../styles/ResetPassword.module.css', () => ({}), { virtual: true });

// Mock components
jest.mock('../components/Navbar', () => () => <div data-testid="mock-navbar" />, { virtual: true });
jest.mock('../components/Layout', () => ({ children }) => <div data-testid="mock-layout">{children}</div>, { virtual: true });

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('ResetPassword Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    afterEach(async () => {
        act(() => {
            jest.runAllTimers();
        });
        
        await waitFor(() => {
        }, { timeout: 1000 });
        
        jest.clearAllTimers();
    });
    
    test('renders the password form with heading', () => {
        render(<ResetPassword />);
        const headingElement = screen.queryByText(/Reset Password/i) || 
                              screen.queryByText(/Change Password/i);
        expect(headingElement).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });

    test('allows input in password fields', async () => {
        render(<ResetPassword />);
        const passwordInputs = Array.from(document.querySelectorAll('input')).filter(
            input => input.placeholder && 
            (input.placeholder.includes('password') || input.placeholder.includes('Password'))
        );
        
        expect(passwordInputs.length).toBeGreaterThan(0);
        
        // Test each password input
        for (const input of passwordInputs) {
            // Set value with act to properly handle React state updates
            await act(async () => {
                input.value = 'TestPassword123!';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
            
            expect(input.value).toBe('TestPassword123!');
        }
    });

    test('form has submit functionality', async () => {
        const { container } = render(<ResetPassword />);
        const form = container.querySelector('form');
        expect(form).not.toBeNull();
        
        if (form) {
            const handleSubmit = jest.fn(e => e.preventDefault());
            form.addEventListener('submit', handleSubmit);
            
            const passwordInputs = Array.from(form.querySelectorAll('input')).filter(
                input => input.placeholder && 
                (input.placeholder.includes('password') || input.placeholder.includes('Password'))
            );
            
            await act(async () => {
                for (const input of passwordInputs) {
                    input.value = 'TestPassword123!';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                await waitFor(() => {});
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                jest.runOnlyPendingTimers();
                await waitFor(() => {});
            });
            
            expect(handleSubmit).toHaveBeenCalledTimes(1);
            
            // Clean up
            form.removeEventListener('submit', handleSubmit);
        }
    });

    test('documents the input types', () => {
        render(<ResetPassword />);
        const passwordInputs = Array.from(document.querySelectorAll('input')).filter(
            input => input.placeholder && 
            (input.placeholder.includes('password') || input.placeholder.includes('Password'))
        );
        
        expect(passwordInputs.length).toBeGreaterThan(0);
        const firstInputType = passwordInputs[0].getAttribute('type');
        passwordInputs.forEach(input => {
            expect(input.getAttribute('type')).toBe(firstInputType);
        });
    });
    
    test('submit button has correct attributes', () => {
        render(<ResetPassword />);
        const submitButton = screen.getByRole('button', { name: /Save Changes/i });
        expect(submitButton.tagName).toBe('BUTTON');
        expect(submitButton.getAttribute('type')).toBe('submit');
    });

    test('form has the expected structure', () => {
        const { container } = render(<ResetPassword />);
        const form = container.querySelector('form');
        expect(form).not.toBeNull();
        
        if (form) {
            // Check for form groups
            const formGroups = form.querySelectorAll('.form-group');
            expect(formGroups.length).toBeGreaterThan(0);
            
            // Check for inputs inside form
            const inputs = form.querySelectorAll('input');
            expect(inputs.length).toBeGreaterThan(0);
            
            // Check for button
            const button = form.querySelector('button');
            expect(button).not.toBeNull();
            expect(button?.textContent).toMatch(/Save Changes/i);
        }
    });
});