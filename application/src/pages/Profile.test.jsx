/**
 * Profile.test.jsx - A React component for testing the profile page.
 * 
 * @file Handles the test for the profile page. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 20-03-2025
*/

/**
 * User Interaction Tests
 * Edit Functionality
 * 
 * Test clicking EDIT button enables the corresponding field
 * Verify input field becomes editable with current value pre-populated
 * Test that typing in the enabled field updates the tempUser state
 * 
 * Save Functionality
 * 
 * Verify clicking SAVE button triggers API call with correct data
 * Test successful save updates the displayed user information
 * Confirm edit mode is turned off after successful save
 * Test error handling displays appropriate messages
 * 
 * Navigation
 * 
 * Verify Reset Password link navigates to "/reset-password"
 * Test Logout link navigates to "/logout"
 * Validate Delete Account link behavior (currently incomplete)
 * 
 * Integration Tests
 * API Integration
 * 
 * Test the complete flow of fetching user data on component mount
 * Verify the update flow from editing a field to saving and displaying updated data
 * Test error scenarios and recovery paths
 * 
 * Form Submission
 * 
 * Verify form doesn't submit on button clicks (should be handled by specific functions)
 * Test that pressing Enter in input fields doesn't cause unwanted form submission
 * 
 * Edge Cases
 * Error Handling
 * 
 * Test behavior when the API is unreachable
 * Verify handling of different error response formats
 * Test displaying multiple error messages simultaneously
 * 
 * Data Validation
 * 
 * Verify input validation for email format (if implemented)
 * Test behavior with empty input fields
 * Check handling of special characters in username/email
 * 
 */

// Profile.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Profile';
import api from '../api';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui);
};

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    Link: ({ to, children, className }) => (
        <a href={to} className={className}>{children}</a>
    ),
    BrowserRouter: ({ children }) => <div>{children}</div>
}));

// Mock the API module
jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn()
}));

// Mock NavBar component
jest.mock('../components/Navbar', () => () => <div data-testid="navbar-mock">NavBar</div>);

// Mock CSS modules
jest.mock('../styles/Profile.module.css', () => ({
    main_profile: 'main_profile',
    profile_container: 'profile_container',
    profile_header: 'profile_header',
    profile_name: 'profile_name',
    profile_info: 'profile_info',
    info_row: 'info_row',
    edit: 'edit',
    line: 'line',
    logout_btn: 'logout_btn',
    deleteAccount_btn: 'deleteAccount_btn'
}));


