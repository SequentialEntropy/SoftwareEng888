import { useRef, useState } from "react"

import styles from "../styles/Board.module.css"

function Spinner({
    canSpin,
    setCanSpin,
    callback,
    setResult,
    setGetChance,
    setShowChance,
    setTaskComplete,
    checkLocation,
    avatarSquare,
    setAvatarSquare,
    squareRefs,
    userLocation
}) {
    // Reference to the spinning wheel element
    const spinnerRef = useRef(null)

    // Used for cancelling the animation
    const [animation, setAnimation] = useState(null)
    const [previousEndDegree, setPreviousEndDegree] = useState(0)

    const totalSections = 12; // 12 sections in the wheel 
    const sectionSize = 360 / totalSections; // each section is 30 degrees
    const pointerOffset = 15; // adjust to align with the pointer
    const numberOrder = [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3]; // exact number order on the spinner

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

            // adjust to align with the top pointer 
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

            const totalSquares = Object.keys(squareRefs.current).length

            setAvatarSquare((avatarSquare + landedNumber) % totalSquares)
            setCanSpin(false)
            console.log("squareRefs.current.length =", totalSquares)
            if (avatarSquare + landedNumber >= totalSquares) { // passed START
                // apiIncrementScore(5)
            }
            setTaskComplete(false)
            checkLocation(userLocation.latitude, userLocation.longitude)
        };

        setAnimation(newAnimation)
        setPreviousEndDegree(newEndDegree % 360) // store last rotation
    }

    return (
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
            <button onClick={() => {
                callback()
                wheelOfFortune()
            }}
            disabled={!canSpin}
            style={{
                opacity: canSpin ? 1 : 0.5,
                cursor: canSpin ? "pointer" : "not-allowed",
            }}>SPIN</button>
        </fieldset>
    )
}

export default Spinner