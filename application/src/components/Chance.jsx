/**
 * HowToPlay.jsx - A popup modal displaying the chosen chance card
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

import styles from "../styles/Board.module.css"

/**
 * Chance Component 
 * 
 * This component represents the chance popup modal.
 * 
 * @component
 * @returns {JSX.Element} A react component representing the Chance functionalities.
 */

export default function Chance({showChance, setShowChance, getChance, chance, onClickChance}) {
    return (
        <div className={styles.chance_deck}>
            {/* Chance Card Button */}

            <button
                className={styles.task_btn}
                onClick={() => {setShowChance(true); onClickChance()}}
                disabled = {!getChance}
                style={{
                    opacity: getChance ? 1 : 0.5,
                    cursor: getChance ? "pointer" : "not-allowed",
                }}
            >Chance</button>

            {/* Chance Card Popup - only available after landing on 6 */}
            {showChance && (
                <div className = {styles.chance_popup}>
                    <div className = {styles.chance_header}> 
                        <h1>Chance</h1>
                        <button
                            className={styles.exit_btn}
                            onClick={() => setShowChance(false)}>x
                        </button>
                    </div>
                    <div className={styles.chance_content}>
                        <h2>{chance.description}</h2>
                        <h2>{chance.score_to_award} Points!</h2>
                    </div>

                </div>
            )}
        </div>
    )
}