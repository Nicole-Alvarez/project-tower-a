import { atom } from "recoil"

export const roomDataAtom = atom({
    key: "roomDataAtom",
    default: { 
        enemyId: 1,
        maxMoves: "6",
        rounds: "5",
        vsAi: true
    },
})

export const componentsFadeAtom = atom({
    key: "componentsFadeAtom",
    default:{
        createRoom: "FadeIn",
        battle: "fadeOut"
    },
})
