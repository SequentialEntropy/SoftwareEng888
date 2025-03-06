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

import { useEffect, useRef, useState } from "react"
import styles from "../styles/Board.module.css"
import api from "../api"
import Spinner from "../components/Spinner"
import HowToPlay from "../components/HowToPlay"
import Chance from "../components/Chance"
import Task from "../components/Task"
import Square from "../components/Square"
import Avatar from "../components/Avatar"

/**
 * Board Component
 * This component represents a spinning wheel that determines the number of squares the user will proceed.
 * @returns {JSX.Element} A board with locations.
 */

function Board() {
    // Game states
    const [score, setScore] = useState(0)
    const [avatarSquare, setAvatarSquare] = useState(0)
    const [chosenTask, setChosenTask] = useState("Loading task...");

    // Toggles
    const [canSpin, setCanSpin] = useState(false)
    const [showTask, setShowTask] = useState(false)
    const [showChance, setShowChance] = useState(false)
    const [getChance, setGetChance] = useState(false)

    // Component refs
    const squareRefs = useRef({})

    // Initialise Avatar location & score
    useEffect(() => {
        // fetch current score and update rendered value
        api.get("/accounts/me/").then(res => res.data.usergamestats?.score).then(
            currentScore => setScore(currentScore)
        )
        // teleport avatar to START
        setAvatarSquare(0)
        setChosenTask(generateRandomTask())
    }, [])

    // Helper functions
    const awardScore = async awardedScore => {
        return api.get("/accounts/me/").then(res => res.data.usergamestats?.score)
        .then(currentScore => {
            setScore(currentScore + awardedScore)
            return api.patch("/accounts/me/", {
                usergamestats: {
                    score: currentScore + awardedScore
                }
            })
        })
    }

    const tasks = ["Use a reusable cup", "Recycle an item", "Use the water fountain","Recycled used paper","Visit a green space","Pick up a piece of litter","Turn off the lights","Donate to the food fridge","Take something from the food fridge","Turn off power outlet after use","Buy a sustainable product","Fill up your water bottle", "Walk to campus", "Try a vegan food", "Read an article on sustainability"]
    const generateRandomTask = () => tasks[Math.floor(Math.random() * tasks.length)]

    // Event handlers
    const onCompleteTask = () => {
        setShowTask(false)
        setCanSpin(true)
        setGetChance(false)
        setChosenTask(generateRandomTask())
        awardScore(10)
    }

    const onSpinnerAnimationEnd = landedNumber => {
        if (landedNumber === 6) { // enable chance when spinner lands on 6
            setGetChance(true)
            setShowChance(true)
        } else {
            setGetChance(false)
            setShowChance(false)
        }
        setShowTask(true)
        setAvatarSquare((avatarSquare + landedNumber) % squares.length) // move avatar
        setCanSpin(false)
        if (avatarSquare + landedNumber >= squares.length) { // passed START
            // awardScore(5)
        }
    }

    // Board layout
    const squares = [
        {id:  0, name: "Start"            , backgroundColor: "#3c3e4c", location: [ 0        ,  0        ]},
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
                <Square {...squares[ 8]} squareRefs={squareRefs}/>
                <Square {...squares[ 9]} squareRefs={squareRefs}/>
                <Square {...squares[10]} squareRefs={squareRefs}/>
                <Square {...squares[11]} squareRefs={squareRefs}/>
                <Square {...squares[12]} squareRefs={squareRefs}/>
                <Square {...squares[13]} squareRefs={squareRefs}/>
                <Square {...squares[ 7]} squareRefs={squareRefs}/>
                <div />
                <div />
                <div />
                <div />
                <Square {...squares[14]} squareRefs={squareRefs}/>
                <Square {...squares[ 6]} squareRefs={squareRefs}/>
                <div />
                <Spinner
                    canSpin={canSpin}
                    onSpinnerAnimationEnd={onSpinnerAnimationEnd}
                />
                <div />
                <div />
                <Task
                    showTask={showTask}
                    setShowTask={setShowTask}
                    square={squares[avatarSquare]}
                    taskName={chosenTask}
                    onCompleteTask={onCompleteTask}
                />
                <Chance
                    setShowChance={setShowChance}
                    getChance={getChance}
                    showChance={showChance}
                />
                <Square {...squares[15]} squareRefs={squareRefs}/>
                <Square {...squares[ 5]} squareRefs={squareRefs}/>
                <Square {...squares[ 4]} squareRefs={squareRefs}/>
                <Square {...squares[ 3]} squareRefs={squareRefs}/>
                <Square {...squares[ 2]} squareRefs={squareRefs}/>
                <Square {...squares[ 1]} squareRefs={squareRefs}/>
                <Square {...squares[ 0]} squareRefs={squareRefs}/>
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
