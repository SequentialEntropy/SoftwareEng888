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
        // test('task data displayed correctly when API returns data', async () => {
            
        // });

        // test('API error handling', async () => {
            
        // });
    });

    /**
     * Geolocation tests
     * 1. Test display of user location when geolocation is available
     * 2. Test handling geolocation error
     */
    describe('Geolocation tests', () => {
        test('Tset user location displayed when geolocation is available', async () => {
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
        // test('Render map with correct coordinates', async () => {
        //     await act(async () => {
        //         render(<Map />);
        //     });
    
        //     expect(screen.getByRole('region')).toBeInTheDocument();
        // });

        test('Marker render on map', async () => {
            await act(async () => {
                render(<Map />);
            });
            
            await waitFor(() => {
                const markers = screen.getAllByTestId('marker');
                expect(markers.length).toBeGreaterThan(0);
            });
        });
    });

    /** 
     * Integration tests
     * 1. Test display task info when task is loaded
     * 2. Test display no task if current task is not found
     */
    describe('Integration tests', () => {
        test('Task info displayed when task is loaded', async () => {
            await act(async () => {
                render(<Map />);
            });
            
            await waitFor(() => {
                // Use getAllByText since there are multiple elements with "Forum"
                const forumElements = screen.getAllByText('Forum');
                expect(forumElements.length).toBeGreaterThan(0);
                
                // Similarly, use getAllByText for task description
                const taskDescriptionElements = screen.getAllByText('This is a test task');
                expect(taskDescriptionElements.length).toBeGreaterThan(0);
            }, { timeout: 2000 });
        });

        test('Display with no task message if current task is not found', async () => {
            api.get.mockImplementation((endpoint) => {
                if (endpoint === "/accounts/me/") {
                    return Promise.resolve({ data: { usergamestats: { ...mockUserGameStats, current_task: 999 } } });
                }
                if (endpoint === "/tasks/") {
                    return Promise.resolve({ data: [mockTask] });
                }
                return Promise.reject(new Error("Not found"));
            });
            
            await act(async () => {
                render(<Map />);
            });
            
            await waitFor(() => {
                expect(screen.queryByText('No tasks found for this square - Skip task!')).toBeInTheDocument();
            }, { timeout: 2000 });
        });
    });

    /**
     * Responsiveness tests
     * 1. Test page on different dimension
     */
    describe('Responsiveness tests', () => {
        test('Test page on different dimension', async () => {
            const originalInnerWidth = window.innerWidth;
            const originalInnerHeight = window.innerHeight;
            
            try {
                // Test mobile dimensions
                window.innerWidth = 375;
                window.innerHeight = 667;
                window.dispatchEvent(new Event('resize'));
                
                let { unmount } = render(<Map />);
                
                const mobileMapContainers = screen.getAllByTestId('map-container');
                expect(mobileMapContainers.length).toBeGreaterThan(0);
                
                unmount();
                
                window.innerWidth = 1440;
                window.innerHeight = 900;
                window.dispatchEvent(new Event('resize'));
                
                render(<Map />);
                
                const desktopMapContainers = screen.getAllByTestId('map-container');
                expect(desktopMapContainers.length).toBeGreaterThan(0);
            } finally {
                // Restore original dimensions
                window.innerWidth = originalInnerWidth;
                window.innerHeight = originalInnerHeight;
                window.dispatchEvent(new Event('resize'));
            }
        });
    });
})