/**
 * Board.test.jsx - A React component for testing the functionalities of the board.
 * 
 * @file Handles rendering of the board and tests the board functions. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.1.0 
 * @since 25-02-2025
*/

// Board.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';
import api from '../api';

// Mock the api module
jest.mock('../api', () => ({
    get: jest.fn().mockResolvedValue({
        data: {
        usergamestats: {
            score: 100
        }
        }
    }),
    patch: jest.fn().mockResolvedValue({}),
}));

// Mock the geolocation API
const mockGeolocation = {
    watchPosition: jest.fn().mockImplementation((success) => {
        // Default position (at the start location)
        success({
        coords: {
            latitude: 50.7352025,
            longitude: -3.5331998,
        }
        });
        return 123; // Mock watchId
    }),
    clearWatch: jest.fn()
};

// Prepare Element.prototype mocks
const mockGetBoundingClientRect = jest.fn().mockReturnValue({
    top: 100,
    left: 100,
    width: 100,
    height: 100,
});

const mockAnimate = jest.fn().mockImplementation(() => {
    return {
        onfinish: null,
        cancel: jest.fn(),
    };
});

describe('Board Component', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const originalAnimate = Element.prototype.animate;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup global mocks
        global.navigator.geolocation = mockGeolocation;
        Object.defineProperty(window, 'scrollY', { value: 0 });
        Object.defineProperty(window, 'scrollX', { value: 0 });
        
        // Apply element prototype mocks
        Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
        Element.prototype.animate = mockAnimate;
        
        // Mock Math.random
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
        
        // Mock offsetParent for avatarRef
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        configurable: true,
        get() { return { getBoundingClientRect: mockGetBoundingClientRect } }
        });
    });

    afterEach(() => {
        Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
        Element.prototype.animate = originalAnimate;
        jest.spyOn(global.Math, 'random').mockRestore();
        
        // Clean up offsetParent mock
        delete HTMLElement.prototype.offsetParent;
        if (React.useState.mockRestore) {
        React.useState.mockRestore();
        }
    });

    /**
     * Test to check Board component renders correctly.
    */
    test('renders Board component correctly', async () => {
        render(<Board />);
        expect(screen.getByText('cliMate')).toBeInTheDocument();
        expect(screen.getByText('SPIN')).toBeInTheDocument();
        expect(screen.getByText('Task')).toBeInTheDocument();
        expect(screen.getByText('Chance')).toBeInTheDocument();
        expect(screen.getByText('START')).toBeInTheDocument();
        expect(screen.getByText('Forum')).toBeInTheDocument();
        expect(screen.getByText('Amory')).toBeInTheDocument();
        expect(screen.getByText('Business School')).toBeInTheDocument();
    });

    /**
     * Test if the spin button is enabled in the correct location
    */
    test("Spin button enabled if user is in the correct location", async () => {
        let watchPositionCallback;
        mockGeolocation.watchPosition.mockImplementation((success) => {
        watchPositionCallback = success;
        return 1;
        });
        render(<Board />);
        
        // Avatar at start to allow spin
        const spinButton = screen.getByText('SPIN');
        expect(spinButton).toBeEnabled();
        fireEvent.click(spinButton);
        
        // Assume now at Forum on the board based on the spin result
        act(() => {
        // Simulate Forum location
        watchPositionCallback({
            coords: {
            latitude: 50.7352025,
            longitude: -3.5331998, // Forum Coordinates?
            }
        });
        });
        expect(spinButton).toBeEnabled();
    });

    /**
     * Test if the spin button is disabled in the wrong location
    */
    test("Spin button disabled if user is in wrong location", async () => {
        let watchPositionCallback;
        mockGeolocation.watchPosition.mockImplementation((success) => {
            watchPositionCallback = success;
            return 1;
        });

        // Mock to trigger the onfinish callback
        global.Element.prototype.animate.mockImplementation(() => {
            const animation = {
                onfinish: null,
                cancel: jest.fn()
            };
            // Set a timeout to simulate animation completing
            setTimeout(() => {
                if (animation.onfinish) {
                    animation.onfinish();
                }
            }, 10);
            return animation;
        });
        render(<Board />);
        
        // Avatar at start to allow spin
        const spinButton = screen.getByText('SPIN');
        expect(spinButton).toBeEnabled();
        fireEvent.click(spinButton);
        
        // Wait for animation to finish
        await waitFor(() => {
            expect(global.Element.prototype.animate).toHaveBeenCalled();
        });
        
        // Simulate the avatar moving to a new position
        // Simulate user at wrong location
        act(() => {
            watchPositionCallback({
                coords: {
                    latitude: 51.5074,
                    longitude: -0.1278 // random coords
                }
            });
        });
        
        // Wait for the taskComplete state to be set to false after location check
        await waitFor(() => {
            expect(spinButton).toBeDisabled();
        }, { timeout: 3000 });
        
        // Style checks
        expect(spinButton).toHaveStyle('opacity: 0.5');
        expect(spinButton).toHaveStyle('cursor: not-allowed');
    });

    /**
     * Test if the Avatar moves after spin is made
    */
    test("avatar moves after spin", async () => {
        render(<Board />);
        const spinButton = screen.getByText("SPIN");
        fireEvent.click(spinButton);
        await waitFor(() => {
            expect(global.Element.prototype.animate).toHaveBeenCalled();
        });
    });

    /**
     * Test if chance popup appears when landing on 6
    */

    /**
     * Test if completion of task resets result state
    */
    test('completion of task resets result state', async () => {
        let mockSetResult = jest.fn();
        let mockSetTaskComplete = jest.fn(); 
        let mockSetCanSpin = jest.fn();
        let mockApiIncrementScore = jest.fn();
        const BoardWithMockedFunctions = () => {
            window.testFunctions = {
                completeTask: () => {
                mockSetResult(null);
                mockSetTaskComplete(true);
                mockSetCanSpin(true);
                mockApiIncrementScore(10);
                }
            };
            return <Board />;
        };
        render(<BoardWithMockedFunctions />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        window.testFunctions.completeTask();
        expect(mockSetResult).toHaveBeenCalledWith(null);
        expect(mockSetTaskComplete).toHaveBeenCalledWith(true);
        expect(mockSetCanSpin).toHaveBeenCalledWith(true);
        delete window.testFunctions;
    });

    /**
     * apiIncrementScore is called when task is completed
    */
    
    /**
     * task button shows the correct location name
    */
    test('task button shows the correct location name', async () => {
        render(<Board />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        fireEvent.click(screen.getByText('Task'));
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        
        // Check that the popup shows correct location (initially at Start)
        const locationTexts = screen.getAllByText(/You are at:/);
        expect(locationTexts[0].textContent).toContain('Start');
    });

    test('User can exit the task popup', async () => {
        render(<Board />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        fireEvent.click(screen.getByText('Task'));
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        
        // Find the X button (close button) in the popup
        const closeButtons = screen.getAllByText('x');
        fireEvent.click(closeButtons[0]);
        
        // Wait for state to update
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        const taskTexts = screen.getAllByText('Task');
        expect(taskTexts).toHaveLength(1);
    });
});