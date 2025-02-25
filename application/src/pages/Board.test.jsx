/**
 * Board.test.jsx - A React component for testing the functionalities of the board.
 * 
 * @file Handles rendering of the board and tests the board functions. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal
 * @version 1.1.0 
 * @since 25-02-2025
*/

import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Board from "./Board";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

describe("Board Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.navigator.geolocation = {
            getCurrentPosition: jest.fn((success) =>
                success({
                    coords: {
                        latitude: 50.7288, // Allowed location
                        longitude: -3.5060,
                    },
                })
            ),
        };
        
        // Mock animations to prevent errors
        HTMLElement.prototype.animate = jest.fn(() => ({
            onfinish: jest.fn((callback) => callback()),
            cancel: jest.fn(),
        }));
    });


    /**
     * Test Board component renders correctly
     */
    test("Board component renders correctly", async () => {
        await act(async () => {
            render(<Board />);
        });
    
        expect(screen.getByText("cliMate")).toBeInTheDocument();
        expect(screen.getByText("SPIN")).toBeInTheDocument();
    });

    /**
     * Test if the spin button is enabled in correct location
    */

    /**
     * Test if the spin button is disabled in wrong location
    */

    /**
     * Test if the Avatar moves after spin is made
    */
    test("Avatar moves after spin is made", async () => {
        render(<Board />);
        
        const avatar = screen.getByTestId("avatar");
        const initialTop = avatar.style.top;
        const initialLeft = avatar.style.left;
    
        // Mock getBoundingClientRect to simulate movement
        let newTop = 60; 
        let newLeft = 80;
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
            top: newTop,
            left: newLeft,
            width: 50,
            height: 50,
        }));
    
        const spinButton = screen.getByText("SPIN");
        fireEvent.click(spinButton);
    
        await waitFor(() => {
            console.log("Initial top:", initialTop);
            console.log("Initial left:", initialLeft);
            console.log("Updated top:", avatar.style.top);
            console.log("Updated left:", avatar.style.left);
            expect(avatar.style.top).not.toBe(initialTop);
            expect(avatar.style.left).not.toBe(initialLeft);
        });
    });

    /**
     * Test if the spin animation triggers when clicked
    */
    test("Clicking spin triggers animation", async () => {
        render(<Board />);
        const spinButton = await screen.findByText("SPIN");

        await act(async () => {
            fireEvent.click(spinButton);
        });

        expect(HTMLElement.prototype.animate).toHaveBeenCalled();
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
