const INIT_IMAGES = [
    {
        key: "cloud1",
        path: "assets/scenery/overworld/cloud1.png"
    },
    {
        key: "floorbricks",
        path: "assets/scenery/overworld/floorbricks.png"
    },
    {
        key: "superMushroom",   
        path: "assets/collectibles/super-mushroom.png"
    }
]

export const initImages = ({ load }) => {
    INIT_IMAGES.forEach(({ key, path }) => {
        load.image(key, path)
    })
}