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
import { render, screen, fireEvent, act, waitFor} from "@testing-library/react";
import Board from "./Board";
import "@testing-library/jest-dom";  


// Mock geolocation for disabling spin in wrong location
const mockGeolocation = {
    watchPosition: jest.fn(),
    clearWatch: jest.fn()
};

global.navigator.geolocation = mockGeolocation;

// Mock getBoundingClientRect for all elements
Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(() => {
    return {
      width: 120,
      height: 120,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };
});

Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    get() { return document.createElement('div'); }
});

describe("Board Component", () => {
    beforeAll(() => {
        // Mock animation functions to prevent errors
        global.Element.prototype.animate = jest.fn(() => ({
            onfinish: jest.fn(),
            cancel: jest.fn(),
        }));

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test to check Board component renders correctly.
    */
    test("renders Board component correctly", () => {
        render(<Board />);
        expect(screen.getByText("cliMate")).toBeInTheDocument();
        expect(screen.getByText("SPIN")).toBeInTheDocument();
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
    test("chance popup appears when landing on 6", async () => {
        jest.setTimeout(10000);
        
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
        
        // Mock of wheelOfFortune
        const originalMath = Object.create(global.Math);
        const mockMath = Object.create(global.Math);

        // Always land on 6
        mockMath.random = () => 0.5;
        mockMath.floor = function(x) {
            if (x >= 0 && x < 12) {
                return 2;
            }
            return originalMath.floor(x);
        };
        global.Math = mockMath;
        render(<Board />);
        const spinButton = screen.getByText("SPIN");
        fireEvent.click(spinButton);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
        });
        
        // Wait with specific timeout for chance popup to appear
        await waitFor(() => {
            const pointsText = screen.queryByText("+5 Points!");
            if (!pointsText) console.warn("Chance popup not found yet...");
            expect(pointsText).toBeInTheDocument();
        }, { timeout: 2000 });
        
        // Restore the original Math object
        global.Math = originalMath;
    }, 10000);

    /**
     * Test if completion of task resets result state
    */
    test("task completion resets result state", async () => {
        render(<Board />);
        const spinButton = screen.getByText("SPIN");
        await act(async () => {
            fireEvent.click(spinButton);
        });
        setTimeout(() => {
            const okButton = screen.getByText("OK");
            fireEvent.click(okButton);
            expect(screen.queryByText(/You are at:/)).not.toBeInTheDocument();
        }, 4000);
    });
});