// Test suite
describe('Profile Component', () => {
    const originalTitle = document.title;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock successful API response for get user details
        api.get.mockResolvedValue({
        data: { username: 'testuser', email: 'test@example.com' }
        });
    });
    
    afterEach(() => {
        document.title = originalTitle;
    });

    /**
     * User State Management:
     * 1. Test initial state values (empty username and email)
     * 2. Verify getUserDetails populates user state correctly
     * 3. Verify edit mode toggles correctly when handleEdit is called
     * 4. Confirm handleChange updates the tempUser state properly
     * 5. Validate handleSave updates the user state after successful API call
     */
    describe('User State Management', () => {
        test('test initial state values', () => {
            render(<Board />);
            const inputs = screen.getAllByRole('textbox');
            expect(inputs[0].value).toBe('');
            expect(inputs[1].value).toBe('');
        });

        test('Verify getUserDetails populate user state correctly', async () => {
            render(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[0].value).toBe('test@example.com');
                expect(inputs[1].value).toBe('testuser');
            });
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });

        test('Verify edit mode toggles correctly when handleEdit is called', async () => {
            render(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[1].value).toBe('testuser');
            });
            const usernameInput = screen.getAllByRole('textbox')[1];
            expect(usernameInput).toBeDisabled();
            const editButtons = screen.getAllByText('EDIT');
            fireEvent.click(editButtons[1]);
            expect(usernameInput).not.toBeDisabled();
        });

        test('Confirm handleChange updates the tempUser state properly', async () => {
            render(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[1].value).toBe('testuser');
            });
            const editButtons = screen.getAllByText('EDIT');
            fireEvent.click(editButtons[1]);
            const usernameInput = screen.getAllByRole('textbox')[1];
            fireEvent.change(usernameInput, { target: { value: 'newusername' } });
            expect(usernameInput.value).toBe('newusername');
        });

        test('Validate handleSave updates the user state after successful API call', async () => {
            api.put.mockResolvedValue({});
            render(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[1].value).toBe('testuser');
            });
            const editButtons = screen.getAllByText('EDIT');
            fireEvent.click(editButtons[1]);
            const usernameInput = screen.getAllByRole('textbox')[1];
            fireEvent.change(usernameInput, { target: { value: 'newusername' } });
            const saveButton = screen.getByText('SAVE');
            fireEvent.click(saveButton);
            await waitFor(() => {
                expect(usernameInput).toBeDisabled();
                expect(usernameInput.value).toBe('newusername');
            });
            expect(api.put).toHaveBeenCalledWith('/accounts/me/', { username: 'newusername' });
        });
    });

    /**
     * API Interactions
     * 
     * 1. Verify state updates
     * 2. Test error handling in getUserDetails
     * 3. Verify error messages are captured and displayed from API responses
     */
    describe('API Interactions', () => {
        test('Verify state updates', () => {
            render(<Board />);
            expect(api.get).toHaveBeenCalledWith('/accounts/me/');
            expect(api.get).toHaveBeenCalledTimes(1);
        });

        test('Test error handling in getUserDetails', async () => {
            const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
            api.get.mockRejectedValueOnce(new Error('Network error'));

            render(<Board />);
            await waitFor(() => {
                expect(mockAlert).toHaveBeenCalledWith('Error fetching user details: Error: Network error');
            });
            mockAlert.mockRestore();
        });

        test('Verify error messages are captured and displayed from API responses', async () => {
            // Mock successful initial API
            api.get.mockResolvedValueOnce({
                data: { username: 'testuser', email: 'test@example.com' }
            });
            
            // Mock failed API put with error message
            api.put.mockRejectedValueOnce({
                response: {
                data: { username: 'Username already taken' }
                }
            });
            
            render(<Board />);
            
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[1].value).toBe('testuser');
            });
            const editButtons = screen.getAllByText('EDIT');
            fireEvent.click(editButtons[1]);
            const usernameInput = screen.getAllByRole('textbox')[1];
            fireEvent.change(usernameInput, { target: { value: 'takenusername' } });
            const saveButton = screen.getByText('SAVE');
            fireEvent.click(saveButton);
            await waitFor(() => {
                expect(screen.getByText('Username already taken')).toBeInTheDocument();
            });
        });
    });

    /**
     * Component Rendering Tests
     * 1. Verify the component renders without crashing
     * 2. Confirm NavBar component is present
     * 3. Validate user information display when data is loaded
     * 4. Verify input fields are disabled when not in edit mode
     * 5. Confirm input fields are enabled when in edit mode
     * 6. Check that the correct button (EDIT/SAVE) displays based on edit state
     * 7. Verify error messages render correctly when present
     */
    describe('Component Rendering', () => {
        test('Verify the component renders without crashing', () => {
            render(<Board />);
            expect(screen.getByText('Log Out')).toBeInTheDocument();
            expect(screen.getByText('Delete Account')).toBeInTheDocument();
        });

        test('Test render NavBar component', () => {
            render(<Board />);
            expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
        });

        test('Test display user information when data is loaded', async () => {
            render(<Board />);
            await waitFor(() => {
                expect(screen.getByText('testuser')).toBeInTheDocument();
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[0].value).toBe('test@example.com');
                expect(inputs[1].value).toBe('testuser');
            });
        });

        test('Test disable input fields when not in edit mode', async () => {
            renderWithRouter(<Board />);
            await waitFor(() => {
              const inputs = screen.getAllByRole('textbox');
              expect(inputs[0].value).toBe('test@example.com');
              expect(inputs[1].value).toBe('testuser');
            });
            
            const inputs = screen.getAllByRole('textbox');
            expect(inputs[0]).toBeDisabled();
            expect(inputs[1]).toBeDisabled();
        });
      
        test('Test enable input fields when in edit mode', async () => {
            renderWithRouter(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[0].value).toBe('test@example.com');
            });
            
            const editButtons = screen.getAllByText('EDIT');
            fireEvent.click(editButtons[0]);
            const emailInput = screen.getAllByRole('textbox')[0];
            expect(emailInput).not.toBeDisabled();
            
            const usernameInput = screen.getAllByRole('textbox')[1];
            expect(usernameInput).toBeDisabled();
        });
      
        test('Test display EDIT button when not in edit mode', async () => {
            renderWithRouter(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[0].value).toBe('test@example.com');
            });
            
            const editButtons = screen.getAllByText('EDIT');
            expect(editButtons).toHaveLength(2);
        });
      
        test('Test display SAVE button when in edit mode', async () => {
            renderWithRouter(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[0].value).toBe('test@example.com');
            });
            
            const editButtons = screen.getAllByText('EDIT');
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByText('SAVE')).toBeInTheDocument();
            expect(screen.getAllByText('EDIT')).toHaveLength(1);
        });
      
        test('Test render error messages when present', async () => {
            // Mock successful API
            api.get.mockResolvedValueOnce({
                data: { username: 'testuser', email: 'test@example.com' }
            });
            
            // Mock failed API put with multiple errors
            api.put.mockRejectedValueOnce({
                response: {
                    data: {
                        email: 'Invalid email format',
                        username: 'Username too short'
                    }
                }
            });
            
            renderWithRouter(<Board />);
            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs[0].value).toBe('test@example.com');
            });
            const editButtons = screen.getAllByText('EDIT');
            fireEvent.click(editButtons[0]);
            const emailInput = screen.getAllByRole('textbox')[0];
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            const saveButton = screen.getByText('SAVE');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText('Invalid email format')).toBeInTheDocument();
                expect(screen.getByText('Username too short')).toBeInTheDocument();
            });
        });
    });
});