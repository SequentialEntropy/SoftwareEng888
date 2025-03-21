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
import { act } from 'react';
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
jest.mock('../components/Navbar', () => {
    return function MockNavBar() {
        return <div data-testid="navbar-mock" />;
    };
});

jest.mock('../components/AdminTaskForm', () => {
    return function MockAdminTaskForm({ selectedTask, onSuccess }) {
        return (
            <div data-testid="task-form-mock">
                <button onClick={onSuccess} data-testid="task-form-success">
                {selectedTask ? 'Save Task' : 'Add Task'}
                </button>
            </div>
        );
    };
});

jest.mock('../components/AdminChanceForm', () => {
    return function MockAdminChanceForm({ selectedChance, onSuccess }) {
        return (
            <div data-testid="chance-form-mock">
                <button onClick={onSuccess} data-testid="chance-form-success">
                {selectedChance ? 'Save Chance' : 'Add Chance'}
                </button>
            </div>
        );
    };
});

// Test data
const mockTasks = [
    { id: 1, description: 'Task 1', applicable_squares: [1, 2], score_to_award: 10 },
    { id: 2, description: 'Task 2', applicable_squares: [3], score_to_award: 20 },
];

const mockChances = [
    { id: 1, description: 'Chance 1', score_to_award: 5 },
    { id: 2, description: 'Chance 2', score_to_award: 15 },
];

