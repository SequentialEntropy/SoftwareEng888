/**
 * Map.test.jsx - A React component for testing the functionalities of the map page.
 * 
 * @file Handles rendering of the map page and tests the map page functions. 
 * @author Gareth Zheng Yang Koh
 * @author Crystal Tsui
 * @version 1.2.0 
 * @since 20-03-2025
*/

// Map.test.jsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Map from './Map';
import { squares } from '../constants';
import api from '../api';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>{children}</a>
    )
}));

jest.mock('react-leaflet', () => ({
    MapContainer: jest.fn(({ children, ...props }) => (
      <div data-testid="map-container" {...props}>{children}</div>
    )),
    TileLayer: jest.fn(() => <div data-testid="tile-layer" />),
    Marker: jest.fn(({ children }) => <div data-testid="marker">{children}</div>),
    Popup: jest.fn(({ children }) => <div data-testid="popup">{children}</div>)
}));

// Create a _mocks_/leaflet.js file in your project
jest.mock('leaflet', () => {
    return {
        Icon: jest.fn(() => ({})),
        map: jest.fn(() => ({
            setView: jest.fn().mockReturnThis(),
            remove: jest.fn(),
            on: jest.fn(),
            off: jest.fn(),
            addLayer: jest.fn(),
            removeLayer: jest.fn()
        })),
        tileLayer: jest.fn(() => ({
            addTo: jest.fn().mockReturnThis()
        })),
        marker: jest.fn(() => ({
            addTo: jest.fn().mockReturnThis(),
            bindPopup: jest.fn().mockReturnThis()
        })),
        layerGroup: jest.fn(() => ({
            addTo: jest.fn().mockReturnThis(),
            addLayer: jest.fn(),
            removeLayer: jest.fn(),
            clearLayers: jest.fn()
        }))
    };
});

// Basic leaflet mock
// const L = {
//     map: jest.fn(() => ({
//         setView: jest.fn().mockReturnThis(),
//         remove: jest.fn(),
//         on: jest.fn(),
//         off: jest.fn(),
//         addLayer: jest.fn(),
//         removeLayer: jest.fn()
//     })),
//     tileLayer: jest.fn(() => ({
//         addTo: jest.fn().mockReturnThis()
//     })),
//     marker: jest.fn(() => ({
//         addTo: jest.fn().mockReturnThis(),
//         bindPopup: jest.fn().mockReturnThis()
//     })),
//     layerGroup: jest.fn(() => ({
//         addTo: jest.fn().mockReturnThis(),
//         addLayer: jest.fn(),
//         removeLayer: jest.fn(),
//         clearLayers: jest.fn()
//     })),
//     // Add other Leaflet methods you use
// };

// module.exports = L;

jest.mock('../styles/Map.module.css', () => ({
    game: 'game',
    map_taskbar: 'map_taskbar',
    task_icon: 'task_icon',
    task_text: 'task_text',
    map_container: 'map_container'
}));

// Mock api
jest.mock('../api', () => ({
    __esModule: true,
    default: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    }
}));

// Mock constants
jest.mock('../constants', () => ({
    squares: [
      { id: 1, name: 'Forum', location: [50.735, -3.534] },
      { id: 2, name: 'Library', location: [50.736, -3.535] }
    ]
}));
  
// Mock geolocation
const mockGeolocation = {
    watchPosition: jest.fn().mockImplementation((success) => {
        success({ coords: { latitude: 50.735, longitude: -3.534 } });
        return 123; // watch ID
    }),
    clearWatch: jest.fn()
};

// Sample data for tests
const mockUserGameStats = {
    current_task: 1,
    current_square: 0
};

const mockTask = {
    id: 1,
    name: "Test Task",
    description: "This is a test task",
    location: [50.735, -3.534],
    score_to_award: 10
};  

// Mock Navbar component
jest.mock('../components/Navbar', () => {
    return function DummyNavbar() {
      return <div data-testid="navbar">NavBar</div>;
    };
});

describe("Map Component", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        global.navigator.geolocation = mockGeolocation;
        
        api.get.mockImplementation((endpoint) => {
            if (endpoint === "/accounts/me/") {
                return Promise.resolve({ data: { usergamestats: mockUserGameStats } });
            }
            if (endpoint === "/tasks/") {
                return Promise.resolve({ data: [mockTask] });
            }
            return Promise.reject(new Error("Not found"));
        });

        document.title = "";
    });

    /**
     * Component Render tests
     * 1. Render map component
     */
    describe('Compoenent Render tests', () => {
        test('Render map component', async () => {
            await act(async () => {
            render(<Map />);
            });
    
            expect(screen.getByTestId("navbar")).toBeInTheDocument();
            expect(screen.getByTestId("map-container")).toBeInTheDocument();
            expect(document.title).toBe("Map");
        });
    });

    /**
     * API tests
     * 1. Test task data is displayed correctly
     * 2. Test handling API error
     */
    describe('API tests', () => {
        test('task data displayed correclt when API returns data', async () => {
            await act(async () => {
                render(<Map />);
            });
    
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('/accounts/me/');
                expect(api.get).toHaveBeenCalledWith('/tasks/');
                expect(screen.getByText('This is a test task')).toBeInTheDocument();
            });
        });

        test('API error handling', async () => {
            api.get.mockImplementation(() => {
                return Promise.reject(new Error('API Error'));
            });
    
            await act(async () => {
                render(<Map />);
            });
    
            await waitFor(() => {
                expect(screen.getByText('Loading task...')).toBeInTheDocument();
            });
        });
    });

    /**
     * Geolocation tests
     * 1. Test display of user location when geolocation is available
     * 2. Test handling geolocation error
     */
    describe('Geolocation tests', () => {
        test('User location displayed when geolocation is available', async () => {
            await act(async () => {
                render(<Map />);
            });
    
            await waitFor(() => {
                expect(navigator.geolocation.watchPosition).toHaveBeenCalled();
            });
        });

        test('Geolocation error handling', async () => {
            // Override the mock to simulate error
            global.navigator.geolocation = {
                watchPosition: jest.fn().mockImplementation((success, error) => {
                    error(new Error('Geolocation error'));
                    return 123;
                })
            };
    
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
            await act(async () => {
                render(<Map />);
            });
    
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error getting user location: ', 
                expect.any(Error)
            );
    
            consoleSpy.mockRestore();
        });
    });

    /**
     * Map Render tests
     * 1. Test map render with correct coordinates
     * 2. Test marker render on map
     */
    describe('Map Render tests', () => {
        test('Render map with correct coordinates', async () => {
            await act(async () => {
                render(<Map />);
            });
    
            expect(screen.getByRole('region')).toBeInTheDocument();
        });

        // test('Marker render on map', async () => {

        // });
    });

    /** 
     * Integration tests
     * 1. Test display task info when task is loaded
     * 2. Test display no task if current task is not found
     */
    // describe('Integration tests', () => {
    //     test('Task info displayed when task is loaded', async () => {

    //     });

    //     test('Display with no task message if current task is not found', async () => {

    //     });
    // });

    /**
     * Responsiveness tests
     * 1. Test page on different dimension
     */
    // describe('Responsiveness tests', () => {
    //     test('Test page on different dimension', async () => {

    //     });
    // });
})