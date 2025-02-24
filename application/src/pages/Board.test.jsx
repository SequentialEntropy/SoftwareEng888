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
            onfinish: jest.fn(),
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
});
