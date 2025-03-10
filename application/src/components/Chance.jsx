import styles from "../styles/Board.module.css"

export default function Chance({setShowChance, getChance, showChance}) {
    return (
        <div className={styles.chance_deck} style={{opacity: getChance ? 1 : 0.5}}>
            {/* Chance Card Button */}

            <button
                className={styles.task_btn}
                onClick={() => setShowChance(true)}
                disabled = {!getChance}
                style={{cursor: getChance ? "pointer" : "not-allowed"}}
            >Chance</button>

            {/* Chance Card Popup - only available after landing on 6 */}
            {getChance && showChance && (
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