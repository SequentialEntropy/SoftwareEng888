/**
 * Map.jsx - A React component for the map page
 * 
 * @file renders the map component
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Yap Wen Xing
 * @version 1.1.2
 * @since 11-03-2025
 * 
 */

import React, { useState, useEffect } from "react";
import styles from "../styles/Map.module.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { squares } from "../constants";
import L from "leaflet";

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

function Map() {
    const [showPopup, setShowPopup] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
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
    }, []);
    
    return (
        <div className={styles.game}>
            <nav>
                <div className={styles.sidebar} style={{ marginLeft: "20px" }}>
                    <div className={styles.logoContainer}>
                        <h2 className={styles.logoText}>cliMate</h2>
                    </div>
                    <a href="home"><i className="bi bi-house-door-fill"></i></a>
                    <a href="board"><i className="bi bi-dice-3-fill"></i></a>
                    <a href="map"><i className="bi bi-map-fill"></i></a>
                    <a href="profile"><i className="bi bi-person-circle"></i></a>
                    <a href="logout"><i className="bi bi-box-arrow-right"></i></a>
                </div>
            </nav>

            {/* Task information bar */}
            <div className={styles.map_taskbar}>
                <div className={styles.task_icon}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                </div>
                <div className={styles.task_text}>
                    <h3>Innovation Centre</h3>
                    <h6>Recycle an item</h6>
                </div>
            </div>

            {/* Map container with task markers */}
            <div className={styles.map_container}>
                <MapContainer 
                    center={[50.73520737891607, -3.533907682035006]} // Centered at Forum
                    zoom={20} 
                    scrollWheelZoom={true} // Enable zooming with mouse wheel
                    doubleClickZoom={true} // Enable zooming with double click
                    style={{ width: "100%", height: "500px" }}
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