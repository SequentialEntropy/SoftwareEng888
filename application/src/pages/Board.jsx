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
import NavBar from "../components/Navbar"
import { squares } from "../constants"

/**
 * Board Component
 * This component represents a spinning wheel that determines the number of squares the user will proceed.
 * @returns {JSX.Element} A board with locations.
 */

function Board() {
    const taskNotFound = {id: -1, description: "No tasks found for this square - Skip task!", score_to_award: 0}
    const chanceNotFound = {id: -1, description: "No chance cards registered - Skip chance!", score_to_award: 0}

    // Game states
    const [score, setScore] = useState(0)
    const [avatarSquare, setAvatarSquare] = useState(0)
    const [chosenTask, setChosenTask] = useState(taskNotFound);
    const [chosenChance, setChosenChance] = useState(chanceNotFound)

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
        api.get("/accounts/me/").then(res => res.data.usergamestats).then(
            usergamestats => {
                // initialise score
                setScore(usergamestats.score)
                // teleport avatar to START
                setAvatarSquare(usergamestats.current_square)
                // toggle spinner
                setCanSpin(usergamestats.task_completed)
                // display current task
                api.get("/tasks/").then(res => res.data).then(
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
        const tasks = await api.get("/tasks/").then(
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
        api.get("/chances/")
        .then(res => res.data)
        .then(chances => {
            const chance = (chances.length === 0) ? chanceNotFound : chances[Math.floor(Math.random() * chances.length)]

            setChosenChance(chance)
            awardScore(chance.score_to_award)
        })
    }

    return (
        <div className={styles.game}>   
            <NavBar />
            <div>
                {/* Points Container */}

                <div className={styles.points_container}>
                    <h1>{score} points</h1>
                </div>

                {/* How to play popup */}
                <HowToPlay />
            </div>
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
                    showChance={showChance}
                    setShowChance={setShowChance}
                    getChance={getChance}
                    chance={chosenChance}
                    onClickChance={onClickChance}
                />
                <Square {...squares[15]} squareRefs={squareRefs}/>
                <Square {...squares[ 5]} squareRefs={squareRefs}/>
                <Square {...squares[ 4]} squareRefs={squareRefs}/>
                <Square {...squares[ 3]} squareRefs={squareRefs}/>
                <Square {...squares[ 2]} squareRefs={squareRefs}/>
                <Square {...squares[ 1]} squareRefs={squareRefs}/>
                <Square {...squares[ 0]} squareRefs={squareRefs}/>
            </div>
            
        </div>
    )
}

export default Board
