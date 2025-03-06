import { useEffect, useState } from "react"
import styles from "../styles/Board.module.css"

export default function Task({showTask, setShowTask, square, taskName, onCompleteTask}) {
    const [isTaskCompletable, setIsTaskCompletable] = useState(false)

    const gpsThreshold = 0.1; // Should be enough

    // check location and update isTaskCompletable
    const checkLocation = (latitude, longitude) => {
        if (square.id === 0) { // override for START as they don't need any locations
            setIsTaskCompletable(true)
            return
        }
        setIsTaskCompletable(isWithinRange(
            latitude,
            longitude,
            square.location[0],
            square.location[1],
            gpsThreshold,
        ))
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    console.log("🔄 Location updated:", latitude, longitude)
                    checkLocation(latitude, longitude)
                },
                (error) => console.error("❌ Geolocation error:", error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
            );
        }
    };

    useEffect(() => {
        let intervalId
    
        getLocation()
        intervalId = setInterval(getLocation, 5000) // continuously get location every 5 seconds
    
        // Cleanup function to stop watching location when the component unmounts
        return () => clearInterval(intervalId)
    }, [square])

    return (
        <div className={styles.task_deck}>
            {/* Task Button */}
            <button className={styles.task_btn} onClick={() => { setShowTask(true) }}>Task</button>
            <div>
                {showTask && (
                    <div className={styles.popup}>
                        <div className={styles.popup_header}>
                            <h1>Task</h1>
                            <button 
                                className={styles.exit_btn}
                                onClick={() => setShowTask(false)}>x
                            </button>
                        </div>
                        <div className={styles.popup_content}>
                        <h2>You are at: {square.name} <br/> The task is: {taskName} </h2>
                        <button
                            onClick={() => onCompleteTask()}
                            disabled={!isTaskCompletable}
                            style={{
                                opacity: isTaskCompletable ? 1 : 0.5,
                                cursor: isTaskCompletable ? "pointer" : "not-allowed"
                            }}>
                            OK
                        </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function isWithinRange(currentLatitude, currentLongitude, targetLatitude, targetLongitude, range) {
    if ( !currentLatitude || !currentLongitude ) {
        console.warn("Location not available yet. Skipping check...")
        return
    }

    const latDiff = Math.abs(currentLatitude - targetLatitude)
    const lonDiff = Math.abs(currentLongitude - targetLongitude)

    return (latDiff < range && lonDiff < range)
}