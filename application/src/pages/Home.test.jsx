/**
 * Home.test.jsx - A React component for testing the functionalities of the home page.
 * 
 * @file Handles rendering of the home page and tests the home page functions. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 12-03-2025
*/

// Home.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import api from '../api';

// Mock the api module
jest.mock('../api', () => ({
    get: jest.fn()
}));

// Mock the CSS modules
jest.mock('../styles/Dashboard.module.css', () => ({
    main_dashboard: 'main_dashboard',
    heading: 'heading',
    sidebar: 'sidebar',
    logoContainer: 'logoContainer',
    logoText: 'logoText',
    grid: 'grid',
    item: 'item',
    profileItem: 'profileItem',
    profileIcon: 'profileIcon',
    profileName: 'profileName',
    progressBar: 'progressBar',
    points_container: 'points_container',
    pointsItem: 'pointsItem',
    pointsIcon: 'pointsIcon'
}));

describe('Home Component', () => {
    const mockCurrentUser = {
        id: 1,
        username: 'testuser',
        usergamestats: {
          current_square: 5,
          score: 100
        }
      };
      
      const mockRankedUsers = [
        {
          id: 2,
          username: 'topuser',
          usergamestats: {
            score: 500
          }
        },
        {
          id: 3,
          username: 'seconduser',
          usergamestats: {
            score: 400
          }
        },
        {
          id: 4,
          username: 'thirduser',
          usergamestats: {
            score: 300
          }
        },
        {
          id: 1, // current user
          username: 'testuser',
          usergamestats: {
            score: 100
          }
        }
      ];

    beforeEach(() => {
        jest.clearAllMocks();
        document.title = '';
        
        api.get.mockImplementation((url) => {
          if (url === '/accounts/me/') {
            return Promise.resolve({ data: mockCurrentUser });
          }
          if (url === '/accounts/ranked-users/') {
            return Promise.resolve({ data: mockRankedUsers });
          }
          return Promise.reject(new Error('Invalid URL'));
        });
    });
    /**
     * API tests:
     * 1. Verify that user details are correctly fetched and displayed
     * 2. Confirm the leaderboard data is properly rendered
     * 3. Test error handling when API calls fail
     */
    describe('API tests', () => {
        test('fetches and displays user details correctly', async () => {
            render(<Home />);
            await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/accounts/me/');
            });
            const welcomeElement = await screen.findByText(/Welcome back testuser/i);
            expect(welcomeElement).toBeInTheDocument();
            const scoreElement = await screen.findByText('100');
            expect(scoreElement).toBeInTheDocument();
        });
        
        test('fetches and displays leaderboard data correctly', async () => {
            render(<Home />);
            await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/accounts/ranked-users/');
            });
            const firstUser = await screen.findByText(/topuser - 500/i);
            expect(firstUser).toBeInTheDocument();
            const secondUser = await screen.findByText(/seconduser - 400/i);
            expect(secondUser).toBeInTheDocument();
            const thirdUser = await screen.findByText(/thirduser - 300/i);
            expect(thirdUser).toBeInTheDocument();
        });
        
        test('handles API error for user details', async () => {
        // Mock API failure
        api.get.mockImplementation((url) => {
            if (url === '/accounts/me/') {
            return Promise.reject(new Error('Failed to fetch user'));
            }
            if (url === '/accounts/ranked-users/') {
            return Promise.resolve({ data: mockRankedUsers });
            }
            return Promise.reject(new Error('Invalid URL'));
        });
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Home />);
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalled();
        });
        alertSpy.mockRestore();
        });
        
        test('handles API error for ranked users', async () => {
        // Mock API failure for ranked users
        api.get.mockImplementation((url) => {
            if (url === '/accounts/me/') {
            return Promise.resolve({ data: mockCurrentUser });
            }
            if (url === '/accounts/ranked-users/') {
            return Promise.reject(new Error('Failed to fetch ranked users'));
            }
            return Promise.reject(new Error('Invalid URL'));
        });
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Home />);
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalled();
        });
        alertSpy.mockRestore();
        });
    });

    /**
     * User display:
     * 1. Check if the welcome message correctly shows the username
     * 2. Verify the user's score is accurately displayed
     */

    /**
     * Leaderboard:
     * 1. Test for top 3 users displayed with correct colors
     * 2. Verify the user's ranking position is calculated correctly
     */

    /**
     * Navigation:
     * 1. Verify all navigation links direct to their own routes: Home, Board, Map, Profile, and Logout
     */

    /**
     * Conditional Renders:
     * 1. New user with no score
     * 2. User not in top rankings
     * 3. User who is in the top 3
     */

    /**
     * Edge Cases
     * 1. Test behavior when rankedUsers is empty
     * 2. Verify handling of undefined or null values in user data
     * 3. Check what happens when the user isn't found in the rankings
     */
});