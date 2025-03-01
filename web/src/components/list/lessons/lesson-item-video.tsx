import React from 'react'
import Player from 'next-video/player'

export const LessonItemVideo = ({ url }: any) => {
    return (
        <Player
            src={url}
            className="w-full h-[70%] rounded-[5px] bg-slate-200"
            accentColor="#6E22DD"
            style={{
                zIndex: 0
            }}
        />
    )
}
