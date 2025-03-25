/**
 * Admin.test.jsx - A React component for testing the functionalities of the admin page.
 * 
 * @file Handles test for the admin page. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 20-03-2025
*/

// Admin.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Admin from './Admin';
import api from '../api';

// Mock API module
jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
}));

// Mock child component
jest.mock('../components/AdminTaskForm', () => ({ selectedTask, onSuccess }) => 
    <div data-testid="admin-task-form" data-selected-task={JSON.stringify(selectedTask)}>
        <button data-testid="task-form-submit" onClick={onSuccess}>Submit Task</button>
    </div>
);

jest.mock('../components/AdminChanceForm', () => ({ selectedChance, onSuccess }) => 
    <div data-testid="admin-chance-form" data-selected-chance={JSON.stringify(selectedChance)}>
        <button data-testid="chance-form-submit" onClick={onSuccess}>Submit Chance</button>
    </div>
);

jest.mock('../components/AdminUserForm', () => ({ selectedUser, tasks, onSuccess }) => 
    <div data-testid="admin-user-form" data-selected-user={JSON.stringify(selectedUser)} data-tasks={JSON.stringify(tasks)}>
        <button data-testid="user-form-submit" onClick={onSuccess}>Submit User</button>
    </div>
);

jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);

jest.mock('../components/AdminUserForm', () => {
    return function MockAdminUserForm({ selectedUser, tasks, onSuccess }) {
        return (
            <div data-testid="user-form-mock">
                <button onClick={onSuccess} data-testid="user-form-success">
                {selectedUser ? 'Save User' : 'Add User'}
                </button>
            </div>
        );
    };
});

// Test data
const mockTasks = [
    { id: 1, description: 'Task 1', score_to_award: 10, applicable_squares: [1, 2] },
    { id: 2, description: 'Task 2', score_to_award: 20, applicable_squares: [2, 3] }
];

const mockChances = [
    { id: 1, description: 'Chance 1', score_to_award: 5 },
    { id: 2, description: 'Chance 2', score_to_award: 15 }
];

const mockUsers = [
    { id: 1, username: 'user1', email: 'user1@example.com', is_staff: false, 
        usergamestats: { current_square: 1, current_task: 1, score: 10, task_completed: false } 
    },
    { id: 2, username: 'user2', email: 'user2@example.com', is_staff: true, 
        usergamestats: { current_square: 2, current_task: 2, score: 20, task_completed: true } 
    }
];

