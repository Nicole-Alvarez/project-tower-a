import AnimatedDiv from '@/components/animated/div'
import Sidebar from '@/components/common/sidebar'
import { useState } from 'react'
import CreateRoom from './create-room'
import BattleRoom from './battleRoom'
import { componentsFadeAtom } from '@/context/states'
import { useRecoilState } from 'recoil'

export default function TowerIndex() {
    const [fade, setFade] = useRecoilState<any>(componentsFadeAtom)

    console.log('fade: ', fade.battleRoom)

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-indigo-950 text-slate-200 justify-center items-center">
            {fade.createRoom === 'FadeIn' && (
                <AnimatedDiv
                    animation="FadeIn"
                    className="flex justify-center items-center w-full"
                >
                    <CreateRoom />
                </AnimatedDiv>
            )}
            {fade.battleRoom === 'FadeIn' && (
                <AnimatedDiv
                    animation="FadeIn"
                    className="flex justify-center items-center w-full"
                >
                    <BattleRoom />
                </AnimatedDiv>
            )}
        </div>
    )
}
