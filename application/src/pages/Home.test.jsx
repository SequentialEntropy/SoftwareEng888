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

/**
 * API tests:
 * 1. Verify that user details are correctly fetched and displayed
 * 2. Confirm the leaderboard data is properly rendered
 * 3. Test error handling when API calls fail
 */

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