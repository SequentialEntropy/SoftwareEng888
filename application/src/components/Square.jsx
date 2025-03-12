import styles from "../styles/Board.module.css"

export default function Square({id, name, backgroundColor, squareRefs}) {
    const isStartSquare = id === 0

    return (
        isStartSquare ? (
            <div className={styles.item} key={id} ref={e => {squareRefs.current[id] = e}} style={{backgroundColor}}>
                <h3 style={{color: '#d9d9d9', fontSize: '5vw', margin:'auto', letterSpacing: '0.1vw'}}>
                    START
                </h3>
            </div>
        ) : (
            <div className={styles.item} key={id} ref={e => {squareRefs.current[id] = e}}>
                <div className={styles.tile_bar} style={{backgroundColor: backgroundColor}}>
                    <h3>{name}</h3>
                </div>
            </div>
        )
    )
}