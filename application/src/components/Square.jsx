/**
 * Square.jsx - A reusable square component for all squares on the board.
 *
 * @file Represents a square on the board
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
 * Square Component 
 * 
 * This component represents the square on the board.
 * 
 * @component
 * @returns {JSX.Element} A react component representing the squares.
 */

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