/**
 * Admin.test.jsx - A React component for testing the functionalities of the admin page.
 * 
 * @file Handles test for the admin page. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 20-03-2025
*/

/**
 * Component Rendering Tests
 *
 * Verify the admin dashboard renders correctly with all expected sections
 * Check that headings, panels, and navigation elements display properly
 * Ensure task and chance lists render when data is available
 * Verify empty states display appropriately when no data exists
 * 
 * State Management Tests
 * 
 * Confirm initial state is correctly set (empty arrays for tasks and chances)
 * Verify state updates properly when tasks and chances are fetched
 * Test that selectedTask and selectedChance state updates correctly when items are selected
 * Ensure state resets appropriately when items are deleted
 * 
 * API Integration Tests
 * 
 * Mock and test fetchTasks() function to ensure it populates the tasks state
 * Mock and test fetchChances() function to ensure it populates the chances state
 * Verify useEffect correctly calls both fetch functions on component mount
 * Test API error handling with simulated network failures
 * 
 * CRUD Operation Tests
 * 
 * Test task deletion flow (onDeleteTask):
 *  Verify API call is made with correct task ID
 *  Ensure tasks list is refreshed after successful deletion
 *  Check that selectedTask is cleared if the deleted task was selected
 *  Verify error handling works when deletion fails
 * 
 * Test the same flow for chance deletion (onDeleteChance)
 * Verify integration with AdminTaskForm and AdminChanceForm for creation/editing
 * 
 * User Interaction Tests
 * 
 * Test clicking "Edit" button on a task updates selectedTask state
 * Test clicking "Edit" button on a chance updates selectedChance state
 * Verify clicking "Delete" button triggers appropriate deletion function
 * Test that the NavBar component receives proper props and functions
 * 
 * Form Integration Tests
 * 
 * Verify AdminTaskForm receives the correct selectedTask prop
 * Test that onSuccess callback works when a task is created/updated
 * Verify AdminChanceForm receives the correct selectedChance prop
 * Test that onSuccess callback works when a chance is created/updated
 * 
 * Responsive Design Tests
 * 
 * Test component rendering at different viewport sizes
 * Verify CSS classes apply correctly based on screen dimensions
 * Check that layout adjusts according to the media queries defined in Admin.module.css
 * 
 * Edge Case Tests
 * 
 * Test behavior when API returns empty data
 * Verify handling of unexpected API response formats
 * Test concurrent operations (e.g., editing an item while another is being deleted)
 * Check behavior when very large lists of tasks or chances are returned
 */