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

    test("Board component renders correctly", async () => {
        await act(async () => {
            render(<Board />);
        });
    
        expect(screen.getByText("cliMate")).toBeInTheDocument();
        expect(screen.getByText("SPIN")).toBeInTheDocument();
    });
});
