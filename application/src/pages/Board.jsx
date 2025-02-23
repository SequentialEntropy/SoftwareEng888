/**
 * Board.jsx - A React component for displaying a board with interactive spinning functionality.
 * 
 * @file Handles rendering of the board and integrates with the 'wheelofFortune' function. 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Yap Wen Xing 
 * @version 1.1.0 
 * @since 19-02-2025
 */

import { useEffect, useRef, useState } from "react";
import styles from "../styles/Board.module.css";

/**
 * Board Component
 * This component represents a spinning wheel that determines the number of squares the user will proceed.
 * @returns {JSX.Element} A board with locations.
 */

function Board() {
    // Reference to the spinning wheel element
    const spinnerRef = useRef(null);

    // Reference to the spin button element
    const buttonRef = useRef(null);

    // State to store the selected result
    const [result, setResult] = useState(null); 

    /**
     * Initialises the spinning wheel effect
     */

    useEffect(() => {
        if (spinnerRef.current && buttonRef.current) {
            wheelOfFortune(spinnerRef.current, buttonRef.current, setResult);
        }
    }, []);

    return (
        <div className={styles.main_board}>
            {/* Board items representing locations on campus */}
            <div className={styles.item}>
                <h3>Peter Chalk</h3>
            </div>
            <div className={styles.item}>
                <h3>Forum</h3>
            </div>
            <div className={styles.item}>
                <h3>Great Hall</h3>
            </div>
            <div className={styles.item}>
                <h3>Reed Hall</h3>
            </div>
            <div className={styles.item}>
                <h3>Harrison</h3>
            </div>
            <div className={styles.item}>
                <h3>Innovation Centre</h3>
            </div>
            <div className={styles.item}>
                <h3>East Park</h3>
            </div>
            <div />
            <div />
            <div />
            <div />
            <div className={styles.item}>
                <h3>INTO Building</h3>
            </div>
            <div className={styles.item}>
                <h3>Birks Grange</h3>
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
            <div className={styles.item}>
                <h3>Streatham Court</h3>
            </div>
            <div className={styles.item}>
                <h3>Start</h3>
            </div>
            <div className={styles.item}>
                <h3>Business School</h3>
            </div>
            <div className={styles.item}>
                <h3>Amory</h3>
            </div>
            <div className={styles.item}>
                <h3>Queens</h3>
            </div>
            <div className={styles.item}>
                <h3>Old Library</h3>
            </div>
            <div className={styles.item}>
                <h3>Hatherly</h3>
            </div>

            {/* Popup to show result */}
            {result !== null && (
                <div className={styles.popup}>
                    <div className={styles.popup_content}>
                        <h2>You landed on: {result}</h2>
                        <button onClick={() => setResult(null)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Function for spinner to spin and show result
function wheelOfFortune(wheel, button, setResult) {
    let animation;
    let previousEndDegree = 0;
    const totalSections = 12; // 12 sections in the wheel 
    const sectionSize = 360 / totalSections; // Each section is 30 degrees
    const pointerOffset = 15; // Adjust to align with the pointer

    // Exact number order on the spinner
    const numberOrder = [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3];

    button.addEventListener("click", () => {
        if (animation) {
            animation.cancel();
        }

        const randomAdditionalDegrees = Math.random() * 360 + 1800; 
        const newEndDegree = previousEndDegree + randomAdditionalDegrees;

        // Animate rotation
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
            // Normalize the final rotation angle 
            let finalAngle = newEndDegree % 360;

            // Adjust to align with the top pointer correctly
            let landedIndex = Math.floor(((360 - finalAngle) + pointerOffset) / sectionSize) % totalSections;

            // Get the correct number from the order listed 
            let landedNumber = numberOrder[landedIndex];

            // Display result
            setResult(landedNumber); 
        };

        // Store last rotation
        previousEndDegree = newEndDegree; 
    });
}

export default Board;