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
import React, { act } from 'react';
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
        test('fetch and display user details correctly', async () => {
            render(<Home />);
            await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/accounts/me/');
            });
            const welcomeElement = await screen.findByText(/Welcome back testuser/i);
            expect(welcomeElement).toBeInTheDocument();
            const scoreElement = await screen.findByText('100');
            expect(scoreElement).toBeInTheDocument();
        });
        
        test('fetch and display leaderboard data correctly', async () => {
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
        
        test('handle API error for user details', async () => {
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
        
        test('handle API error for ranked users', async () => {
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
    describe('User display tests', () => {
        test('Welcome message displays correct username', async () => {
            render(<Home />);
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith("/accounts/me/");
            });
            await waitFor(() => {
                expect(screen.getByText(/Welcome back testuser/i)).toBeInTheDocument();
            });
              expect(api.get).toHaveBeenCalledWith("/accounts/me/");
              expect(api.get).toHaveBeenCalledWith("/accounts/ranked-users/");
        });

        test('User score displayed accurately', async () => {
            render(<Home />);
            await waitFor(() => {
                expect(screen.getByText("100")).toBeInTheDocument();
            });
            expect(api.get).toHaveBeenCalledWith("/accounts/me/");
            expect(api.get).toHaveBeenCalledWith("/accounts/ranked-users/");
        });
    });

    /**
     * Leaderboard:
     * 1. Test for top 3 users displayed with correct colors
     * 2. Verify the user's ranking position is calculated correctly
     */
    describe('Leaderboard tests', () => {
        test('display top 3 users with correct colors', async () => {
            render(<Home />);
            await waitFor(() => {
              expect(api.get).toHaveBeenCalledWith('/accounts/ranked-users/');
            });
            await screen.findByText(/topuser - 500/i);
            const profileTexts = screen.getAllByText(/\w+ - \d+/i);
            expect(profileTexts).toHaveLength(3);
            expect(profileTexts[0].textContent).toBe('topuser - 500');
            expect(profileTexts[1].textContent).toBe('seconduser - 400');
            expect(profileTexts[2].textContent).toBe('thirduser - 300');
            const leaderboardItems = profileTexts.map(item => item.closest('.profileItem'));
            expect(leaderboardItems[0]).toHaveStyle({backgroundColor: '#EA526F'});
            expect(leaderboardItems[1]).toHaveStyle({backgroundColor: '#7F95D1'});
            expect(leaderboardItems[2]).toHaveStyle({backgroundColor: '#558564'});
        });
        
        test('calculate and display user ranking correctly', async () => {
            render(<Home />);
            await waitFor(() => {
                expect(screen.getByText('You are at: Position #4')).toBeInTheDocument();
            });
        });
    });
    

    /**
     * Navigation:
     * 1. Verify all navigation links direct to their own routes: Home, Board, Map, Profile, and Logout
     */
    describe('Navigation test', () => {
        test('verify navigation links', async () => {
            render(<Home />);
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/accounts/me/');
                expect(api.get).toHaveBeenCalledWith('/accounts/ranked-users/');
            });
            const navLinks = screen.getAllByRole('link');
  
            const homeLink = navLinks.find(link => link.getAttribute('href') === 'home');
            expect(homeLink).toBeInTheDocument();
            expect(homeLink.querySelector('.bi-house-door-fill')).toBeInTheDocument();
            
            const boardLink = navLinks.find(link => link.getAttribute('href') === 'board');
            expect(boardLink).toBeInTheDocument();
            expect(boardLink.querySelector('.bi-dice-3-fill')).toBeInTheDocument();

            const mapLink = navLinks.find(link => link.getAttribute('href') === 'map');
            expect(mapLink).toBeInTheDocument();
            expect(mapLink.querySelector('.bi-map-fill')).toBeInTheDocument();
            
            const profileLink = navLinks.find(link => link.getAttribute('href') === 'profile');
            expect(profileLink).toBeInTheDocument();
            expect(profileLink.querySelector('.bi-person-circle')).toBeInTheDocument();
            
            const logoutLink = navLinks.find(link => link.getAttribute('href') === 'logout');
            expect(logoutLink).toBeInTheDocument();
            expect(logoutLink.querySelector('.bi-box-arrow-right')).toBeInTheDocument();
        });
    });

    /**
     * Conditional Renders:
     * 1. New user with no score
     * 2. User not in top rankings
     * 3. User who is in the top 3
     */
    describe('Conditional renders test', () => {
        test('new user with no score displays', async () => {
            const mockNewUser = {
                id: 5, // Mock new users
                username: 'newuser',
                usergamestats: {
                  current_square: 0,
                  score: 0
                }
            };
            api.get.mockImplementation((url) => {
                if (url === '/accounts/me/') {
                  return Promise.resolve({ data: mockNewUser });
                }
                if (url === '/accounts/ranked-users/') {
                  return Promise.resolve({ data: [] });  // Empty rankings for simplicity
                }
                return Promise.reject(new Error('Invalid URL'));
            });
            render(<Home />);
            await waitFor(() => {
                expect(screen.getByText(/Welcome back newuser/i)).toBeInTheDocument();
            });
            const scoreElement = await screen.findByText('0');
            expect(scoreElement).toBeInTheDocument();
            expect(api.get).toHaveBeenCalledWith('/accounts/me/');
            expect(api.get).toHaveBeenCalledWith('/accounts/ranked-users/');

            const positionElement = await screen.findByText('You are at: Position #0');
            expect(positionElement).toBeInTheDocument();
        });
        
        test('user not in top rankings not displayed in top 3', async () => {
            render(<Home />);
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/accounts/me/');
                expect(api.get).toHaveBeenCalledWith('/accounts/ranked-users/');
            });
            const welcomeElement = await screen.findByText('Welcome back testuser');
            expect(welcomeElement).toBeInTheDocument();
            
            const scoreElement = await screen.findByText('100');
            expect(scoreElement).toBeInTheDocument();

            expect(screen.getByText('topuser - 500')).toBeInTheDocument();
            expect(screen.getByText('seconduser - 400')).toBeInTheDocument();
            expect(screen.getByText('thirduser - 300')).toBeInTheDocument();
            expect(screen.queryByText('testuser - 100')).not.toBeInTheDocument();

            const positionElement = await screen.findByText('You are at: Position #4');
            expect(positionElement).toBeInTheDocument();
        });


        // test('user who is in the top 3', async () => {
        // });
    });

    /**
     * Edge Cases
     * 1. Test behavior when rankedUsers is empty
     * 2. Verify handling of undefined or null values in user data
     * 3. Check what happens when the user isn't found in the rankings
     */
    describe('Edge case tests', () => {
        test('handles empty rankedUsers array', async () => {
            api.get.mockImplementation((url) => {
                if (url === '/accounts/me/') {
                return Promise.resolve({ data: mockCurrentUser });
                }
                if (url === '/accounts/ranked-users/') {
                return Promise.resolve({ data: [] });
                }
                return Promise.reject(new Error('Invalid URL'));
            });
            render(<Home />);
            await waitFor(() => {
                expect(screen.getByText('You are at: Position #0')).toBeInTheDocument();
            });
        });
        
        test('handles undefined or null values in user data', async () => {
            const userWithNullValues = {
                id: 6,
                username: null,
                usergamestats: {
                    current_square: 0,
                    score: 0 
                }
            };
            
            api.get.mockImplementation((url) => {
                if (url === '/accounts/me/') {
                    return Promise.resolve({ data: userWithNullValues });
                }
                if (url === '/accounts/ranked-users/') {
                    return Promise.resolve({ data: mockRankedUsers });
                }
                return Promise.reject(new Error('Invalid URL'));
            });
            render(<Home />);
            await waitFor(() => {
              expect(api.get).toHaveBeenCalledWith('/accounts/me/');
            });
            const welcomeMessage = await screen.findByText(/Welcome back/i);
            expect(welcomeMessage).toBeInTheDocument();
            const scoreElement = await screen.findByText('0');
            expect(scoreElement).toBeInTheDocument();
        });
        
        test('handles user not found in rankings', async () => {
            const unrankedUser = {
              id: 99, // ID not in ranked users list
              username: 'unrankeduser',
              usergamestats: {
                current_square: 1,
                score: 10
              }
            };
            
            api.get.mockImplementation((url) => {
              if (url === '/accounts/me/') {
                return Promise.resolve({ data: unrankedUser });
              }
              if (url === '/accounts/ranked-users/') {
                return Promise.resolve({ data: mockRankedUsers }); // Doesn't include unrankedUser
              }
              return Promise.reject(new Error('Invalid URL'));
            });
            
            render(<Home />);
            
            await waitFor(() => {
              // Since user not found in rankings, position should be 0
              expect(screen.getByText('You are at: Position #0')).toBeInTheDocument();
            });
        });
    });
});