import { useRef, useState } from "react";
import styles from "../styles/Board.module.css";

function Board() {
    const spinnerRef = useRef(null);
    const [result, setResult] = useState(null); // stores the result
    const [previousEndDegree, setPreviousEndDegree] = useState(0)
    const [animation, setAnimation] = useState(null)

    const totalSections = 12; // 12 sections in the wheel 
    const sectionSize = 360 / totalSections; // each section is 30 degrees
    const pointerOffset = 15; // adjust to align with the pointer

    // exact number order on the spinner
    const numberOrder = [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3];


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
        };

        setAnimation(newAnimation)
        setPreviousEndDegree(newEndDegree % 360) // store last rotation
    }

    return (
        <div className={styles.main_board}>
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
                    <button onClick={wheelOfFortune} type="button">SPIN</button>
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
    );
}

export default Board;