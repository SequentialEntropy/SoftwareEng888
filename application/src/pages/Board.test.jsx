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

// Mock getBoundingClientRect for all elements
Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 100,
    height: 100,
    top: 100,
    left: 100,
    right: 200,
    bottom: 200
}));

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

        // Mock geolocation for disabling spin in wrong location
        global.navigator.geolocation = {
            watchPosition: jest.fn((success, error, options) => {
                success({ coords: { latitude: 50.7352, longitude: -3.5332 } });
                return 1;
            }),
            clearWatch: jest.fn()
        };
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
        await act(async () => {
            render(<Board />);
        });

        await waitFor(() => expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled());
        await waitFor(() => expect(navigator.geolocation.watchPosition).toHaveBeenCalled());

        const spinButton = await screen.findByText("SPIN");

        await waitFor(() => {
            expect(spinButton).not.toBeDisabled();
        });
    });

    /**
     * Test if the spin button is disabled in the wrong location
    */
    test("Spin button disabled if user is in wrong location", async () => {
        global.navigator.geolocation.watchPosition.mockImplementationOnce((_, error) => {
            error({ message: "User is in the wrong location" });
        });

        await act(async () => {
            render(<Board />);
        });

        const spinButton = await screen.findByText("SPIN");
        expect(spinButton).toBeDisabled();
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
