import { useState } from "react"
import styles from "../styles/Board.module.css"

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
                        <p className={styles.how_to_play_instructions}>1. Spin the wheel <br></br>2. Do task at specified location <br></br>3. Click OK once task is completed <br></br> 4. Get points and view your position on the leaderboard</p>
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
