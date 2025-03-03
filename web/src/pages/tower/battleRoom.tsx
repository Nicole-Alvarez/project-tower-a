import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AlertCircle } from 'lucide-react'
import { useRecoilState } from 'recoil'
import {
    roomDataAtom,
    componentsFadeAtom,
    userDataAtom,
} from '@/context/states'
import { useQuery } from '@tanstack/react-query'
import { getMobs } from '../../../api/query/mobs'
import { mobs } from '@/context/mobs'
import { MobTest1 } from '@/components/chars-svg/mobs'
import { Rock, Paper, Scissors } from '@/components/chars-svg/moves'

const BattleRoom = () => {
    const [fade, setFade] = useRecoilState<any>(componentsFadeAtom)
    const [roomDataRecoil, setRoomDataRecoil] = useRecoilState(roomDataAtom)
    const [userData, setUserData] = useRecoilState<any>(userDataAtom)

    const [movesEnemy, setMovesEnemy] = useState<string[]>([])
    const [movesYou, setMovesYou] = useState<string[]>([])
    const [roundResult, setRoundResult] = useState<any>('')

    const [round, setRound] = useState(1)
    const [enemyData, setEnemyData] = useState<any>([])
    const [yourHealth, setYourHealth] = useState<any>(0)

    const mob: any = mobs.find(
        (item: any) => item?.mob_id === roomDataRecoil?.enemyId
    )

    const choices = ['rock', 'paper', 'scissors']
    const getRandomMove = () =>
        choices[Math.floor(Math.random() * choices.length)]

    const handleMoves = (move: string) => {
        console.log('log: ', roundResult)
        if (movesYou.length >= Number(roomDataRecoil.maxMoves) - 1) {
            setMovesYou([])
            setMovesEnemy([])
            setRoundResult('')
            // setRound(round + 1)
            if (movesYou.length > Number(roomDataRecoil.maxMoves) - 1) {
                setRound((prevRound) => prevRound + 1)
            }
        }
        if (movesYou.length < Number(roomDataRecoil.maxMoves)) {
            const newMovesYou = [...movesYou, move]
            const newMovesEnemy = [...movesEnemy, getRandomMove()]

            setMovesYou(newMovesYou)
            setMovesEnemy(newMovesEnemy)

            // Check if round is complete (i.e., maxMoves reached)
            if (newMovesYou.length === Number(roomDataRecoil.maxMoves)) {
                setRoundResult('show')
                checkWinner(newMovesYou, newMovesEnemy)
            }
        }
    }

    const checkWinner = (playerMoves: string[], enemyMoves: string[]) => {
        let playerDamage = 0
        let enemyDamage = 0
        let roundResult = 'Draw'

        playerMoves.forEach((playerMove, index) => {
            const enemyMove = enemyMoves[index]

            if (
                (playerMove === 'rock' && enemyMove === 'scissors') ||
                (playerMove === 'paper' && enemyMove === 'rock') ||
                (playerMove === 'scissors' && enemyMove === 'paper')
            ) {
                enemyDamage += 10 // Player wins
            } else if (
                (enemyMove === 'rock' && playerMove === 'scissors') ||
                (enemyMove === 'paper' && playerMove === 'rock') ||
                (enemyMove === 'scissors' && playerMove === 'paper')
            ) {
                playerDamage += 10 // Enemy wins
            }
        })

        if (enemyDamage > playerDamage) {
            roundResult = 'Won'
        } else if (playerDamage > enemyDamage) {
            roundResult = 'Lost'
        }

        setEnemyData((prevData: any) => ({
            ...prevData,
            health: Math.max(0, prevData.health - enemyDamage), // Ensure HP doesn’t go below 0
        }))

        setYourHealth((prevHealth: any) =>
            Math.max(0, prevHealth - playerDamage)
        )

        // setRoundResult(roundResult) // Store round result for display

        // Reset for next round
        // setMovesYou([])
        // setMovesEnemy([])
        // setRound((prevRound) => prevRound + 1)
    }

    useEffect(() => {
        setEnemyData(mob)
        setYourHealth(mob?.health)
    }, [mob])

    return (
        <div className="flex flex-row gap-4">
            <div className="flex w-[300px] h-[600px] bg-blue-300 text-slate-900 justify-center items-center p-4 rounded-lg relative flex-col">
                {/* Mob Name and HP */}
                <div className="absolute top-4 text-center">
                    <h2 className="text-xl font-bold">
                        {userData?.username ?? 'You'}
                    </h2>
                    <p className="text-sm">HP: {yourHealth || 0}</p>
                </div>

                {/* SVG Mob Monster */}
                <div className="mt-16">
                    <MobTest1 />
                </div>
            </div>

            <div className="flex w-[900px] h-[600px] bg-white text-slate-900 justify-center items-center p-4 rounded-lg relative overflow-hidden">
                <div
                    className="flex w-[900px] h-[750px] bg-white text-slate-900 justify-center items-center p-4 rounded-lg absolute "
                    style={{
                        backgroundImage:
                            "url('https://img.craftpix.net/2023/04/Free-Nature-Backgrounds-Pixel-Art7.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>

                {/* Round Number */}
                <h2 className="text-4xl font-bold absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    Round {round}
                </h2>

                {/* Round Result (Won/Lost) */}
                {/* {roundResult !== '' && (
                    <h2
                        className={`text-5xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                            roundResult === 'Won'
                                ? 'text-green-600'
                                : 'text-red-600'
                        }`}
                    >
                        {roundResult}
                    </h2>
                )} */}

                {/* Show moves only after roundResult is set */}
                {/* Player Moves (Left Side) */}
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold">Your Moves</h3>
                    {movesYou.map((move, index) => {
                        return (
                            <p
                                key={index}
                                className={`text-xl capitalize ${'text-gray-500'}`}
                            >
                                {move}
                            </p>
                        )
                    })}
                </div>

                {roundResult !== '' && (
                    <>
                        {/* Enemy Moves (Right Side) */}
                        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                            <h3 className="text-lg font-semibold">
                                Enemy Moves
                            </h3>
                            {movesEnemy.map((move, index) => {
                                const playerMove = movesYou[index]
                                const isWinningMove =
                                    (move === 'rock' &&
                                        playerMove === 'scissors') ||
                                    (move === 'paper' &&
                                        playerMove === 'rock') ||
                                    (move === 'scissors' &&
                                        playerMove === 'paper')

                                const isLosingMove =
                                    (playerMove === 'rock' &&
                                        move === 'scissors') ||
                                    (playerMove === 'paper' &&
                                        move === 'rock') ||
                                    (playerMove === 'scissors' &&
                                        move === 'paper')

                                return (
                                    <p
                                        key={index}
                                        className={`text-xl capitalize ${
                                            isWinningMove
                                                ? 'text-green-600'
                                                : isLosingMove
                                                ? 'text-red-600'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {move}
                                    </p>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Move Selection (Bottom Left) */}
                <div className="absolute bottom-4 left-4 flex space-x-4">
                    <div
                        className="hover:cursor-pointer"
                        onClick={() => handleMoves('rock')}
                    >
                        <Rock />
                    </div>
                    <div
                        className="hover:cursor-pointer"
                        onClick={() => handleMoves('paper')}
                    >
                        <Paper />
                    </div>
                    <div
                        className="hover:cursor-pointer"
                        onClick={() => handleMoves('scissors')}
                    >
                        <Scissors />
                    </div>
                </div>
            </div>

            <div className="flex w-[300px] h-[600px] bg-red-300 text-slate-900 justify-center items-center p-4 rounded-lg relative flex-col">
                {/* Mob Name and HP */}
                <div className="absolute top-4 text-center">
                    <h2 className="text-xl font-bold">
                        {enemyData?.name || 'Unknown'}
                    </h2>
                    <p className="text-sm">HP: {enemyData?.health || 0}</p>
                </div>

                {/* SVG Mob Monster */}
                <div className="mt-16">
                    <MobTest1 />
                </div>

                {/* Mob Traits */}
                <div className="absolute bottom-4 text-center">
                    <h3 className="text-lg font-semibold">Traits</h3>
                    {enemyData?.traits?.length > 0 ? (
                        <ul className="text-sm mt-2 space-y-1">
                            {enemyData.traits.map((trait: any) => (
                                <li
                                    key={trait.traits_id}
                                    className="text-red-800 font-medium"
                                >
                                    • {trait.name}: {trait.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-red-700">No traits</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BattleRoom
