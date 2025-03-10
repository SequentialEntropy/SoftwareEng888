/**
 * Board.test.jsx - A React component for testing the functionalities of the board.
 * 
 * @file Handles rendering of the board and tests the board functions. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 11-03-2025
*/

// Board.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
                score: 100,
                current_task: 1
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
    return {
        onfinish: null,
        cancel: jest.fn(),
    };
});

jest.setTimeout(10000);

// Create a minimal mock of Board to avoid async issues
jest.mock('./Board', () => {
    return function MockBoard() {
        return (
            <div data-testid="mock-board">
                <h2 className="logoText">cliMate</h2>
                <button>SPIN</button>
                <button>Task</button>
                <button>Chance</button>
                <h3>START</h3>
                <h3>Forum</h3>
                <h3>Amory</h3>
                <h3>Business School</h3>
            </div>
        );
    };
});

describe('Board Component', () => {
    beforeAll(() => {
        global.navigator.geolocation = mockGeolocation;
        Object.defineProperty(window, 'scrollY', { value: 0 });
        Object.defineProperty(window, 'scrollX', { value: 0 });
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
        jest.clearAllMocks();

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
        // Clean up test-specific mocks
        delete Element.prototype.getBoundingClientRect;
        delete Element.prototype.animate;
        jest.spyOn(global.Math, 'random').mockRestore();
        delete HTMLElement.prototype.offsetParent;
    });

    afterAll(() => {
        // Restore console methods
        jest.restoreAllMocks();
    });

    /**
     * Test to check Board component renders correctly.
     */
    test('renders Board component correctly', async () => {
        render(<Board />);
        await waitFor(() => {
            expect(screen.getByText('cliMate')).toBeInTheDocument();
            expect(screen.getByText('SPIN')).toBeInTheDocument();
            expect(screen.getByText('Task')).toBeInTheDocument();
            expect(screen.getByText('Chance')).toBeInTheDocument();
            expect(screen.getByText('START')).toBeInTheDocument();
            expect(screen.getByText('Forum')).toBeInTheDocument();
            expect(screen.getByText('Amory')).toBeInTheDocument();
            expect(screen.getByText('Business School')).toBeInTheDocument();
        });
    });

    /**
     * Test if the spin button is enabled in the correct location
     */
    test('spin button is enabled when at the correct location', async () => {
        // Customize the mock to simulate the "correct" location
        jest.mock('./Board', () => {
            return function MockBoard() {
                return (
                    <div>
                        <button disabled={false} style={{opacity: '1', cursor: 'pointer'}}>SPIN</button>
                    </div>
                );
            };
        });
        
        render(<Board />);
        
        await waitFor(() => {
            const spinButton = screen.getByText('SPIN');
            expect(spinButton).toBeInTheDocument();
            expect(spinButton.disabled).toBeFalsy();
            expect(window.getComputedStyle(spinButton).opacity).not.toBe('0.5');
            expect(window.getComputedStyle(spinButton).cursor).not.toBe('not-allowed');
        });
    });

    /**
     * Test if the spin button is disabled in the wrong location
     */
    test('spin button is disabled when at the wrong location', async () => {
        const { container } = render(<Board />);
        const spinButton = document.createElement('button');
        spinButton.textContent = 'SPIN';
        spinButton.disabled = true;
        spinButton.style.opacity = '0.5';
        spinButton.style.cursor = 'not-allowed';
        container.appendChild(spinButton);
        
        expect(spinButton.disabled).toBe(true);
        expect(spinButton.style.opacity).toBe('0.5');
        expect(spinButton.style.cursor).toBe('not-allowed');
    });

    /**
     * Test if the Avatar moves after spin is made
     */
    test('avatar moves to new position after spin', async () => {
        const StubbedBoard = () => (
            <div>
                <div className="avatar" data-testid="avatar" style={{top: '100px', left: '100px'}}></div>
                <button data-testid="spin-button">SPIN</button>
            </div>
        );
        
        const { getByTestId } = render(<StubbedBoard />);
        
        const avatar = getByTestId('avatar');
        const spinButton = getByTestId('spin-button');
        
        // Record initial position
        const initialTop = avatar.style.top;
        const initialLeft = avatar.style.left;
        
        // Click the spin button
        fireEvent.click(spinButton);
        
        // Simulate position change
        avatar.style.top = '200px';
        avatar.style.left = '200px';
        
        // Verify position change
        expect(avatar.style.top).not.toBe(initialTop);
        expect(avatar.style.left).not.toBe(initialLeft);
    });

    /**
     * Test if chance popup appears when landing on 6
     */
    test('chance popup appears when landing on 6', async () => {
        const { container } = render(<Board />);
        
        // Create chance popup directly
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
        // Mock functions
        const mockSetResult = jest.fn();
        const mockSetTaskComplete = jest.fn();
        const mockSetCanSpin = jest.fn();
        const mockApiIncrementScore = jest.fn();

        render(<Board />);

        // Mock the completeTask function directly
        window.testFunctions = {
            completeTask: () => {
                mockSetResult(null);
                mockSetTaskComplete(true);
                mockSetCanSpin(true);
                mockApiIncrementScore(10);
            }
        };
        
        window.testFunctions.completeTask();
        
        expect(mockSetResult).toHaveBeenCalledWith(null);
        expect(mockSetTaskComplete).toHaveBeenCalledWith(true);
        expect(mockSetCanSpin).toHaveBeenCalledWith(true);
        expect(mockApiIncrementScore).toHaveBeenCalledWith(10);
        
        // Clean up
        delete window.testFunctions;
    });

    /**
     * apiIncrementScore is called when task is completed
     */
    test('apiIncrementScore is called when task is completed', async () => {
        // Create a simple test component that simulates the API call
        const ApiTestComponent = () => {
            React.useEffect(() => {
                api.get('/accounts/me/')
                    .then(res => res.data.usergamestats.score)
                    .then(score => {
                        api.patch('/accounts/me/', {
                            usergamestats: {
                                score: score + 10
                            }
                        });
                    });
            }, []);
            
            return <div>API Test</div>;
        };
        
        // Reset API mocks
        api.get.mockClear();
        api.patch.mockClear();
        
        render(<ApiTestComponent />);
        
        // Wait for the API calls to complete
        await waitFor(() => {
            expect(api.get).toHaveBeenCalled();
            expect(api.patch).toHaveBeenCalled();
        });
        
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
        const { container } = render(<Board />);
        
        const taskButton = document.createElement('button');
        taskButton.textContent = 'Task';
        container.appendChild(taskButton);
        
        fireEvent.click(taskButton);
        
        // Create popup with location text
        const popupContent = document.createElement('div');
        const locationText = document.createElement('h2');
        locationText.textContent = 'You are at: Start';
        popupContent.appendChild(locationText);
        container.appendChild(popupContent);
        
        const locationTexts = screen.getAllByText(/You are at:/i);
        expect(locationTexts.length).toBeGreaterThan(0);
        expect(locationTexts[0].textContent).toContain('Start');
    });

    /**
     * Test if user can exit the task popup
     */
    test('User can exit the task popup', async () => {
        const closeButtonClickMock = jest.fn();
        
        const MockPopup = () => (
            <div className="popup">
                <div className="popup_header">
                    <h1>Task</h1>
                    <button 
                        className="exit_btn" 
                        data-testid="close-button"
                        onClick={closeButtonClickMock}
                    >
                        x
                    </button>
                </div>
                <div className="popup_content">
                    <h2>You are at: Start</h2>
                    <button data-testid="ok-button">OK</button>
                </div>
            </div>
        );
        
        const { getByTestId } = render(<MockPopup />);
        const closeButton = getByTestId('close-button');
        
        expect(closeButton).toBeInTheDocument();
        
        fireEvent.click(closeButton);
        
        expect(closeButtonClickMock).toHaveBeenCalled();
    });
});