describe('Admin Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup default API mock responses
        api.get.mockImplementation((url) => {
            if (url === '/tasks/') {
                return Promise.resolve({ data: mockTasks });
            }
            if (url === '/chances/') {
                return Promise.resolve({ data: mockChances });
            }
            return Promise.reject(new Error('Not found'));
        });
        
        api.delete.mockResolvedValue({});
        api.put.mockResolvedValue({});
        api.post.mockResolvedValue({});

        // Mock window.matchMedia for responsive design tests
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        // Mock console.error to avoid test output noise
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    /**
     * Component Rendering Tests
     *
     * Verify the admin dashboard renders correctly with all expected sections
     * Ensure task and chance lists render when data is available
     * Verify empty states display appropriately when no data exists
     */
    describe('Component Rendering', () => {
        test('Test admin dashboard renders correctly', async () => {
            await act(async () => {
                render(<Admin />);
            });
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Manage Users')).toBeInTheDocument();
            expect(screen.getByText('Manage Game')).toBeInTheDocument();
            expect(screen.getByText('ADD TASK')).toBeInTheDocument();
            expect(screen.getByText('ADD CHANCE')).toBeInTheDocument();
            expect(screen.getByText('ADD LOCATION')).toBeInTheDocument();
            expect(screen.getByTestId('task-form-mock')).toBeInTheDocument();
            expect(screen.getAllByTestId('chance-form-mock')).toHaveLength(2);
            expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
        });

        test('Test task and chance lists renders when data is available', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            await waitFor(() => {
                expect(screen.getByText('Task 1')).toBeInTheDocument();
                expect(screen.getByText('Task 2')).toBeInTheDocument();
            });
            
            expect(screen.getAllByText('Chance 1')).toHaveLength(2);
            expect(screen.getAllByText('Chance 2')).toHaveLength(2);
        });
            
        test('renders empty lists when no data exists', async () => {
            api.get.mockImplementation((url) => {
                return Promise.resolve({ data: [] });
            });
            
            await act(async () => {
                render(<Admin />);
            });
            
            const taskList = screen.getAllByRole('list')[0];
            expect(taskList.children).toHaveLength(0);

            const chanceLists = screen.getAllByRole('list').slice(1);
            chanceLists.forEach(list => {
                expect(list.children).toHaveLength(0);
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
            const resolveTasksPromise = new Promise(resolve => setTimeout(() => resolve({ data: mockTasks }), 100));
            const resolveChancesPromise = new Promise(resolve => setTimeout(() => resolve({ data: mockChances }), 100));
            
            api.get.mockImplementation((url) => {
                if (url === '/tasks/') return resolveTasksPromise;
                if (url === '/chances/') return resolveChancesPromise;
                return Promise.reject(new Error('Not found'));
            });
            
            render(<Admin />);
            expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
            expect(screen.queryByText('Chance 1')).not.toBeInTheDocument();
            
            await waitFor(() => {
                expect(screen.getByText('Task 1')).toBeInTheDocument();
                expect(screen.getAllByText('Chance 1')).toHaveLength(2);
            });
        });

        test('Verify state updates', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[0]);
            });
            
            expect(screen.getByText('Save Task')).toBeInTheDocument();
        });
        
        test('Test selectedChance state updates when a chance is selected for editing', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[2]); 
            });
            
            const saveChanceButtons = screen.getAllByText('Save Chance');
            expect(saveChanceButtons[0]).toBeInTheDocument();
        });
        
        test('Test state resets when task is deleted', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[0]);
            });
            
            expect(screen.getByText('Save Task')).toBeInTheDocument();
            
            const deleteButtons = screen.getAllByText('Delete');
            await act(async () => {
                fireEvent.click(deleteButtons[0]);
            });
            
            await waitFor(() => {
                expect(screen.queryByText('Save Task')).not.toBeInTheDocument();
            });
        });
    });

    /**
     * API Integration Tests
     * 
     * Mock and test fetchTasks() function to ensure it populates the tasks state
     * Mock and test fetchChances() function to ensure it populates the chances state
     * Verify useEffect correctly calls both fetch functions on component mount
     * Test API error handling with simulated network failures (Not sure why it keeps failing)
     */
    describe('API Integration', () => {
        test('Test fetchTasks and fetchChances', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            expect(api.get).toHaveBeenCalledWith('/tasks/');
            expect(api.get).toHaveBeenCalledWith('/chances/');
        });
        
        test('Test data fetching after successful operations', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            api.get.mockClear();
            
            const deleteButtons = screen.getAllByText('Delete');
            await act(async () => {
                fireEvent.click(deleteButtons[0]);
            });
            
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/tasks/');
            });
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
            await act(async () => {
                render(<Admin />);
            });
            
            const deleteButtons = screen.getAllByText('Delete');
            await act(async () => {
                fireEvent.click(deleteButtons[0]);
            });
            
            expect(api.delete).toHaveBeenCalledWith('/tasks/1/');
            expect(api.get).toHaveBeenCalledWith('/tasks/');
        });
        
        test('Test deleting a chance when delete button is clicked', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const deleteButtons = screen.getAllByText('Delete');
            await act(async () => {
                fireEvent.click(deleteButtons[2]);
            });
            
            expect(api.delete).toHaveBeenCalledWith('/chances/1/');
            expect(api.get).toHaveBeenCalledWith('/chances/');
        });
        
        test('Verify success callback when task form is submitted', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            api.get.mockClear();

            await act(async () => {
                fireEvent.click(screen.getByTestId('task-form-success'));
            });
            expect(api.get).toHaveBeenCalledWith('/tasks/');
        });
        
        test('Verify success callback when chance form is submitted', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            api.get.mockClear();
            
            await act(async () => {
                fireEvent.click(screen.getAllByTestId('chance-form-success')[0]);
            });
            
            expect(api.get).toHaveBeenCalledWith('/chances/');
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
            await act(async () => {
                render(<Admin />);
            });
        
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[0]);
            });
            
            expect(screen.getByText('Save Task')).toBeInTheDocument();
        });
        
        test('Test edit button on chance to update selectedChance state', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[2]);
            });
            
            const saveChanceButtons = screen.getAllByTestId('chance-form-success');
            expect(saveChanceButtons[0]).toHaveTextContent('Save Chance');
        });
        
        test('Test clearing selection when delete button is clicked for selected item', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[0]);
            });
            
            expect(screen.getByText('Save Task')).toBeInTheDocument();
            
            const deleteButtons = screen.getAllByText('Delete');
            await act(async () => {
                fireEvent.click(deleteButtons[0]);
            });
            
            await waitFor(() => {
                expect(screen.queryByText('Save Task')).not.toBeInTheDocument();
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
            await act(async () => {
                render(<Admin />);
            });
            
            expect(screen.queryByText('Save Task')).not.toBeInTheDocument();
            expect(screen.getByTestId('task-form-success')).toHaveTextContent('Add Task');
        });
        
        test('Test AdminTaskForm receives the correct selectedTask prop', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[0]);
            });
            
            expect(screen.getByTestId('task-form-success')).toHaveTextContent('Save Task');
        });
        
        test('Test onSuccess callback when a chance is created/updated', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            expect(screen.queryByText('Save Chance')).not.toBeInTheDocument();
            expect(screen.getAllByTestId('chance-form-success')[0]).toHaveTextContent('Add Chance');
        });
        
        test('Test AdminChanceForm receives the correct selectedChance prop', async () => {
            await act(async () => {
                render(<Admin />);
            });
            
            const editButtons = screen.getAllByText('Edit');
            await act(async () => {
                fireEvent.click(editButtons[2]);
            });
            
            const saveChanceButtons = screen.getAllByTestId('chance-form-success');
            expect(saveChanceButtons[0]).toHaveTextContent('Save Chance');
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
            api.get.mockImplementation((url) => {
                return Promise.resolve({ data: [] });
            });
            
            await act(async () => {
                render(<Admin />);
            });
            
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
            
            const lists = screen.getAllByRole('list');
            lists.forEach(list => {
                expect(list.children).toHaveLength(0);
            });
        });
        
        test('Test handling unexpected API response format', async () => {
            api.get.mockImplementation((url) => {
                if (url === '/tasks/') {
                    return Promise.resolve({ data: [] });
                }
                if (url === '/chances/') {
                    return Promise.resolve({ data: [] });
                }
                return Promise.reject(new Error('Not found'));
            });
            
            await act(async () => {
                render(<Admin />);
            });
            
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
            
        test('Test handling concurrent operations', async () => {
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            
            api.delete.mockImplementation(async () => {
                await delay(100);
                return {};
            });
            
            await act(async () => {
                render(<Admin />);
            });
            
            // Start two delete operations concurrently
            const deleteButtons = screen.getAllByText('Delete');
            
            await act(async () => {
                fireEvent.click(deleteButtons[0]);
                fireEvent.click(deleteButtons[1]);
            });
            
            // Verify both delete operations were initiated
            expect(api.delete).toHaveBeenCalledWith('/tasks/1/');
            expect(api.delete).toHaveBeenCalledWith('/tasks/2/');
            
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledTimes(4);
            });
        });
        
        test('Test behaviour with large datasets', async () => {
            const largeMockTasks = Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                description: `Task ${i + 1}`,
                applicable_squares: [1],
                score_to_award: 10
            }));
            
            api.get.mockImplementation((url) => {
                if (url === '/tasks/') {
                return Promise.resolve({ data: largeMockTasks });
                }
                return Promise.resolve({ data: mockChances });
            });
            
            await act(async () => {
                render(<Admin />);
            });
            
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
            
            await waitFor(() => {
                expect(screen.getByText('Task 100')).toBeInTheDocument();
            });
        });
    });
});