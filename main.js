document.addEventListener("DOMContentLoaded", StartGame)

function StartGame() {
    const w = 10
    const container = document.querySelector(".container")
    let grids = Array.from(document.querySelectorAll(".container div"))
    const score_Display = document.getElementById("score")
    let startBottone = document.getElementById("start")
    let score = 0
    let isPlaying = false
    let lastTime = 0
    let lastMoveDown = 0
    const FPS = 60
    const FRAME_TIME = 1000 / FPS  // ≈ 16.67ms per frame
    const MOVE_INTERVAL = 1000     // Piece moves down every 1000ms
    const colors = ["orange", "red", "purple", "green", "blue"]
    // ... [Rest of the constants remain the same]
    const Ltitr = [
        [1, w + 1, w * 2 + 1, 2],
        [w, w + 1, w + 2, w * 2 + 2],
        [1, w + 1, w * 2 + 1, w * 2],
        [w, w * 2, w * 2 + 1, w * 2 + 2]
    ]
    const Ztitr = [
        [0, w, w + 1, w * 2 + 1],
        [w + 1, w + 2, w * 2, w * 2 + 1],
        [0, w, w + 1, w * 2 + 1],
        [w + 1, w + 2, w * 2, w * 2 + 1]
    ]
    const Ttitr = [
        [1, w, w + 1, w + 2],
        [1, w + 1, w + 2, w * 2 + 1],
        [w, w + 1, w + 2, w * 2 + 1],
        [1, w, w + 1, w * 2 + 1]
    ]
    const Otitr = [
        [0, 1, w, w + 1],
        [0, 1, w, w + 1],
        [0, 1, w, w + 1],
        [0, 1, w, w + 1]
    ]
    const Ititr = [
        [1, w + 1, w * 2 + 1, w * 3 + 1],
        [w, w + 1, w + 2, w + 3],
        [1, w + 1, w * 2 + 1, w * 3 + 1],
        [w, w + 1, w + 2, w + 3]
    ]
    const alltitr = [Ltitr, Ztitr, Ttitr, Otitr, Ititr]
    let currentPosition = 4
    let currentRotaion = 0
    let random = Math.floor(Math.random() * alltitr.length)
    let nextRandom = 0
    let current = alltitr[random][currentRotaion]

    startBottone.addEventListener("click", () => {
        if (isPlaying) {
            startBottone.textContent = "▶"
            isPlaying = false
        } else {
            startBottone.textContent = "❚❚"
            isPlaying = true
            draw()
            lastTime = performance.now()
            lastMoveDown = lastTime
            gameLoop(lastTime)
            displayShape()
        }
    })

    function gameLoop(currentTime) {
        if (!isPlaying) return

        const deltaTime = currentTime - lastTime
        const moveDownDelta = currentTime - lastMoveDown

        if (deltaTime >= FRAME_TIME) {
            // Update game state and redraw at 60 FPS
            draw()
            lastTime = currentTime - (deltaTime % FRAME_TIME)

            // Check if it's time to move piece down
            if (moveDownDelta >= MOVE_INTERVAL) {
                moveDown()
                lastMoveDown = currentTime - (moveDownDelta % MOVE_INTERVAL)
            }
        }

        requestAnimationFrame(gameLoop)
    }

    // ... [Rest of the functions remain the same]
    function draw() {
        current.forEach(index => {
            grids[currentPosition + index].classList.add("titre")
            grids[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            grids[currentPosition + index].classList.remove("titre")
            grids[currentPosition + index].style.backgroundColor = ""
        })
    }

    document.addEventListener("keydown", control)

    function control(event) {
        if (!isPlaying) return
        if (event.keyCode === 37) {
            moveLeft()
        } else if (event.keyCode === 38) {
            rotation()
        } else if (event.keyCode === 39) {
            moveRight()
        } else if (event.keyCode === 40) {
            moveDown()
        }
    }

    function moveDown() {
        undraw()
        currentPosition += w
        draw()
        freeze()
    }

    function freeze() {
        if (current.some(index => grids[currentPosition + index + w].classList.contains("taken"))) {
            current.forEach(index => grids[currentPosition + index].classList.add("taken"))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * alltitr.length)
            current = alltitr[random][currentRotaion]
            currentPosition = 4
            draw()
            displayShape()
            addScor()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        if (!current.some(index => (currentPosition + index) % w === 0)) currentPosition -= 1
        if (current.some(index => grids[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        if (!current.some(index => (currentPosition + index) % w === w - 1)) currentPosition += 1
        if (current.some(index => grids[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1
        }
        draw()
    }

    function rotation() {
        undraw()

        // Save l position l9dima bach nrj3o liha ila kan chi mochkil
        const oldRotation = currentRotaion
        const oldPosition = currentPosition

        // Dir rotation
        currentRotaion++
        if (currentRotaion === current.length) {
            currentRotaion = 0
        }

        // Jib position jdida
        current = alltitr[random][currentRotaion]

        // Check wach piece 5arja mn border left/right
        const isAtRightEdge = current.some(index => (currentPosition + index) % w === w - 1)
        const isAtLeftEdge = current.some(index => (currentPosition + index) % w === 0)
        const isOverlapping = current.some(index => grids[currentPosition + index]?.classList.contains("taken"))

        // Ila piece 5arja mn borders wla kayn collision m3a piece 5ra
        if (isAtRightEdge || isAtLeftEdge || isOverlapping) {
            // Rj3 l rotation l9dima
            currentRotaion = oldRotation
            currentPosition = oldPosition
            current = alltitr[random][currentRotaion]
        }

        draw()
    }

    const displayGrids = document.querySelectorAll(".mini-grid div")
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetr = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ]

    function displayShape() {
        displayGrids.forEach(square => {
            square.classList.remove("titre")
            square.style.backgroundColor = ""
        })
        upNextTetr[nextRandom].forEach(index => {
            displayGrids[displayIndex + index].classList.add("titre")
            displayGrids[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    function addScor() {
        for (let i = 0; i < 199; i += w) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            if (row.every(index => grids[index].classList.contains("taken"))) {
                score += 10
                score_Display.textContent = score
                row.forEach(index => {
                    grids[index].classList.remove("taken")
                    grids[index].classList.remove("titre")
                    grids[index].style.backgroundColor = ""
                })
                const gridRemove = grids.splice(i, w)
                grids = gridRemove.concat(grids)
                grids.forEach(cell => container.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if (current.some(index => grids[currentPosition + index].classList.contains("taken"))) {
            let btn = document.getElementById("btn")
            score_Display.textContent = "End"
            isPlaying = false
            let div = document.querySelector(".game-over")
            div.style.display = "flex"
            startBottone.style.display = "none"
            document.removeEventListener("keydown", control)
            btn.addEventListener("click", () => location.reload())
        }
    }
}