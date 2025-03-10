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
    consg
    const [showChance, setShowChance] = useState(false)
    const [getChance, setGetChance] = useState(false)

    // Component refs
    const squareRefs = useRef({})

    // Initialise Avatar location & score
    useEffect(() => {
        // fetch current score and update rendered value
        api.get("/accounts/me/").then(res => res.data.usergamestats).then(
            usergamestats => {
                // initialise score
                setScore(usergamestats.score)
                // teleport avatar to START
                setAvatarSquare(usergamestats.current_square)
            }
        )
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

    const advanceSquare = squareCount => {
        return api.get("/accounts/me/").then(res => res.data.usergamestats?.current_square)
        .then(currentSquare => {
            const newSquare = (currentSquare + squareCount) % squares.length
            setAvatarSquare(newSquare)
            return api.patch("/accounts/me/", {
                usergamestats: {
                    current_square: newSquare
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
        advanceSquare(landedNumber)
        // setAvatarSquare((avatarSquare + landedNumber) % squares.length) // move avatar
        setCanSpin(false)
        if (avatarSquare + landedNumber >= squares.length) { // passed START
            // awardScore(5)
        }
    }

    // Board layout
    const squares = [
        {id:  0, name: "Start"            , backgroundColor: "#3c3e4c", location: [ 0        ,  0        ]},
        {id:  1, name: "Birks Grange"     , backgroundColor: "#7f95d1", location: [50.73655640077589, -3.5426938147256894]}, 
        {id:  2, name: "East Park"        , backgroundColor: "#558564", location: [50.73774365237917, -3.5274479919029176]},
        {id:  3, name: "Peter Chalk"      , backgroundColor: "#7f2982", location: [50.73621570756194, -3.5360560850693217]}, 
        {id:  4, name: "Forum"            , backgroundColor: "#ea526f", location: [50.73520737891607, -3.533907682035006]},
        {id:  5, name: "Great Hall"       , backgroundColor: "#558564", location: [50.73541359764122, -3.534757953935785]},
        {id:  6, name: "Reed Hall"        , backgroundColor: "#7f95d1", location: [50.73524081401744, -3.5374778520320156]},
        {id:  7, name: "Harrison"         , backgroundColor: "#e98a15", location: [50.73773693957766, -3.5324168459325818]},
        {id:  8, name: "Innovation Centre", backgroundColor: "#7f2982", location: [50.73840552463827, -3.5310835404302385]},
        {id:  9, name: "INTO Building"    , backgroundColor: "#ea526f", location: [50.73608348132103, -3.53389156394202]},
        {id: 10, name: "Streatham Court"  , backgroundColor: "#558564", location: [50.73659522401942, -3.535152102267711]},
        {id: 11, name: "Hatherly"         , backgroundColor: "#7f95d1", location: [50.73400605799908, -3.5331780674581252]},
        {id: 12, name: "Old Library"      , backgroundColor: "#e98a15", location: [50.73335507931347, -3.534012873488209]},
        {id: 13, name: "Queens"           , backgroundColor: "#7f2982", location: [50.73399656520741, -3.535028372328278]},
        {id: 14, name: "Amory"            , backgroundColor: "#ea526f", location: [50.73654094948761, -3.531638658536732]},
        {id: 15, name: "Business School"  , backgroundColor: "#558564", location: [50.73549527834785, -3.5301086620942534]},
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