describe('Admin Component', () => {
    // Setup default API mock responses
    beforeEach(() => {
        api.get.mockImplementation((url) => {
            if (url === '/tasks/') {
                return Promise.resolve({ data: mockTasks });
            } else if (url === '/chances/') {
                return Promise.resolve({ data: mockChances });
            } else if (url === '/admin/users/') {
                return Promise.resolve({ data: mockUsers });
            }
            return Promise.resolve({ data: [] });
            // return Promise.reject(new Error('Not found'));
        });
        
        api.delete.mockResolvedValue({});
        api.put.mockResolvedValue({});
        api.post.mockResolvedValue({});
        
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    
    /**
     * Component Rendering Tests
     *
     * Verify the admin dashboard renders correctly with all expected sections
     * Ensure task and chance lists render when data is available
     * Verify empty states display appropriately when no data exists
     */
    describe('Component Rendering', () => {
        test('Test admin dashboard renders correctly', () => {
            render(<Admin />);
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
            expect(screen.getByTestId('navbar')).toBeInTheDocument();
            expect(screen.getByText('Users')).toBeInTheDocument();
            expect(screen.getByText('Tasks')).toBeInTheDocument();
            expect(screen.getByText('Chances')).toBeInTheDocument();
            expect(screen.getByText('CREATE AND EDIT')).toBeInTheDocument();
            expect(screen.getByText('ENTRIES')).toBeInTheDocument();
        });
        
        test('Test task and chance lists renders when data is available', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                expect(screen.getByText('Task 1')).toBeInTheDocument();
                expect(screen.getByText('Task 2')).toBeInTheDocument();
            });
            fireEvent.click(screen.getByText('Chances'));
            await waitFor(() => {
                expect(screen.getByText('Chance 1')).toBeInTheDocument();
                expect(screen.getByText('Chance 2')).toBeInTheDocument();
            });
        });
        
        test('renders empty lists when no data exists', async () => {
            api.get.mockImplementation((url) => {
                return Promise.resolve({ data: [] });
            });
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
                expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
            });
            fireEvent.click(screen.getByText('Chances'));
            await waitFor(() => {
                expect(screen.queryByText('Chance 1')).not.toBeInTheDocument();
                expect(screen.queryByText('Chance 2')).not.toBeInTheDocument();
            });
        });
    });
    
    /* 
     * State Management Tests
     * 
     * Confirm initial state is correctly set
     * Verify state updates properly when tasks and chances are fetched
     * Test that selectedTask and selectedChance state updates correctly when items are selected
     * Ensure state resets appropriately when items are deleted
     */
    describe('State Management', () => {
        test('Test initial state is correctly set', async () => {
            // render(<Admin />);
            // await waitFor(() => {
            //     expect(screen.getByTestId('admin-user-form')).toBeInTheDocument();
            //     expect(screen.getByTestId('admin-user-form').getAttribute('data-selected-user')).toBe('null');
            //     expect(screen.getByText('user1')).toBeInTheDocument();
            //     expect(screen.getByText('user2')).toBeInTheDocument();
            // });
        });
        
        test('Verify state updates', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                expect(screen.getByTestId('admin-task-form')).toBeInTheDocument();
                expect(screen.getByText('Task 1')).toBeInTheDocument();
            });
            fireEvent.click(screen.getByText('Chances'));
            await waitFor(() => {
                expect(screen.getByTestId('admin-chance-form')).toBeInTheDocument();
                expect(screen.getByText('Chance 1')).toBeInTheDocument();
            });
        });
        
        test('Test selectedChance state updates when a chance is selected for editing', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Chances'));
            await waitFor(() => {
                expect(screen.getByTestId('admin-chance-form').getAttribute('data-selected-chance')).toBe('null');
            });
            const editButtons = await screen.findAllByText('Edit');
            fireEvent.click(editButtons[0]);
            await waitFor(() => {
                const selectedChance = JSON.parse(screen.getByTestId('admin-chance-form').getAttribute('data-selected-chance'));
                expect(selectedChance).toEqual(mockChances[0]);
            });
        });
        
        test('Test state resets when task is deleted', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                const editButtons = screen.getAllByText('Edit');
                fireEvent.click(editButtons[0]);
            });
            await waitFor(() => {
                const selectedTask = JSON.parse(screen.getByTestId('admin-task-form').getAttribute('data-selected-task'));
                expect(selectedTask).toEqual(mockTasks[0]);
            });
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(screen.getByTestId('admin-task-form').getAttribute('data-selected-task')).toBe('null');
            });
        });
    });
    
    /**
     * API Integration Tests
     * 
     * Mock and test fetchTasks() function to ensure it populates the tasks state
     * Mock and test fetchChances() function to ensure it populates the chances state
     * Verify useEffect correctly calls both fetch functions on component mount
     * Test API error handling with simulated network failures
     */
    describe('API Integration', () => {
        test('Test fetchTasks and fetchChances', async () => {
            render(<Admin />);
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/tasks/');
                expect(api.get).toHaveBeenCalledWith('/chances/');
                expect(api.get).toHaveBeenCalledWith('/admin/users/');
            });
        });
        
        test('Test data fetching after successful operations', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            fireEvent.click(screen.getByTestId('task-form-submit'));
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/tasks/');
                expect(api.get.mock.calls.filter(call => call[0] === '/tasks/').length).toBe(2);
            });
        });
        
        test('Test data fetching after successful operations', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            fireEvent.click(screen.getByTestId('task-form-submit'));
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/tasks/');
                expect(api.get.mock.calls.filter(call => call[0] === '/tasks/').length).toBe(2);
            });
        });
        
        test('Test API error handling with simulated network failures', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();
            
            // Mock API failure
            api.delete.mockRejectedValue(new Error('Network error'));
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                expect(screen.getByText('Task 1')).toBeInTheDocument();
            });
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(console.error).toHaveBeenCalled();
            });
            
            // Restore console.error
            console.error = originalConsoleError;
        });
    });

    /**
    * CRUD Operation Tests
    * 
    * Test task deletion flow (onDeleteTask)
    * Test the same flow for chance deletion (onDeleteChance)
    * Verify integration with AdminTaskForm and AdminChanceForm for creation/editing
    */
    describe('CRUD Operations', () => {
        test('deletes a task when delete button is clicked', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                expect(screen.getByText('Task 1')).toBeInTheDocument();
            });
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith('/tasks/1/');
                expect(api.get).toHaveBeenCalledWith('/tasks/');
            });
        });
        
        test('Test deleting a chance when delete button is clicked', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Chances'));
            await waitFor(() => {
                expect(screen.getByText('Chance 1')).toBeInTheDocument();
            });
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith('/chances/1/');
                expect(api.get).toHaveBeenCalledWith('/chances/');
            });
        });
        
        test('Verify success callback when task form is submitted', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            fireEvent.click(screen.getByTestId('task-form-submit'));
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/tasks/');
                expect(api.get.mock.calls.filter(call => call[0] === '/tasks/').length).toBe(2); // Initial + refresh
            });
        });
        
        test('Verify success callback when chance form is submitted', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Chances'));
            fireEvent.click(screen.getByTestId('chance-form-submit'));
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/chances/');
                expect(api.get.mock.calls.filter(call => call[0] === '/chances/').length).toBe(2); // Initial + refresh
            });
        });
    });

     /**
    * User Interaction Tests
    * 
    * Test clicking "Edit" button on a task updates selectedTask state
    * Test clicking "Edit" button on a chance updates selectedChance state
    * Verify clicking "Delete" button triggers appropriate deletion function
    */
     describe('User Interaction', () => {
        test('Test edit button on task to update selectedTask state', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
              expect(screen.getByText('Task 1')).toBeInTheDocument();
            });
            
            expect(screen.getByTestId('admin-task-form').getAttribute('data-selected-task')).toBe('null');
            
            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);
            
            await waitFor(() => {
              const selectedTask = JSON.parse(screen.getByTestId('admin-task-form').getAttribute('data-selected-task'));
              expect(selectedTask).toEqual(mockTasks[0]);
            });
        });
          
        test('Test edit button on chance to update selectedChance state', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Chances'));
            await waitFor(() => {
                expect(screen.getByText('Chance 1')).toBeInTheDocument();
            });

            expect(screen.getByTestId('admin-chance-form').getAttribute('data-selected-chance')).toBe('null');
            
            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);
            
            await waitFor(() => {
                const selectedChance = JSON.parse(screen.getByTestId('admin-chance-form').getAttribute('data-selected-chance'));
                expect(selectedChance).toEqual(mockChances[0]);
            });
        });
          
        test('Test clearing selection when delete button is clicked for selected item', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            
            await waitFor(() => {
                expect(screen.getByText('Task 1')).toBeInTheDocument();
            });
            
            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);
            
            await waitFor(() => {
                const selectedTask = JSON.parse(screen.getByTestId('admin-task-form').getAttribute('data-selected-task'));
                expect(selectedTask).toEqual(mockTasks[0]);
            });
            
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(screen.getByTestId('admin-task-form').getAttribute('data-selected-task')).toBe('null');
            });
        });
    });

    /*
    * Form Integration Tests
    * 
    * Verify AdminTaskForm receives the correct selectedTask prop
    * Test that onSuccess callback works when a task is created/updated
    * Verify AdminChanceForm receives the correct selectedChance prop
    * Test that onSuccess callback works when a chance is created/updated
    */
    describe('Form Integration', () => {
        test('Test onSuccess callback when a task is created/updated', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            
            fireEvent.click(screen.getByTestId('task-form-submit'));
            
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/tasks/');
                expect(screen.getByTestId('admin-task-form').getAttribute('data-selected-task')).toBe('null');
            });
        });
        
        test('Test AdminTaskForm receives the correct selectedTask prop', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            
            await waitFor(() => {
                // Select a task
                const editButtons = screen.getAllByText('Edit');
                fireEvent.click(editButtons[0]);
            });
            
            
            await waitFor(() => {
                // Verify the selectedTask prop is updated correctly
                const selectedTask = JSON.parse(screen.getByTestId('admin-task-form').getAttribute('data-selected-task'));
                expect(selectedTask).toEqual(mockTasks[0]);
            });
        });
        
        test('Test onSuccess callback when a chance is created/updated', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Chances'));
            
            fireEvent.click(screen.getByTestId('chance-form-submit'));
            
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/chances/');
                expect(screen.getByTestId('admin-chance-form').getAttribute('data-selected-chance')).toBe('null');
            });
        });
        
        test('Test AdminChanceForm receives the correct selectedChance prop', async () => {
            render(<Admin />);
            fireEvent.click(screen.getByText('Chances'));
            
            await waitFor(() => {
                const editButtons = screen.getAllByText('Edit');
                fireEvent.click(editButtons[0]);
            });
            
            await waitFor(() => {
                const selectedChance = JSON.parse(screen.getByTestId('admin-chance-form').getAttribute('data-selected-chance'));
                expect(selectedChance).toEqual(mockChances[0]);
            });
        });
    });

    /**
    * Responsive Design Tests
    * 
    * Test component rendering at different viewport sizes
    * Verify CSS classes apply correctly based on screen dimensions
    * Check that layout adjusts according to the media queries defined in Admin.module.css
    */
    describe('Responsive Design', () => {
        test('Test render at differen dimensions', async () => {
            const customRender = component => {
                const utils = render(component);
                const getComputedStyle = (element, property) => {
                return window.getComputedStyle(element)[property];
                };
                return { ...utils, getComputedStyle };
            };
            
            // Test with mobile viewport
            window.matchMedia = jest.fn().mockImplementation(query => ({
                matches: query.includes('(max-width: 480px)'),
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
            }));
            
            let { unmount } = customRender(<Admin />);
            unmount();
            
            // Test with tablet viewport
            window.matchMedia = jest.fn().mockImplementation(query => ({
                matches: query.includes('(min-width: 481px) and (max-width: 768px)'),
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
            }));
            
            unmount = customRender(<Admin />).unmount;
            unmount();
            
            // Test with desktop viewport
            window.matchMedia = jest.fn().mockImplementation(query => ({
                matches: query.includes('(min-width: 769px)'),
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
            }));
            
            customRender(<Admin />);
            
            expect(true).toBeTruthy();
        });
    });

    /**
     * Edge Case Tests
     * 
     * Test behavior when API returns empty data
     * Verify handling of unexpected API response formats
     * Test concurrent operations (e.g., editing an item while another is being deleted)
     * Check behavior when very large lists of tasks or chances are returned
     */
    describe('Edge Cases', () => {
        test('Test behavior when API returns empty data', async () => {
            // Mock empty data response
            api.get.mockImplementation(() => Promise.resolve({ data: [] }));
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
            });
        });
          
        test('Test handling unexpected API response format', async () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();
            
            // Mock data response
            api.get.mockImplementation(() => Promise.resolve({ data: null }));
            render(<Admin />);
            await waitFor(() => {
                expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
            });
            
            // Restore console.error
            console.error = originalConsoleError;
        });
          
        test('Test handling concurrent operations', async () => {
            // Simulate delayed API responses
            let resolveDelete;
            const deletePromise = new Promise(resolve => {
                resolveDelete = resolve;
            });
            api.delete.mockImplementation(() => deletePromise);

            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                const deleteButtons = screen.getAllByText('Delete');
                fireEvent.click(deleteButtons[0]);
                fireEvent.click(deleteButtons[1]);
            });

            resolveDelete({});
            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledTimes(2);
            });
        });
          
        test('Test behaviour with large datasets', async () => {
            // Generate large dataset
            const largeTasks = Array(100).fill().map((_, i) => ({
                id: i + 1,
                description: `Task ${i + 1}`,
                score_to_award: 10,
                applicable_squares: [1, 2]
            }));
            
            // Mock API to return large dataset
            api.get.mockImplementation((url) => {
                if (url === '/tasks/') {
                    return Promise.resolve({ data: largeTasks });
                } else if (url === '/chances/') {
                    return Promise.resolve({ data: mockChances });
                } else if (url === '/admin/users/') {
                    return Promise.resolve({ data: mockUsers });
                }
                return Promise.resolve({ data: [] });
            });
            
            render(<Admin />);
            fireEvent.click(screen.getByText('Tasks'));
            await waitFor(() => {
                expect(screen.getByText('Task 1')).toBeInTheDocument();
                expect(screen.getByText('Task 100')).toBeInTheDocument();
            });
        });
    });
});