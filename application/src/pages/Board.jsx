import styles from "../styles/Board.module.css"

function Board() {
    return  <div className={styles.main_board}>
        <div className={styles.avatar}>
            <i className="bi bi-bicycle"></i>
        </div>
        <div className={styles.item}>
            <h3>Peter Chalk</h3>
        </div>
        <div className={styles.item}>
            <h3>Forum</h3>
        </div>
        <div className={styles.item}>
            <h3>Great Hall</h3>
        </div>
        <div className={styles.item}>
            <h3>Reed Hall</h3>
        </div>
        <div className={styles.item}>
            <h3>Harrison</h3>
        </div>
        <div className={styles.item}>
            <h3>Innovation centre</h3>
        </div>
        <div className={styles.item}>
            <h3>East Park</h3>
        </div>
        <div />
        <div />
        <div />
        <div />
        <div className={styles.item}>
            <h3>INTO building</h3>
        </div>
        <div className={styles.item}>
            <h3>Birks Grange</h3>
        </div>
        <div />
        <div>
            <fieldset className={styles.spinner}>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                </ul>
                <button type="button">SPIN</button>
            </fieldset>
        </div>
        
        <div />
        <div />
        <div className={styles.item}> 
            <h3>Streatham Court</h3>       
        </div>
        <div className={styles.item}>
            <h3>Start</h3>
        </div>
        <div className={styles.item}>
            <h3>Business School</h3>
    
        </div>
        <div className={styles.item}>
            <h3>Amory</h3>

        </div>
        <div className={styles.item}>
            <h3>Queens</h3>
        </div>
        <div className={styles.item}>
            <h3>Old library</h3>
        </div>
        <div className={styles.item}>
            <h3>Hatherly</h3>
        </div>
    </div>
}

export default Board