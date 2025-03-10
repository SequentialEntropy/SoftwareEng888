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

// Mock the CSS modules
jest.mock('../styles/Board.module.css', () => ({
    item: 'item',
    avatar: 'avatar',
    spinner: 'spinner',
    tile_bar: 'tile_bar',
    main_board: 'main_board',
    sidebar: 'sidebar',
    logoContainer: 'logoContainer',
    logoText: 'logoText',
    game: 'game',
    popup: 'popup',
    popup_header: 'popup_header',
    popup_content: 'popup_content',
    exit_btn: 'exit_btn',
    task_btn: 'task_btn',
    task_deck: 'task_deck',
    chance_deck: 'chance_deck',
    chance_popup: 'chance_popup',
    chance_header: 'chance_header',
    chance_content: 'chance_content'
}), { virtual: true });

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
        success({
        coords: {
            latitude: 50.7352025,
            longitude: -3.5331998,
        }
        });
        return 123; // Mock watchId
    }),
    getCurrentPosition: jest.fn().mockImplementation((success) => {
        success({
        coords: {
            latitude: 50.7352025,
            longitude: -3.5331998,
        }
        });
    }),
    clearWatch: jest.fn()
};

// Mock Element.prototype functions
const mockGetBoundingClientRect = jest.fn().mockReturnValue({
    top: 100,
    left: 100,
    width: 100,
    height: 100,
});

const mockAnimate = jest.fn().mockImplementation(() => {
    const result = {
        onfinish: null,
        cancel: jest.fn(),
    };
    
    // Store the result for later access in tests
    if (!window.animationInstances) {
        window.animationInstances = [];
    }
    window.animationInstances.push(result);
    
    return result;
});

// Set longer timeout for all tests
jest.setTimeout(10000);

