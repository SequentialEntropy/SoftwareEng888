/**
 * Map.jsx - A React component for the map page
 * 
 * @file renders the map component
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Yap Wen Xing
 * @version 1.1.2
 * @since 14-03-2025
 * 
 */

import React, { useState, useEffect } from "react";
import styles from "../styles/Map.module.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { squares } from "../constants";
import L from "leaflet";
import NavBar from "../components/Navbar";
import api from "../api";

// Blue marker for task locations
const taskMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// Red marker for user's current location
const userLocationIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

/**
 * Map Component 
 * 
 * This component represents the interactive map.
 * It displays the user's current gps location along with all physical locations of squares on the board.
 * 
 * @component 
 * @returns {JSX.Element} The map UI
 */
function Map() {
    const taskNotFound = {id: -1, name: "No Task", description: "No tasks found for this square - Skip task!", location: null, score_to_award: 0}

    const [task, setTask] = useState(null);
    const [squareName, setSquareName] = useState(null)
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        document.title = "Map"
        // Fetch task data and user location in a single effect to avoid conflicts
        const fetchTask = async () => {
            const usergamestats = (await api.get("/accounts/me/")).data.usergamestats

            const tasks = (await api.get("/tasks/")).data

            const currentTask = tasks.find(task => task.id === usergamestats.current_task)
            const currentSquare = squares[usergamestats.current_square]

            // set current task
            setTask(currentTask || taskNotFound)
            setSquareName(currentSquare.name)
        }

        const fetchUserLocation = async () => {
            // Get user location
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    (position) => {
                        setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error("Error getting user location: ", error);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        fetchTask();
        fetchUserLocation();
    }, []);
    
    
    return (
        <div className={styles.game}>
            <NavBar />

            {/* Task information bar */}
            <div className={styles.map_taskbar}>
                <div className={styles.task_icon}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                </div>
                <div className={styles.task_text}>
                    <h3>{task ? squareName : "Loading task..."}</h3>
                    <h6>{task ? task.description : ""}</h6>
                </div>
            </div>

            {/* Map container with task markers */}
            <div className={styles.map_container}>
                <MapContainer 
                    center={[50.73520737891607, -3.533907682035006]} // Centered at Forum
                    zoom={20} 
                    scrollWheelZoom={true} // Enable zooming with mouse wheel
                    doubleClickZoom={true} // Enable zooming with double click
                    style={{ width: "100%", height: "70vh", borderRadius:"10px" }}
                >
                    {/* Tile layer using OpenStreetMap */}
                    <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    />
                    
                    {/* Markers for each task location */}
                    {squares.map((task) => (
                        <Marker key={task.id} position={task.location} icon={taskMarkerIcon}>
                            <Popup>
                                <strong>{task.name}</strong>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Show task location */}
                    {task && task.location && (
                        <Marker position={task.location} icon={taskMarkerIcon}>
                        <Popup>
                            <strong>{task.name}</strong>
                            <br />
                            {task.description}
                        </Popup>
                    </Marker>
                    )}

                    {/* Render user red location marker */}
                    {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                            <Popup>
                                <strong>You are here!</strong>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default Map;
