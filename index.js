const COORD_MARGIN = 100
const COORD_COUNT = 50
const COORD_SIZE = 10 // must match .coord width/height CSS

let coords = []
let sortedCoords = []
let selected = null

const directionFromAngle = (angle) => {
    if((angle >= -45) && (angle <= 45)) {
        return "r"
    }
    if((angle > 45) && (angle < 135)) {
        return "d"
    }
    if((angle >= -135) && (angle <= 135)) {
        return "u"
    }
    return "l"
}

// Assumes sortedCoords is up-to-date
const coordFromDirection = (direction) => {
    for(i = 0; i < sortedCoords.length; ++i) {
        let c = sortedCoords[i]
        if((selected.id != c.id) && (directionFromAngle(c.angle) == direction)) {
            return c
        }
    }
    return null
}

const highlightCoords = () => {
    const srcX = selected.x
    const srcY = selected.y

    for(i = 0; i < coords.length; ++i) {
        let c = coords[i]
        c.element.classList.remove("selected", "targeted", "l", "r", "u", "d")

        c.distSq = ((srcX - c.x) * (srcX - c.x)) + ((srcY - c.y) * (srcY - c.y))
        c.angle = Math.atan2(c.y - srcY, c.x - srcX) * 180 / Math.PI

        // c.element.innerHTML = `${directionFromAngle(c.angle)} ${c.angle.toFixed(2)}` // Debug Text

        if(selected.id != c.id) {
            c.element.classList.add(directionFromAngle(c.angle))
        }
    }

    sortedCoords = [...coords]
    sortedCoords.sort((a, b) => {
        return a.distSq - b.distSq
    })

    selected.element.classList.add("selected")
    let lc = coordFromDirection("l")
    if(lc != null) {
        lc.element.classList.add("targeted")
    }
    let rc = coordFromDirection("r")
    if(rc != null) {
        rc.element.classList.add("targeted")
    }
    let uc = coordFromDirection("u")
    if(uc != null) {
        uc.element.classList.add("targeted")
    }
    let dc = coordFromDirection("d")
    if(dc != null) {
        dc.element.classList.add("targeted")
    }
}

const onKey = (ev) => {
    const keyMap = {
        ArrowLeft: 'l',
        ArrowRight: 'r',
        ArrowUp: 'u',
        ArrowDown: 'd'
    }

    const wantedDir = keyMap[ev.key]
    if(!wantedDir) {
        return
    }

    let newSelected = coordFromDirection(wantedDir)
    if(newSelected) {
        selected = newSelected
        highlightCoords()
    }
}

const init = () => {
    console.log("init!")

    // Generate some coords!
    const offsetX = COORD_MARGIN
    const offsetY = COORD_MARGIN
    const w = window.innerWidth - (COORD_MARGIN * 2)
    const h = window.innerHeight - (COORD_MARGIN * 2)
    for(i = 0; i < COORD_COUNT; ++i) {
        let c = {
            id: i,
            x: offsetX + Math.floor(Math.random() * w),
            y: offsetY + Math.floor(Math.random() * h)
        }

        if(i == 0) {
            // put in middle, for debugging
            c.x = COORD_MARGIN + (w >> 1)
            c.y = COORD_MARGIN + (h >> 1)
        }

        c.element = document.createElement("div")
        c.element.classList.add("coord")
        c.element.style.left = `${c.x - (COORD_SIZE >> 1)}px`
        c.element.style.top = `${c.y - (COORD_SIZE >> 1)}px`
        document.body.appendChild(c.element)
        coords.push(c)
    }

    selected = coords[0]
    highlightCoords()

    document.addEventListener('keydown', onKey)
}

window.onload = init
