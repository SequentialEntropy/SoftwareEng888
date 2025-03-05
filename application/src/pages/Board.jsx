/**
 * Board.jsx - A React component for displaying a board with interactive spinning functionality.
 * 
 * @file Handles rendering of the board and integrates with the 'wheelofFortune' function. 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Yap Wen Xing 
 * @author Genki Asahi
 * @author Dany Kelzi
 * @version 1.1.0 
 * @since 19-02-2025
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../styles/Board.module.css";
import api from "../api";
import Spinner from "../components/Spinner";
import HowToPlay from "../components/HowToPlay";

/**
 * Board Component
 * This component represents a spinning wheel that determines the number of squares the user will proceed.
 * @returns {JSX.Element} A board with locations.
 */

function Board() {
    const [score, setScore] = useState(0);

    const apiGetScore = () => {
        return api.get("/accounts/me/")
        .then(res => res.data.usergamestats.score)
        .then(score => {setScore(score); return score})
    }

    const apiSetScore = (score) => {
        return api.patch("/accounts/me/", {
            usergamestats: {
                score: score
            }
        })
    }

    const apiIncrementScore = (additionalScore) => {
        return apiGetScore().then(score => {apiSetScore(score + additionalScore); setScore(score + additionalScore)})
    }

    useEffect(() => {
        apiGetScore()
    }, [])

    const [canSpin, setCanSpin] = useState(true)
    // State to store the selected result
    const [result, setResult] = useState(null);

    const locations = {
        0: [0, 0],
        1: [50.7352025, -3.5331998], // TODO: copied from #4 for demo
        2: [50.7352025, -3.5331998], // TODO: copied from #4 for demo
        3: [50.7352025, -3.5331998], // TODO: copied from #4 for demo
        4: [50.7352025, -3.5331998],
        5: [ 50.7354678, -3.5346157],
        6: [50.7288, -3.5060],
        7: [50.7288, -3.5060],
        8: [50.7383339, -3.5307875],
        9: [50.7288, -3.5060],
        10: [50.7288, -3.5060],
        11: [50.734187, -3.533157],
        12: [50.7333275, -3.5343472],
        13: [50.7342858, -3.5344508],
        14: [50.7364241, -3.5316993],
        15: [50.7288, -3.5060]
    }   

    const names = {
        0: "Start",
        1: "Birks Grange",
        2: "East Park",
        3: "Peter Chalk",
        4: "Forum",
        5: "Great Hall" ,
        6: "Reed Hall" ,
        7: "Harrison" ,
        8: "Innovation Centre",
        9: "INTO Building" ,
        10: "Streatham Court",
        11: "Hatherly"  ,
        12: "Old Library"  ,
        13: "Queens" ,
        14: "Amory" ,
        15: "Business School" 
    }   
    const squareRefs = useRef({});
    const avatarRef = useRef(null);
    const [avatarPos, setAvatarPos] = useState([0, 0])
    const [avatarSquare, setAvatarSquare] = useState(0)
    const [userLocation, setUserLocation] = useState(null);
    const [taskComplete, setTaskComplete] = useState(true);
    const chosenTask = useState("Pick up one cup")

      {/*Chance card activation*/}
      const [getChance, setGetChance] = useState(null);

    /**
     * Initialises the spinning wheel effect
     */
    useEffect(() => {
        let watchId;
        teleportAvatar(0)
        setCanSpin(true)
        const startWatch = () => {
            if (navigator.geolocation) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("🔄 Location updated:", latitude, longitude);
                        setUserLocation({ latitude, longitude });
                    },
                    (error) => console.error("❌ Geolocation error:", error),
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
                    setCanSpin(false)
                );
            }
        };
    
        startWatch();
    
        // 🔄 Restart watchPosition() every 10s to prevent location freeze
        const restartInterval = setInterval(() => {
            console.warn("⚠️ Restarting location tracking...");
            navigator.geolocation.clearWatch(watchId);
            startWatch();
        }, 10000);
    
        // Cleanup function to stop watching location when the component unmounts
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    useEffect(() => {
        if (userLocation && avatarSquare !== null) {
            checkLocation(userLocation.latitude, userLocation.longitude);
        }
    }, [userLocation, avatarSquare]); // Run only when both are updated    

    const checkLocation = (latitude, longitude) => {
        if (!latitude || !longitude) {
            console.warn("Location not available yet. Skipping check...");
            return;
        }
        console.log("Checking location...");
        console.log("User Location:", latitude, longitude);
        console.log("Target Location:", locations[avatarSquare][0], locations[avatarSquare][1]);
        console.log("Avatar Square:", avatarSquare);
    
        const allowedLatitude = locations[avatarSquare][0];
        const allowedLongitude = locations[avatarSquare][1];
    
        const latDiff = Math.abs(latitude - allowedLatitude);
        const lonDiff = Math.abs(longitude - allowedLongitude);
    
        console.log("Latitude Difference:", latDiff);
        console.log("Longitude Difference:", lonDiff);
    
        const threshold = 0.1; // Should be enough
    
        if ((latDiff < threshold && lonDiff < threshold) || avatarSquare === 0) {
            console.log("Youre at the correct location!");
            setTaskComplete(true); // Set TRUE only if check passes
        } else {
            setTaskComplete(false)
            setCanSpin(false)
            console.error("Youre not in the correct location");
        }
    };
    
    
    const teleportAvatar = (squareId) => {
        console.log(squareRefs.current[squareId])
        const pos = squareRefs.current[squareId].getBoundingClientRect()
        const offsetPos = avatarRef.current.offsetParent.getBoundingClientRect();
        setAvatarPos([pos.top + window.scrollY - offsetPos.top, pos.left + window.scrollX - offsetPos.left])
        setCanSpin(false)
        setAvatarSquare(squareId)

    }

    const taskFunction = () => {
        if (userLocation != null) {
            checkLocation(userLocation.latitude, userLocation.longitude)}
        setResult(true) 


    }
    const completeTask =() => {
        setResult(null)
        setTaskComplete(true)
        setCanSpin(true)
        setGetChance(false)
        apiIncrementScore(10)
    }
    const BoardSquare = (id, name, backgroundColor) => {
        return (
            <div className={styles.item} key={id} ref={e => {squareRefs.current[id] = e}}>
                <div className={styles.tile_bar} style={{backgroundColor: backgroundColor}}>
                <h3>{name}</h3>
                </div>
            </div>
        )
    }
    
    const squares = [
        BoardSquare(0,  "Start"            , "#3c3e4c"),
        BoardSquare(1,  "Birks Grange"     , "#7f95d1"),
        BoardSquare(2,  "East Park"        , "#558564"),
        BoardSquare(3,  "Peter Chalk"      , "#7f2982"),
        BoardSquare(4,  "Forum"            , "#ea526f"),
        BoardSquare(5,  "Great Hall"       , "#558564"),
        BoardSquare(6,  "Reed Hall"        , "#7f95d1"),
        BoardSquare(7,  "Harrison"         , "#e98a15"),
        BoardSquare(8,  "Innovation Centre", "#7f2982"),
        BoardSquare(9,  "INTO Building"    , "#ea526f"),
        BoardSquare(10, "Streatham Court"  , "#558564"),
        BoardSquare(11, "Hatherly"         , "#7f95d1"),
        BoardSquare(12, "Old Library"      , "#e98a15"),
        BoardSquare(13, "Queens"           , "#7f2982"),
        BoardSquare(14, "Amory"            , "#ea526f"),
        BoardSquare(15, "Business School"  , "#558564"),
    ]

    const [showChance, setShowChance] = useState(false);

    return (
        <div className={styles.game}>
            <nav>
                <div className={styles.sidebar} style={{marginLeft: "20px"}}>
                    <div className={styles.logoContainer}>
                        <h2 className={styles.logoText}>cliMate</h2>
                    </div>
                    <a href="home"><i className="bi bi-house-door-fill" style={{fontSize: "48px"}} ></i></a>
                    <a href="board"><i className="bi bi-dice-3-fill" style={{fontSize: "48px"}} ></i></a>
                    <a href="map"><i className="bi bi-map-fill" style={{fontSize: "48px"}} ></i></a>
                    <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "48px"}} ></i></a>
                    <a href="logout"><i className="bi bi-box-arrow-right" style={{fontSize: "48px"}} ></i></a>
                    {/* <a href="{% url 'password_change' %}">Password Change</a> */}
                </div>
                
            </nav>
            <div className={styles.main_board}>
                {/* Avatar */}
                <div ref={avatarRef} className={styles.avatar} style={{
                        top: avatarPos[0] + 42,
                        left: avatarPos[1] + 38,
                    }}>
                        <i className="bi bi-bicycle"></i>
                </div>
                {/* Board items representing locations on campus */}
                {squares[8]}
                {squares[9]}
                {squares[10]}
                {squares[11]}
                {squares[12]}
                {squares[13]}
                {squares[7]}
                <div />
                <div />
                <div />
                <div />
                {squares[14]}
                {squares[6]}
                <div />
                <div>
                    <Spinner
                        canSpin={canSpin}
                        setResult={setResult}
                        setGetChance={setGetChance}
                        setShowChance={setShowChance}
                        teleportAvatar={teleportAvatar}
                        setTaskComplete={setTaskComplete}
                        checkLocation={checkLocation}
                        avatarSquare={avatarSquare}
                        squares={squares}
                        userLocation={userLocation}
                        callback={() => {
                            if (userLocation != null) {
                                checkLocation(userLocation.latitude, userLocation.longitude)
                            }
                            console.log("Callback!")
                    }} />
                </div>
                <div />
                <div />
                <div className={styles.task_deck}>
                    {/* Task Button */}
                    <button className={styles.task_btn} onClick={() => taskFunction()}>Task</button>
                    <div>  
                {/* Popup to show task reminder */}
                {result != null && (
                    <div className={styles.popup}>
                        <div className={styles.popup_header}>
                            <h1>Task</h1>
                            <button
                                className={styles.exit_btn}
                                onClick={() => setResult(null)}>x
                            </button>
                        </div>
                        <div className={styles.popup_content}>
                        {/* <h2>You are at: {result}</h2> */}
                        <h2>You are at: {names[avatarSquare]} <br/> The task is: {chosenTask} </h2>
                        {/* <h2>You are at: {userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : "Fetching location..."}</h2> */}
                        <button 
                            onClick={() => setResult(null)} 
                            disabled={!taskComplete} 
                            style={{ 
                                opacity: taskComplete ? 1 : 0.5, 
                                cursor: taskComplete ? "pointer" : "not-allowed" 
                            }}>
                            OK
                        </button>
                        </div>
                    </div>
                )}
            </div>
                </div>
                <div className={styles.chance_deck}>
                    {/* Chance Card Button */}

                    <button className={styles.task_btn} onClick={() => setShowChance(true)} disabled = {!getChance}>Chance</button>

                    {/* Chance Card Popup - only available after landing on 6 */}


                    {getChance && showChance && (
                        <div className = {styles.chance_popup}>
                            <div className = {styles.chance_header}> 
                                <h1>Chance</h1>
                                <button
                                    className={styles.exit_btn}
                                    onClick={() => setShowChance(false)}>x
                                </button>
                            </div>
                            <div className={styles.chance_content}>
                                <h2>+5 Points!</h2>
                            </div>

                        </div>

                    )}
        
                </div>
                {squares[15]}
                {squares[5]}
                {squares[4]}
                {squares[3]}
                {squares[2]}
                {squares[1]}
                <div className={styles.item} style={{backgroundColor: '#3c3e4c'}} key={0} ref={e => {squareRefs.current[0] = e}}>
                    <h3 style={{color: '#d9d9d9', fontSize: '50px', transform: 'rotate(-25deg)', margin:'auto', letterSpacing: '5px'}}>START</h3>
                </div>
                <div>  
                {/* Popup to show result */}
                {result != null && (
                    <div className={styles.popup}>
                        <div className={styles.popup_header}>
                            <h1>Task</h1>
                            <button
                                className={styles.exit_btn}
                                onClick={() => setResult(null)}>x
                            </button>
                        </div>
                        <div className={styles.popup_content}>
                        {/* <h2>You are at: {result}</h2> */}
                        <h2>You are at: {names[avatarSquare]} <br/> The task is: {chosenTask} </h2>
                        {/* <h2>You are at: {userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : "Fetching location..."}</h2> */}
                        <button 
                            onClick={() => completeTask()} 
                            disabled={!taskComplete} 
                            style={{ 
                                opacity: taskComplete ? 1 : 0.5, 
                                cursor: taskComplete ? "pointer" : "not-allowed" 
                            }}>
                            OK
                        </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
            <div>
            {/* Points Container */}

            <div className={styles.points_container}>
                <h1>{score} points</h1>
            </div>
            
            {/* How to play popup */}
            <HowToPlay />
        </div>
        </div>
    )
}

export default Board
