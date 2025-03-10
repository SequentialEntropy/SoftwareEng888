import { useEffect, useRef, useState } from "react"
import styles from "../styles/Board.module.css"

export default function Avatar({avatarSquare, squareRefs}) {
    const avatarRef = useRef(null)
    const [avatarPos, setAvatarPos] = useState({
        x: 0,
        y: 0,
    })

    // Automatically teleport avatar when avatarSquare is changed
    useEffect(() => {
        const pos = squareRefs.current[avatarSquare].getBoundingClientRect()
        const offsetPos = avatarRef.current.offsetParent.getBoundingClientRect()
        const avatarPos = avatarRef.current.getBoundingClientRect()
        setAvatarPos({
            x: pos.top + (pos.height - avatarPos.height) * 0.2 + window.scrollY - offsetPos.top,
            y: pos.left + (pos.width - avatarPos.width) * 0.5 + window.scrollX - offsetPos.left,
        })
    }, [avatarSquare])

    return (
        <div ref={avatarRef} className={styles.avatar} style={{
            top: avatarPos.x,
            left: avatarPos.y,
        }}>
            <i className="bi bi-bicycle"></i>
        </div>
    )
}