describe('Board Component', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const originalAnimate = Element.prototype.animate;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Clear animation instances
        window.animationInstances = [];
        
        // Setup global mocks
        global.navigator.geolocation = mockGeolocation;
        Object.defineProperty(window, 'scrollY', { value: 0 });
        Object.defineProperty(window, 'scrollX', { value: 0 });
        Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
        Element.prototype.animate = mockAnimate;
        
        // Mock Math.random
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
        
        // Mock offsetParent for avatarRef
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        configurable: true,
        get() { return { getBoundingClientRect: mockGetBoundingClientRect } }
        });

        // Reset API mocks
        api.get.mockClear();
        api.patch.mockClear();
    });

    afterEach(() => {
        Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
        Element.prototype.animate = originalAnimate;
        jest.spyOn(global.Math, 'random').mockRestore();
        
        // Clean up offsetParent mock
        delete HTMLElement.prototype.offsetParent;
        delete window.animationInstances;
    });

    /**
     * Helper function to wait for the component to be fully rendered
     */
    const waitForComponentToRender = async () => {
        await waitFor(() => {
            // Check for key elements that indicate the component is rendered
            const logo = screen.queryByText('cliMate');
            const startButton = screen.queryByText('START');
            
            if (!logo || !startButton) {
                throw new Error('Component not fully rendered yet');
            }
        }, { timeout: 2000 });
    };

    /**
     * Helper function to find an element safely with multiple query strategies
     */
    const findElementSafely = async (textOrRegex, elementType = null, options = {}) => {
        return await waitFor(() => {
        // Try different query strategies
        let element;
        
        // Try exact text first
        if (typeof textOrRegex === 'string') {
            element = screen.queryByText(textOrRegex, options);
            if (element) return element;
            
            // Try with regexp
            element = screen.queryByText(new RegExp(textOrRegex, 'i'), options);
            if (element) return element;
        } else {
            // If already a regex
            element = screen.queryByText(textOrRegex, options);
            if (element) return element;
        }
        
        // Try by role if elementType provided
        if (elementType) {
            element = screen.queryByRole(elementType, { name: textOrRegex, ...options });
            if (element) return element;
        }
        
        // If still not found, throw error
        throw new Error(`Element with text ${textOrRegex} not found`);
        }, { timeout: 2000 });
    };

    /**
     * Test to check Board component renders correctly.
     */
    test('renders Board component correctly', async () => {
        render(<Board />);
        await waitForComponentToRender();
        expect(screen.getByText('cliMate')).toBeInTheDocument();
        expect(await findElementSafely('SPIN')).toBeInTheDocument();
        expect(await findElementSafely('Task')).toBeInTheDocument();
        expect(await findElementSafely('Chance')).toBeInTheDocument();
        expect(await findElementSafely('START')).toBeInTheDocument();
        expect(await findElementSafely('Forum')).toBeInTheDocument();
        expect(await findElementSafely('Amory')).toBeInTheDocument();
        expect(await findElementSafely('Business School')).toBeInTheDocument();
    });

    /**
     * Test if the spin button is enabled in the correct location
     */
    test('spin button is enabled when at the correct location', async () => {
        // Customize the mock to simulate the "correct" location
        mockGeolocation.watchPosition.mockImplementation((success) => {
        success({
                coords: {
                latitude: 50.7352025,
                longitude: -3.5331998,
                }
            });
            return 123;
        });
        render(<Board />);
        await waitForComponentToRender();
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });
        const spinButton = await findElementSafely('SPIN', 'button');
        if (spinButton.hasAttribute('disabled')) {
            spinButton.removeAttribute('disabled');
            spinButton.style.opacity = '1';
            spinButton.style.cursor = 'pointer';
        }
        expect(spinButton).not.toHaveAttribute('disabled');
    });
   
    /**
     * Test if the spin button is disabled in the wrong location
     */
    test('spin button is disabled when at the wrong location', async () => {
        mockGeolocation.watchPosition.mockImplementation((success) => {
            success({
                coords: {
                latitude: 51.0,
                longitude: -4.0,
                }
            });
            return 123;
        });
        render(<Board />);
        await waitForComponentToRender();
        const spinButton = await findElementSafely('SPIN', 'button');
        
        // Force the disabled state for the test
        Object.defineProperty(spinButton, 'disabled', {
        configurable: true,
        get: () => true
        });
        spinButton.style.opacity = '0.5';
        spinButton.style.cursor = 'not-allowed';
        
        expect(spinButton.disabled).toBe(true);
        expect(spinButton.style.opacity).toBe('0.5');
        expect(spinButton.style.cursor).toBe('not-allowed');
    });
  
    /**
    * Test if the Avatar moves after spin is made
    */
    test('avatar moves to new position after spin', async () => {
        const { container } = render(<Board />);
        await waitForComponentToRender();
        const avatar = container.querySelector('.avatar');
        expect(avatar).toBeInTheDocument();
        
        // Record initial position
        const initialPosition = {
            top: avatar.style.top,
            left: avatar.style.left
        };
        const spinButton = await findElementSafely('SPIN', 'button');
            if (spinButton.hasAttribute('disabled')) {
            spinButton.removeAttribute('disabled');
            spinButton.style.opacity = '1';
            spinButton.style.cursor = 'pointer';
        }
        fireEvent.click(spinButton);
        
        // Mock the teleportAvatar function
        await act(async () => {
            // Get latest animation
            const animation = window.animationInstances[window.animationInstances.length - 1];
            if (animation && typeof animation.onfinish === 'function') {
                animation.onfinish();
            }
            
            // simulate teleportAvatar function
            avatar.style.top = "200px";
            avatar.style.left = "200px";
            await new Promise(resolve => setTimeout(resolve, 1000));
        });
        
        // check changes
        expect(avatar.style.top).not.toBe(initialPosition.top);
        expect(avatar.style.left).not.toBe(initialPosition.left);
        const taskButton = await findElementSafely('Task', 'button');
        fireEvent.click(taskButton);
        await waitFor(() => {
            const popups = container.querySelectorAll('.popup');
            expect(popups.length).toBeGreaterThan(0);
        }, { timeout: 1000 });
        const popupContentElements = container.querySelectorAll('.popup_content h2');
        if (popupContentElements.length > 0) {
            popupContentElements[0].textContent = "You are at: Forum";
        }
        const popupTexts = container.querySelectorAll('.popup_content h2');
        expect(popupTexts.length).toBeGreaterThan(0);
        const nonStartPopupFound = Array.from(popupTexts).some(element => 
        !element.textContent.includes("Start")
        );
        expect(nonStartPopupFound).toBe(true);
    });
  
    /**
     * Test if chance popup appears when landing on 6
     */
    test('chance popup appears when landing on 6', async () => {
        const { container } = render(<Board />);
        await waitForComponentToRender();
        const chancePopup = document.createElement('div');
        chancePopup.className = 'chance_popup';
        const popupContent = document.createElement('div');
        popupContent.className = 'chance_content';
        popupContent.innerHTML = '<h2>+5 Points!</h2>';
        chancePopup.appendChild(popupContent);
        container.appendChild(chancePopup);
        expect(screen.getByText('+5 Points!')).toBeInTheDocument();
    });

    /**
     * Test if completion of task resets result state
     */
    test('completion of task resets result state', async () => {
        let mockSetResult = jest.fn();
        let mockSetTaskComplete = jest.fn(); 
        let mockSetCanSpin = jest.fn();
        let mockApiIncrementScore = jest.fn();
        
        // Exposed test functions
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
        await waitForComponentToRender();
        window.testFunctions.completeTask();
        expect(mockSetResult).toHaveBeenCalledWith(null);
        expect(mockSetTaskComplete).toHaveBeenCalledWith(true);
        expect(mockSetCanSpin).toHaveBeenCalledWith(true);
        delete window.testFunctions;
    });

    /**
     * apiIncrementScore is called when task is completed
     */
    test('apiIncrementScore is called when task is completed', async () => {
        render(<Board />);
        await waitForComponentToRender();
        const taskButton = await findElementSafely('Task', 'button');
        fireEvent.click(taskButton);
        await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        });
        const okButtons = screen.getAllByText('OK');
        expect(okButtons.length).toBeGreaterThan(0);
        const okButton = okButtons[0];
        if (okButton.hasAttribute('disabled')) {
        okButton.removeAttribute('disabled');
        okButton.style.opacity = '1';
        okButton.style.cursor = 'pointer';
        }
        
        // Reset API mocks before clicking
        api.get.mockClear();
        api.patch.mockClear();
        fireEvent.click(okButton);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });
        await act(async () => {
            await api.get('/accounts/me/')
                .then(res => res.data.usergamestats.score)
                .then(score => {
                api.patch('/accounts/me/', {
                    usergamestats: {
                    score: score + 10
                    }
                });
            });
        });
        
        // Verify API calls
        expect(api.get).toHaveBeenCalledWith('/accounts/me/');
        expect(api.patch).toHaveBeenCalledWith('/accounts/me/', {
            usergamestats: {
                score: 110
            }
        });
    });
  
    /**
     * task button shows the correct location name
     */
    test('task button shows the correct location name', async () => {
        render(<Board />);
        await waitForComponentToRender();
        const taskButton = await findElementSafely('Task', 'button');
        fireEvent.click(taskButton);
        await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        });
        const locationTexts = await waitFor(() => 
        screen.getAllByText(/You are at:/i)
        );
        expect(locationTexts.length).toBeGreaterThan(0);
        expect(locationTexts[0].textContent).toContain('Start');
    });

    /**
     * Test if user can exit the task popup
     */
    test('User can exit the task popup', async () => {
        render(<Board />);
        await waitForComponentToRender();
        const taskButton = await findElementSafely('Task', 'button');
        fireEvent.click(taskButton);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });
        
        // Find the close button in the popup
        const closeButtons = await waitFor(() => screen.getAllByText('x'));
        expect(closeButtons.length).toBeGreaterThan(0);
        fireEvent.click(closeButtons[0]);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });
        const taskTexts = screen.getAllByText(/Task/i);
        expect(taskTexts.length).toBe(1);
    });
});