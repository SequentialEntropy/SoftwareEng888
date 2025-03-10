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
    const taskNotFound = {id: -1, description: "No tasks found for this square - Skip task!", score_to_award: 0}

    // Game states
    const [score, setScore] = useState(0)
    const [avatarSquare, setAvatarSquare] = useState(0)
    const [chosenTask, setChosenTask] = useState(taskNotFound);

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
                // toggle spinner
                setCanSpin(usergamestats.task_completed)
                // display current task
                api.get("/accounts/tasks/").then(res => res.data).then(
                    tasks => tasks.find(task => task.id === usergamestats.current_task)
                ).then(
                    task => setChosenTask(task ? task : taskNotFound)
                )
            }
        )
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

    const advanceSquare = async squareCount => {
        return api.get("/accounts/me/").then(res => res.data.usergamestats?.current_square)
        .then(currentSquare => {
            const newSquare = (currentSquare + squareCount) % squares.length
            setAvatarSquare(newSquare)
            api.patch("/accounts/me/", {
                usergamestats: {
                    current_square: newSquare
                }
            })
            return newSquare
        })
    }

    const generateRandomTask = async square => {
        const tasks = await api.get("/accounts/tasks/").then(
            res => res.data.filter(task => task.applicable_squares.includes(square))
        )

        const task = (tasks.length === 0) ? taskNotFound : tasks[Math.floor(Math.random() * tasks.length)]

        setChosenTask(task)
        api.patch("/accounts/me/", {
            usergamestats: {
                current_task: task.id
            }
        })
        return task
    }

    // Event handlers
    const onCompleteTask = () => {
        setShowTask(false)
        awardScore(chosenTask.score_to_award)
        // mark as complete and enable spinner
        api.patch("/accounts/me/", {
            usergamestats: {
                task_completed: true
            }
        }).then(
            setCanSpin(true)
        )
    }

    const onClickSpin = () => {
        setGetChance(false)
    }

    const onSpinnerAnimationEnd = landedNumber => {
        if (landedNumber === 6) { // enable chance when spinner lands on 6
            setGetChance(true)
        } else {
            setGetChance(false)
            setShowChance(false)
        }
        advanceSquare(landedNumber).then(newSquare => {
            generateRandomTask(newSquare)
        })
        if (avatarSquare + landedNumber >= squares.length) { // passed START
            // awardScore(5)
        }
        // mark as incomplete and disable spinner
        api.patch("/accounts/me/", {
            usergamestats: {
                task_completed: false
            }
        }).then(
            setCanSpin(false)
        )
    }

    const onClickChance = () => {
        setGetChance(false)
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
                    <a href="home"><i className="bi bi-house-door-fill" style={{fontSize: "3.5vw"}} ></i></a>
                    <a href="board"><i className="bi bi-dice-3-fill" style={{fontSize: "3.5vw"}} ></i></a>
                    <a href="map"><i className="bi bi-map-fill" style={{fontSize: "3.5vw"}} ></i></a>
                    <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "3.5vw"}} ></i></a>
                    <a href="logout"><i className="bi bi-box-arrow-right" style={{fontSize: "3.5vw"}} ></i></a>
                    
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
                    onClickSpin={onClickSpin}
                    onSpinnerAnimationEnd={onSpinnerAnimationEnd}
                />
                <div />
                <div />
                <Task
                    showTask={showTask}
                    setShowTask={setShowTask}
                    square={squares[avatarSquare]}
                    task={chosenTask}
                    canSpin={canSpin}
                    onCompleteTask={onCompleteTask}
                />
                <Chance
                    setShowChance={setShowChance}
                    getChance={getChance}
                    onClickChance={onClickChance}
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
