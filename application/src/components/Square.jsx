import styles from "../styles/Board.module.css"

export default function Square({id, name, backgroundColor}, squareRefs) {
    return (
        <div className={styles.item} key={id} ref={e => {squareRefs.current[id] = e}} style={id === 0 ? {backgroundColor} : {}}>
            {id === 0 ? (
                <h3 style={{color: '#d9d9d9', fontSize: '50px', transform: 'rotate(-25deg)', margin:'auto', letterSpacing: '5px'}}>START</h3>
            ) : (
                <div className={styles.tile_bar} style={{backgroundColor: backgroundColor}}>
                    <h3>{name}</h3>
                </div>
            )}
        </div>
    )
}