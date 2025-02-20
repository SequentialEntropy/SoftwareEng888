import { useEffect, useRef, useState } from "react";
import styles from "../styles/Board.module.css";

function Board() {
    const spinnerRef = useRef(null);
    const buttonRef = useRef(null);
    const [result, setResult] = useState(null); // stores the result

    useEffect(() => {
        if (spinnerRef.current && buttonRef.current) {
            wheelOfFortune(spinnerRef.current, buttonRef.current, setResult);
        }
    }, []);

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
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#7f2982'}}>
                      <h3>Peter Chalk</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#ea526f'}}>
                      <h3>Forum</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#558564'}}>
                      <h3>Great Hall</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#7f95d1'}}>
                      <h3>Reed Hall</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#e98a15'}}>
                      <h3>Harrison</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#7f2982'}}>
                      <h3>Innovation Centre</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#558564'}}>
                      <h3>East Park</h3>
                    </div>
                </div>
                <div />
                <div />
                <div />
                <div />
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#ea526f'}}>
                      <h3>INTO Building</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#7f95d1'}}>
                      <h3>Birks Grange</h3>
                    </div>
                </div>
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
                        <button ref={buttonRef} type="button">SPIN</button>
                    </fieldset>
                </div>
                <div />
                <div />
                <div className={styles.task_deck}>
                    <h1>Task</h1>
                </div>
                <div className={styles.chance_deck}>
                    <h1>Chance</h1>
        
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#558564'}}>
                      <h3>Streatham Court</h3>
                    </div>
                </div>
                <div className={styles.item} style={{backgroundColor: '#3c3e4c'}}>
                    <h3 style={{color: '#d9d9d9', fontSize: '50px', transform: 'rotate(-25deg)', margin:'auto', letterSpacing: '5px'}}>START</h3>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#558564'}}>
                      <h3>Business School</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#ea526f'}}>
                      <h3>Amory</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#7f2982'}}>
                      <h3>Queens</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#e98a15'}}>
                      <h3>Old Library</h3>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.tile_bar} style={{backgroundColor: '#7f95d1'}}>
                      <h3>Hatherly</h3>
                    </div>
                </div>

                {/* popup to show result */}
                {result !== null && (
                    <div className={styles.popup}>
                        <div className={styles.popup_content}>
                            <h2>You landed on: {result}</h2>
                            <button onClick={() => setResult(null)}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

//function for spinner to spin and show result
function wheelOfFortune(wheel, button, setResult) {
    let animation;
    let previousEndDegree = 0;
    const totalSections = 12; // 12 sections in the wheel 
    const sectionSize = 360 / totalSections; // each section is 30 degrees
    const pointerOffset = 15; // adjust to align with the pointer

    // exact number order on the spinner
    const numberOrder = [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3];

    button.addEventListener("click", () => {
        if (animation) {
            animation.cancel();
        }

        const randomAdditionalDegrees = Math.random() * 360 + 1800; 
        const newEndDegree = previousEndDegree + randomAdditionalDegrees;

        // animate rotation
        animation = wheel.animate(
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

        animation.onfinish = () => {
            // normalize the final rotation angle 
            let finalAngle = newEndDegree % 360;

            // adjust to align with the top pointer correctly
            let landedIndex = Math.floor(((360 - finalAngle) + pointerOffset) / sectionSize) % totalSections;

            // get the correct number from the order listed 
            let landedNumber = numberOrder[landedIndex];

            setResult(landedNumber); // display result
        };

        previousEndDegree = newEndDegree; // store last rotation
    });
}

export default Board;