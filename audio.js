const INIT_AUDIO = [
    {
        key: "gameover",
        path: "assets/sound/music/gameover2.mp3"
    },
    {
        key: "goomba-stomp",
        path: "assets/sound/effects/goomba-stomp.wav"
    },
    {
        key: "coin",
        path: "assets/sound/effects/coin.mp3"
    }
]

export const initAudio = ({ load }) => {
    INIT_AUDIO.forEach(({ key, path }) => {
        load.audio(key, path)
    })
}

export const playAudio = (id, { sound }, { volume = .2 } = {}) => {
    try {
        return sound.play(id, { volume }).play()
    } catch (error) {
        console.error(error)
    }
}