import styles from "../styles/Board.module.css"

export default function Task({showTask, setShowTask, squareName, taskName, completeTask, isTaskCompletable}) {
    return (
        <div>
            {showTask && (
                <div className={styles.popup}>
                    <div className={styles.popup_header}>
                        <h1>Task</h1>
                        <button 
                            className={styles.exit_btn}
                            onClick={() => setShowTask(false)}>x
                        </button>
                    </div>
                    <div className={styles.popup_content}>
                    <h2>You are at: {squareName} <br/> The task is: {taskName} </h2>
                    <button
                        onClick={() => completeTask()}
                        disabled={!isTaskCompletable}
                        style={{
                            opacity: isTaskCompletable ? 1 : 0.5,
                            cursor: isTaskCompletable ? "pointer" : "not-allowed"
                        }}>
                        OK
                    </button>
                    </div>
                </div>
            )}
        </div>
    )
}