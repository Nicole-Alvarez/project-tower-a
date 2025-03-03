import { traits } from './traits'

const getRandomTraits = (num = 1) => {
    return traits.sort(() => Math.random() - 0.5).slice(0, num)
}

export const mobs = [
    {
        name: 'mob 1',
        mob_id: 'mob_test_1',
        type: 'mob',
        description: 'test',
        health: 120,
        traits: [traits[1]],
    },
    {
        name: 'mob 2',
        mob_id: 'mob_test_2',
        type: 'elite',
        description: 'strong enemy',
        health: 150,
        traits: getRandomTraits(2),
    },
    {
        name: 'mob 3',
        mob_id: 'mob_test_3',
        type: 'boss',
        description: 'agile foe',
        health: 100,
        traits: getRandomTraits(3),
    },
]
