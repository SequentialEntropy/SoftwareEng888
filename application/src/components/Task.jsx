import styles from "../styles/Board.module.css"

export default function Task({result, setResult, squares, avatarSquare, chosenTask, completeTask, taskComplete}) {
    return (
        <div>
            {result != null && (
                <div className={styles.popup}>
                    <div className={styles.popup_header}>
                        <h1>Task</h1>
                        <button
                            className={styles.exit_btn}
                            onClick={() => setResult(null)}>x
                        </button>
                    </div>
                    <div className={styles.popup_content}>
                    <h2>You are at: {squares[avatarSquare].name} <br/> The task is: {chosenTask} </h2>
                    <button
                        onClick={() => completeTask()}
                        disabled={!taskComplete}
                        style={{
                            opacity: taskComplete ? 1 : 0.5,
                            cursor: taskComplete ? "pointer" : "not-allowed"
                        }}>
                        OK
                    </button>
                    </div>
                </div>
            )}
        </div>
    )
}