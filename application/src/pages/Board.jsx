/**
 * Board.jsx - A React component for displaying a board with interactive spinning functionality.
 * 
 * @file Handles rendering of the board and integrates with the 'wheelofFortune' function. 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Yap Wen Xing 
 * @author Genki Asahi
 * @author Dany Kelzi
 * @version 1.1.0 
 * @since 19-02-2025
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../styles/Board.module.css";
import api from "../api";
import Spinner from "../components/Spinner";
import HowToPlay from "../components/HowToPlay";
import Chance from "../components/Chance";
import Task from "../components/Task";
import Square from "../components/Square";
import Avatar from "../components/Avatar";

/**
 * Board Component
 * This component represents a spinning wheel that determines the number of squares the user will proceed.
 * @returns {JSX.Element} A board with locations.
 */

function Board() {
    const [score, setScore] = useState(0);

    const apiGetScore = () => {
        return api.get("/accounts/me/")
        .then(res => res.data.usergamestats.score)
        .then(score => {setScore(score); return score})
    }

    const apiSetScore = (score) => {
        return api.patch("/accounts/me/", {
            usergamestats: {
                score: score
            }
        })
    }

    const apiIncrementScore = (additionalScore) => {
        return apiGetScore().then(score => {apiSetScore(score + additionalScore); setScore(score + additionalScore)})
    }

    useEffect(() => {
        apiGetScore()
        setAvatarSquare(0)
    }, [])

    const [canSpin, setCanSpin] = useState(false)

    const squareRefs = useRef({});
    const [avatarSquare, setAvatarSquare] = useState(0)
    const chosenTask = useState("Pick up one cup")

    // Chance card activation
    const [getChance, setGetChance] = useState(null);

    const completeTask = () => {
        setShowTask(false)
        setCanSpin(true)
        setGetChance(false)
        apiIncrementScore(10)
    }

    const onSpinnerAnimationEnd = landedNumber => {
        if (landedNumber === 6) { // enable chance when spinner lands on 6
            setGetChance(true)
            setShowChance(true)
        } else{
            setGetChance(false)
            setShowChance(false)
        }
        setShowTask(true)
        setAvatarSquare((avatarSquare + landedNumber) % squares.length) // move avatar
        setCanSpin(false)
        if (avatarSquare + landedNumber >= squares.length) { // passed START
            // apiIncrementScore(5)
        }
    }
    
    const squares = [
        {id:  0, name: "Start"            , backgroundColor: "#3c3e4c", location: [50.7352025, -3.5331998]}, // TODO: copied from #4 for demo
        {id:  1, name: "Birks Grange"     , backgroundColor: "#7f95d1", location: [50.7352025, -3.5331998]}, // TODO: copied from #4 for demo
        {id:  2, name: "East Park"        , backgroundColor: "#558564", location: [50.7352025, -3.5331998]}, // TODO: copied from #4 for demo
        {id:  3, name: "Peter Chalk"      , backgroundColor: "#7f2982", location: [50.7352025, -3.5331998]}, // TODO: copied from #4 for demo
        {id:  4, name: "Forum"            , backgroundColor: "#ea526f", location: [50.7352025, -3.5331998]},
        {id:  5, name: "Great Hall"       , backgroundColor: "#558564", location: [50.7354678, -3.5346157]},
        {id:  6, name: "Reed Hall"        , backgroundColor: "#7f95d1", location: [50.7288   , -3.5060   ]},
        {id:  7, name: "Harrison"         , backgroundColor: "#e98a15", location: [50.7288   , -3.5060   ]},
        {id:  8, name: "Innovation Centre", backgroundColor: "#7f2982", location: [50.7383339, -3.5307875]},
        {id:  9, name: "INTO Building"    , backgroundColor: "#ea526f", location: [50.7288   , -3.5060   ]},
        {id: 10, name: "Streatham Court"  , backgroundColor: "#558564", location: [50.7288   , -3.5060   ]},
        {id: 11, name: "Hatherly"         , backgroundColor: "#7f95d1", location: [50.734187 , -3.533157 ]},
        {id: 12, name: "Old Library"      , backgroundColor: "#e98a15", location: [50.7333275, -3.5343472]},
        {id: 13, name: "Queens"           , backgroundColor: "#7f2982", location: [50.7342858, -3.5344508]},
        {id: 14, name: "Amory"            , backgroundColor: "#ea526f", location: [50.7364241, -3.5316993]},
        {id: 15, name: "Business School"  , backgroundColor: "#558564", location: [50.7288   , -3.5060   ]},
    ]

    const [showChance, setShowChance] = useState(false);
    const [showTask, setShowTask] = useState(false)

    return (
        <div className={styles.game}>
            <nav>
                <div className={styles.sidebar} style={{marginLeft: "20px"}}>
                    <div className={styles.logoContainer}>
                        <h2 className={styles.logoText}>cliMate</h2>
                    </div>
                    <a href="home"><i className="bi bi-house-door-fill" style={{fontSize: "48px"}} ></i></a>
                    <a href="board"><i className="bi bi-dice-3-fill" style={{fontSize: "48px"}} ></i></a>
                    <a href="map"><i className="bi bi-map-fill" style={{fontSize: "48px"}} ></i></a>
                    <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "48px"}} ></i></a>
                    <a href="logout"><i className="bi bi-box-arrow-right" style={{fontSize: "48px"}} ></i></a>
                    {/* <a href="{% url 'password_change' %}">Password Change</a> */}
                </div>
                
            </nav>
            <div className={styles.main_board}>
                {/* Avatar */}
                <Avatar avatarSquare={avatarSquare} squareRefs={squareRefs} />

                {/* Board items representing locations on campus */}
                {Square(squares[ 8], squareRefs)}
                {Square(squares[ 9], squareRefs)}
                {Square(squares[10], squareRefs)}
                {Square(squares[11], squareRefs)}
                {Square(squares[12], squareRefs)}
                {Square(squares[13], squareRefs)}
                {Square(squares[ 7], squareRefs)}
                <div />
                <div />
                <div />
                <div />
                {Square(squares[14], squareRefs)}
                {Square(squares[ 6], squareRefs)}
                <div />
                <div>
                    <Spinner
                        canSpin={canSpin}
                        onSpinnerAnimationEnd={onSpinnerAnimationEnd}
                    />
                </div>
                <div />
                <div />
                <div className={styles.task_deck}>
                    {/* Task Button */}
                    <button className={styles.task_btn} onClick={() => { setShowTask(true) }}>Task</button>
                </div>
                <Chance
                    setShowChance={setShowChance}
                    getChance={getChance}
                    showChance={showChance}
                />
                {Square(squares[15], squareRefs)}
                {Square(squares[ 5], squareRefs)}
                {Square(squares[ 4], squareRefs)}
                {Square(squares[ 3], squareRefs)}
                {Square(squares[ 2], squareRefs)}
                {Square(squares[ 1], squareRefs)}
                {Square(squares[ 0], squareRefs)}

                <Task
                    showTask={showTask}
                    setShowTask={setShowTask}
                    square={squares[avatarSquare]}
                    taskName={chosenTask}
                    completeTask={completeTask}
                />

            </div>
            <div>
                {/* Points Container */}

                <div className={styles.points_container}>
                    <h1>{score} points</h1>
                </div>
                
                {/* How to play popup */}
                <HowToPlay />
            </div>
        </div>
    )
}

export default Board
