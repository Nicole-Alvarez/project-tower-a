import React, { useState } from 'react'
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
import { roomDataAtom, componentsFadeAtom } from '@/context/states'
import { useQuery } from '@tanstack/react-query'
import { getMobs } from '../../../api/query/mobs'
import { mobs } from '@/context/mobs'

const CreateRoom = () => {
    const [fade, setFade] = useRecoilState<any>(componentsFadeAtom)

    const [roomDataRecoil, setRoomDataRecoil] = useRecoilState(roomDataAtom)
    const [roomData, setRoomData] = useState({
        enemyId: '',
        maxMoves: '6',
        rounds: '5',
        vsAi: true,
    })

    const { data: mobsData, isLoading } = useQuery({
        queryKey: ['get-mobs'],
        queryFn: async () => {
            return await getMobs()
        },
    })

    const onSubmit = async () => {
        setRoomDataRecoil(roomData)
        setFade({
            createRoom: 'FadeOut',
            battleRoom: 'FadeIn',
        })
    }

    return (
        <Card className="w-full max-w-md min-w-[28rem] overflow-hidden bg-slate-900/90 border-purple-500/50 border shadow-xl shadow-purple-500/10 rounded-xl">
            <CardHeader className="pb-0">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-3 rounded-lg shadow-inner shadow-purple-500/30">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6 text-white"
                        >
                            <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
                            <path d="M18 2v4" />
                            <path d="M16 4h4" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-white">
                            Create Instance
                        </CardTitle>
                        <CardDescription className="text-purple-300/80">
                            Configure your battle parameters
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="enemy"
                            className="text-sm font-medium text-slate-300"
                        >
                            Enemy Type
                        </Label>
                        <Select
                            defaultValue="ai-1"
                            onValueChange={(value) =>
                                setRoomData({
                                    ...roomData,
                                    enemyId: value,
                                })
                            }
                        >
                            <SelectTrigger className="bg-slate-800/80 border-slate-700/50 text-slate-200">
                                <SelectValue placeholder="Select enemy" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                {mobs?.map((mob: any) => (
                                    <SelectItem
                                        value={mob?.mob_id}
                                        className="text-white"
                                    >
                                        {mob?.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="maxMoves"
                            className="text-sm font-medium text-slate-300"
                        >
                            Max Moves
                        </Label>
                        <Input
                            id="maxMoves"
                            type="number"
                            defaultValue="6"
                            min="1"
                            max="12"
                            className="bg-slate-800/80 border-slate-700/50 text-slate-200"
                            onChange={(e) =>
                                setRoomData({
                                    ...roomData,
                                    maxMoves: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="rounds"
                            className="text-sm font-medium text-slate-300"
                        >
                            Rounds
                        </Label>
                        <Input
                            id="rounds"
                            type="number"
                            defaultValue="5"
                            min="1"
                            className="bg-slate-800/80 border-slate-700/50 text-slate-200"
                            onChange={(e) =>
                                setRoomData({
                                    ...roomData,
                                    rounds: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-1.5 flex flex-col justify-between">
                        <Label
                            htmlFor="vsAi"
                            className="text-sm font-medium text-slate-300"
                        >
                            VS AI
                        </Label>
                        <div className="flex items-center justify-between py-1">
                            <p className="text-xs text-slate-400">
                                Compete against AI
                            </p>
                            <Switch
                                id="vsAi"
                                defaultChecked
                                onCheckedChange={(checked) =>
                                    setRoomData({ ...roomData, vsAi: checked })
                                }
                                className="data-[state=checked]:bg-purple-600"
                            />
                        </div>
                    </div>
                </div>

                <Alert className="bg-indigo-900/20 border-indigo-500/30 text-indigo-200">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>
                        These settings determine the battle difficulty and
                        length
                    </AlertDescription>
                </Alert>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2 pb-6">
                <Button
                    disabled={roomData?.enemyId === ''}
                    onClick={onSubmit}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 text-white font-medium py-5 h-auto shadow-md shadow-purple-700/20"
                >
                    CREATE INSTANCE
                </Button>
                <div className="text-sm text-center text-slate-400 pt-1">
                    <span>Want to join existing battle? </span>
                    <a
                        href="#"
                        className="text-purple-400 hover:text-purple-300 font-medium underline-offset-2 hover:underline transition-all"
                    >
                        Browse instances
                    </a>
                </div>
            </CardFooter>
        </Card>
    )
}

export default CreateRoom
