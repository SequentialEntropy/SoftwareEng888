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
        // Mock animation functions
        global.Element.prototype.animate = jest.fn();
    });
    /**
     * Test to check Board components render correctly.
    */
    test("renders Board component correctly", () => {
        render(<Board />);
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

    /**
     * Test if completion of task resets result state
    */
});