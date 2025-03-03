import { atom } from 'recoil'

export const roomDataAtom = atom({
    key: 'roomDataAtom',
    default: {
        enemyId: '',
        maxMoves: '6',
        rounds: '5',
        vsAi: true,
    },
})

export const componentsFadeAtom = atom({
    key: 'componentsFadeAtom',
    default: {
        createRoom: 'FadeIn',
        battleRoom: 'FadeOut',
    },
})

export const userDataAtom = atom({
    key: 'userDataAtom',
    default: {},
})
