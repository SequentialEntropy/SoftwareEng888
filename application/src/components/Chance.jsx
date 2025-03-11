import styles from "../styles/Board.module.css"

export default function Chance({setShowChance, getChance, showChance, onClickChance}) {
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
                        <h2>+5 Points!</h2>
                    </div>

                </div>
            )}
        </div>
    )
}