import { useState, useEffect } from "react";
import styles from "../styles/DisplayToggle.module.css"

export default function DisplayToggle(){
    const [isAccessible, setAccessible] = useState(false);

    useEffect(() => {
        if (isAccessible) {
          document.body.classList.add("accessible-mode");
        } else {
          document.body.classList.remove("accessible-mode");
        }
        return () => {
            document.body.classList.remove("accessible-mode");
        };
    }, [isAccessible]);

    return (
        <button
          onClick={() => setAccessible((prev) => !prev)}
          className={styles.toggle}
        >
          {isAccessible ? "Turn Off" : "Turn On"}
        </button>
      );
}
