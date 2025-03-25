/**
 * HowToPlay.jsx - A popup modal explaining the rules of the game
 *
 * @file Represents the popup modal
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @author Dany Kelzi
 * @version 1.1.2
 * @since 17-03-2025
 */

import { useState } from "react"
import styles from "../styles/Board.module.css"

/**
 * HowToPlay Component 
 * 
 * This component represents the help icon and popup modal.
 * 
 * @component
 * @returns {JSX.Element} A react component representing the HowToPlay functionalities.
 */

function HowToPlay() {
    const [showHowToPlay, setShowHowToPlay] = useState(false)

    return (
        <div>
            <button className={styles.how_to_play_btn} onClick={() => setShowHowToPlay(true)}>?</button>

            {showHowToPlay && (
                <div className={styles.overlay}>
                    <div className={styles.how_to_play_container2}>
                        <div className={styles.how_to_play_container3}>
                            <h2 className={styles.how_to_play_title}>How to Play</h2>
                        </div>
                        <p className={styles.how_to_play_instructions}>1. Spin the wheel <br></br>2. Do task at specified location <br></br>3. Claim points <br></br> 4. Battle your friends on the leaderboard!</p>
                        <button
                        className={styles.exit_btn}
                        onClick={() => setShowHowToPlay(false)}>x
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HowToPlay
