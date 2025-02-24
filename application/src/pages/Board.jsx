/**
 * Board.jsx - A React component for displaying a board with interactive spinning functionality.
 * 
 * @file Handles rendering of the board and integrates with the 'wheelofFortune' function. 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Yap Wen Xing 
 * @author Genki Asahi
 * @version 1.1.0 
 * @since 19-02-2025
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../styles/Board.module.css";

/**
 * Board Component
 * This component represents a spinning wheel that determines the number of squares the user will proceed.
 * @returns {JSX.Element} A board with locations.
 */

function Board() {
    // Reference to the spinning wheel element
    const spinnerRef = useRef(null);
    // State to store the selected result
    const [result, setResult] = useState(null);

    const [previousEndDegree, setPreviousEndDegree] = useState(0)
    const [animation, setAnimation] = useState(null)

    const totalSections = 12; // 12 sections in the wheel 
    const sectionSize = 360 / totalSections; // each section is 30 degrees
    const pointerOffset = 15; // adjust to align with the pointer
    const numberOrder = [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3]; // exact number order on the spinner
    
    const squareRefs = useRef({});
    const avatarRef = useRef(null);
    const [avatarPos, setAvatarPos] = useState([0, 0])
    const [avatarSquare, setAvatarSquare] = useState(0)
    const [userLocation, setUserLocation] = useState(null);
    const [canClick, setCanClick] = useState(true);
    const [taskComplete, setTaskComplete] = useState(true);
    
    {/*Chance card activatio*/}
    const [getChance, setGetChance] = useState(null);


    /**
     * Initialises the spinning wheel effect
     */
    useEffect(() => {
        teleportAvatar(0)
    }, [])
    const checkLocation = () => {         
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    setUserLocation({ latitude, longitude });

                    // Define your allowed location (Example: New York)
                    const allowedLatitude = 50.7288;
                    const allowedLongitude = -3.5060;
                    const threshold = 0.1; // Allow slight variation
                    if (
                        Math.abs(latitude - allowedLatitude) < threshold &&
                        Math.abs(longitude - allowedLongitude) < threshold) {
                        setCanClick(true);
                    } else {    
                        setCanClick(false);
                        setError("You're not in the required location.");
                    }
                },
                (error) => console.error("Error fetching location:", error)
            );
        }
    };
    const teleportAvatar = (squareId) => {
        console.log(squareRefs.current[squareId])
        const pos = squareRefs.current[squareId].getBoundingClientRect()
        const offsetPos = avatarRef.current.offsetParent.getBoundingClientRect();
        setAvatarPos([pos.top + window.scrollY - offsetPos.top, pos.left + window.scrollX - offsetPos.left])
        
        setAvatarSquare(squareId)
    }

    const wheelOfFortune = () => {
        if (animation) {
            animation.cancel();
        }

        const randomAdditionalDegrees = Math.random() * 360 + 1800; 
        const newEndDegree = previousEndDegree + randomAdditionalDegrees;

        // animate rotation
        const newAnimation = spinnerRef.current.animate(
            [
                { transform: `rotate(${previousEndDegree}deg)` },
                { transform: `rotate(${newEndDegree}deg)` },
            ],  
            {
                duration: 4000,
                easing: "cubic-bezier(0.440, -0.205, 0.000, 1.130)", 
                fill: "forwards",
            }
        );
        
        newAnimation.onfinish = () => {
            // normalize the final rotation angle 
            let finalAngle = newEndDegree % 360;

            // adjust to align with the top pointer correctly
            let landedIndex = Math.floor(((360 - finalAngle) + pointerOffset) / sectionSize) % totalSections;

            // get the correct number from the order listed 
            let landedNumber = numberOrder[landedIndex];

            setResult(landedNumber); // display result

            if(landedNumber == 6){
                setGetChance(true);
                setShowChance(true);
            } else{
                setGetChance(false);
                setShowChance(false);
            }

            teleportAvatar((avatarSquare + landedNumber) % squares.length)
            setTaskComplete(false)
            checkLocation()
        };

        setAnimation(newAnimation)
        setPreviousEndDegree(newEndDegree % 360) // store last rotation
    }
    const taskFunction = () => {
        checkLocation()
        setResult(true)
    }
    const completeTask =() => {
        setResult(null)
        setTaskComplete(true)
        setGetChance(false)
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
    const [showPopup, setShowPopup] = useState(false);

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
                    <fieldset className={styles.spinner}>
                        <ul ref={spinnerRef}>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                            <li>6</li>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                            <li>6</li>
                            
                        </ul>
                        <button onClick={wheelOfFortune} type="button"
                        disabled={!taskComplete} 
                        style={{ 
                            opacity: canClick ? 1 : 0.5, 
                            cursor: canClick ? "pointer" : "not-allowed" 
                        }}>SPIN</button>
                    </fieldset>
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
                        <h2>You are at: {userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : "Fetching location..."}</h2>
                        <button 
                            onClick={() => setResult(null)} 
                            disabled={!canClick} 
    
                            style={{ 
                                opacity: canClick ? 1 : 0.5, 
                                cursor: canClick ? "pointer" : "not-allowed" 
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
                <div className={styles.item} style={{backgroundColor: '#3c3c4c'}} key={0} ref={e => {squareRefs.current[0] = e}}>
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
                        <h2>You are at: {userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : "Fetching location..."}</h2>
                        <button 
                            onClick={() => completeTask()} 
                            disabled={!canClick} 
                            style={{ 
                                opacity: canClick ? 1 : 0.5, 
                                cursor: canClick ? "pointer" : "not-allowed" 
                            }}>
                            OK
                        </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
             <div>

                {/* How to play popup */}
                <button className={styles.how_to_play_btn} onClick={() => setShowPopup(true)}>?</button>
    
                {showPopup && (
                    <div className={styles.overlay}>
                        <div className={styles.how_to_play_container2}>
                            <div className={styles.how_to_play_container3}>
                                <h2 className={styles.how_to_play_title}>How to Play</h2>
                            </div>
                            <p className={styles.how_to_play_instructions}>1. Spin the wheel <br></br>2. Do task at specified location <br></br>3. Scan QR to verify completion <br></br> 4. Get trees</p>
                            <button
                            className={styles.exit_btn}
                            onClick={() => setShowPopup(false)}>x
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        
    )
}

export default Board