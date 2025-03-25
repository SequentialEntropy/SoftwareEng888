/**
 * Spinner.jsx - A spinner component for animating spins and random number generation
 *
 * @file Handles spinner clicks and animations
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @author Dany Kelzi
 * @version 1.1.2
 * @since 17-03-2025
 */

import { useRef, useState } from "react"

import styles from "../styles/Board.module.css"

const totalSections = 12; // 12 sections in the wheel 
const sectionSize = 360 / totalSections; // each section is 30 degrees
const pointerOffset = 15; // adjust to align with the pointer
const numberOrder = [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3]; // exact number order on the spinner

/**
 * Spinner Component 
 * 
 * This component represents the spinner on the board.
 * 
 * @component
 * @returns {JSX.Element} A react component representing the spinner.
 */

function Spinner({
    canSpin,
    onClickSpin,
    onSpinnerAnimationEnd,
}) {
    // Reference to the spinning wheel element
    const spinnerRef = useRef(null)

    // Used for cancelling the animation
    const [animation, setAnimation] = useState(null)
    const [previousEndDegree, setPreviousEndDegree] = useState(0)

    const wheelOfFortune = () => {
        // Cancel onSpinnerAnimationEnd if already spinning
        if (animation) animation.cancel();

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
            // get the correct number from the order listed
            let finalAngle = newEndDegree % 360;
            let landedIndex = Math.floor(((360 - finalAngle) + pointerOffset) / sectionSize) % totalSections;
            let landedNumber = numberOrder[landedIndex];

            onSpinnerAnimationEnd(landedNumber) // run the callback function
        };

        setAnimation(newAnimation)
        setPreviousEndDegree(newEndDegree % 360) // store last rotation
    }

    return (
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
                <button
                    onClick={() => {wheelOfFortune(); onClickSpin()}}
                    disabled={!canSpin}
                    style={{
                        opacity: canSpin ? 1 : 0.5,
                        cursor: canSpin ? "pointer" : "not-allowed",
                    }}
                >SPIN</button>
            </fieldset>
        </div>
    )
}

export default Spinner