import { useEffect, useRef, useState } from "react";
import styles from "../styles/Board.module.css";

function Board() {
    const spinnerRef = useRef(null);
    const [result, setResult] = useState(null); // stores the result
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

    useEffect(() => {
        teleportAvatar(0)
    }, [])

    const teleportAvatar = (squareId) => {
        console.log(squareId)
        const pos = squareRefs.current[squareId].getBoundingClientRect()
        setAvatarPos([pos.top, pos.left])
        
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

            teleportAvatar((avatarSquare + landedNumber) % squares.length)
        };

        setAnimation(newAnimation)
        setPreviousEndDegree(newEndDegree % 360) // store last rotation
    }

    const BoardSquare = (id, name) => {
        return <div className={styles.item} key={id} ref={e => {squareRefs.current[id] = e}}>
            <h3>{name}</h3>
        </div>
    }

    const squares = [
        BoardSquare(0,  "Start"            ),
        BoardSquare(1,  "Birks Grange"     ),
        BoardSquare(2,  "East Park"        ),
        BoardSquare(3,  "Peter Chalk"      ),
        BoardSquare(4,  "Forum"            ),
        BoardSquare(5,  "Great Hall"       ),
        BoardSquare(6,  "Reed Hall"        ),
        BoardSquare(7,  "Harrison"         ),
        BoardSquare(8,  "Innovation Centre"),
        BoardSquare(9,  "INTO Building"    ),
        BoardSquare(10, "Streatham Court"  ),
        BoardSquare(11, "Hatherly"         ),
        BoardSquare(12, "Old Library"      ),
        BoardSquare(13, "Queens"           ),
        BoardSquare(14, "Amory"            ),
        BoardSquare(15, "Business School"  ),
    ]

    return (
        <div className={styles.main_board}>
            <div ref={avatarRef} className={styles.avatar} style={{
                top: avatarPos[0] + 65,
                left: avatarPos[1] + 60,
            }}>
                <i className="bi bi-bicycle"></i>
            </div>
            {squares[3]}
            {squares[4]}
            {squares[5]}
            {squares[6]}
            {squares[7]}
            {squares[8]}
            {squares[2]}
            <div />
            <div />
            <div />
            <div />
            {squares[9]}
            {squares[1]}
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
            {squares[10]}
            {squares[0]}
            {squares[15]}
            {squares[14]}
            {squares[13]}
            {squares[12]}
            {squares[11]}

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
    )
}

export default Board;