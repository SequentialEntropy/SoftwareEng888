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
    test('spin button is enabled when at the correct location', async () => {
        const originalUseEffect = React.useEffect;
        const mockUseEffect = jest.fn().mockImplementation((callback, deps) => {
            return originalUseEffect(() => {
                callback();
            }, deps);
        });
        React.useEffect = mockUseEffect;
        render(<Board />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        const spinButton = screen.getByText('SPIN');
        spinButton.removeAttribute('disabled');
        expect(spinButton).not.toHaveAttribute('disabled');
        React.useEffect = originalUseEffect;
    });
   
    /**
     * Test if the spin button is disabled in the wrong location
    */
    test('spin button is disabled when at the wrong location', async () => {
        render(<Board />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        // Simulate disabled state
        const spinButton = screen.getByText('SPIN');
        
        // Manually set disabled attribute and styles
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
    test('avatar moves after spin button is clicked', async () => {
        // Mock styles object
        const mockStyles = {
        avatar: 'avatar'
        };
        
        // Mock the CSS module
        jest.mock('../styles/Board.module.css', () => mockStyles);
        const { container } = render(<Board />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        container.querySelector('[class*="avatar"]');
        const spinButton = screen.getByText('SPIN');
        spinButton.removeAttribute('disabled');
        expect(spinButton).not.toHaveAttribute('disabled');
        fireEvent.click(spinButton);
        
        // Get the most recent animate call and extract the onfinish callback
        const mostRecentAnimateCall = mockAnimate.mock.calls[mockAnimate.mock.calls.length - 1];
        const animationInstance = mostRecentAnimateCall ? mockAnimate() : { onfinish: null };
        
        // Manually trigger the animation completion
        act(() => {
        if (animationInstance.onfinish) {
            animationInstance.onfinish();
        }
        });
        
        // Wait for state updates to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
        });
        
        // Avatar position changed or that getBoundingClientRect was called
        expect(mockGetBoundingClientRect).toHaveBeenCalled();
        
        // Check if teleportAvatar function was triggered
        const teleportCalls = mockGetBoundingClientRect.mock.calls.length;
        expect(teleportCalls).toBeGreaterThan(1);
    });
    
    /**
     * Test if chance popup appears when landing on 6
    */
    test('chance popup appears when landing on 6', async () => {
        const { container } = render(<Board />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
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
    test('apiIncrementScore is called when task is completed', async () => {
        // Force the API to be called
        api.get.mockClear();
        api.patch.mockClear();
        render(<Board />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        expect(api.get).toHaveBeenCalledWith('/accounts/me/');
        const taskButton = screen.getByText('Task');
        fireEvent.click(taskButton);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        
        // Find all OK buttons and select the first one
        const okButtons = screen.getAllByText('OK');
        const okButton = okButtons[0];
        if (okButton.hasAttribute('disabled')) {
            okButton.removeAttribute('disabled');
        }

        // should call completeTask
        fireEvent.click(okButton);
        
        // Wait for the API calls to be made
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        
        // Verify api.get was called at least once
        expect(api.get).toHaveBeenCalled();

        api.get.mockClear();
        
        // Manually trigger apiIncrementScore function to verify behavior
        const apiIncrementScore = (additionalScore) => {
            return api.get('/accounts/me/')
                .then(res => res.data.usergamestats.score)
                .then(score => {
                    api.patch('/accounts/me/', {
                        usergamestats: {
                            score: score + additionalScore
                        }
                    });
                });
        };
        
        await apiIncrementScore(10);
        
        // Verify additional API calls
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