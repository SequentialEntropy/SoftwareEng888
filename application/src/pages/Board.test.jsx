/**
 * Board.test.jsx - A React component for testing the functionalities of the board.
 * 
 * @file Handles rendering of the board and tests the board functions. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal
 * @version 1.1.0 
 * @since 25-02-2025
*/

// Board.test.jsx
import { render, screen, fireEvent, act, waitFor} from "@testing-library/react";
import Board from "./Board";
import "@testing-library/jest-dom";

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

    /**
     * Test if the spin button is disabled in the wrong location
    */

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
