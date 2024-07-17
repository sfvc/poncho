const FPS = 30
const pickimage = document.querySelector('select[name=pickimage]')
let IMAGE = pickimage.value
let image = null
let ROWS = 3
let COLS = 2
let RADIUS = 30
let OFFSET = 20
let board = null
let piece = null
const MAX_WIDTH = 500
const MAX_HEIGHT = 500

const app = document.querySelector('#app')
const canvas = document.createElement('canvas')
app.appendChild(canvas)
const ctx = canvas.getContext('2d')

let isMouseInside = false
let isPieceMoving = false
let mousePos = { x : 0, y : 0 }

canvas.addEventListener('pointerenter', (e) => {
    isMouseInside = true
})
canvas.addEventListener('pointerleave', (e) => {
    isMouseInside = false
    isPieceMoving = false
    piece = null
})
canvas.addEventListener('pointermove', (e) => {    
    if (e.pointerType == 'mouse' && !isPieceMoving && isMouseInside && board) {
        piece = board.pieceByPos(ctx, e.offsetX, e.offsetY)
        board.unhoverPieces()
        if (piece) piece.hover()
    }
    if (e.pointerType == 'touch' && isPieceMoving && piece) {
        piece.x += e.movementX
        piece.y += e.movementY        
    } else if (isPieceMoving && piece) {
        piece.x += e.offsetX - mousePos.x
        piece.y += e.offsetY - mousePos.y
    }
    mousePos.x = e.offsetX
    mousePos.y = e.offsetY
})
canvas.addEventListener('pointerdown', (e) => {    
    if (e.pointerType == 'touch' && !isPieceMoving && isMouseInside && board) {        
        piece = board.pieceByPos(ctx, e.offsetX, e.offsetY)
        board.unhoverPieces()
        if (piece) piece.hover()
    }
    if (piece) isPieceMoving = true    
})
canvas.addEventListener('pointerup', (e) => {
    isPieceMoving = false
    if (piece && piece.isNearToPlace()) {
        let localPiece = piece
        let piecePos = { x : localPiece.x, y : localPiece.y }
        let tween = new TWEEN.Tween(piecePos)
            .to({ x : 0, y : 0 }, 250)
            .easing(TWEEN.Easing.Quartic.In)
            .onUpdate(() => {
                localPiece.z = 10
                localPiece.x = piecePos.x
                localPiece.y = piecePos.y
            })
            .onComplete(() => {
                localPiece.z = 0
                if (board.check()) {
                    swal.fire({
                        title: "¡Felicitaciones!",
                        text: "Rompecabeza completado",
                        icon: "success",
                    });
                    board.pieces = []
                }
            })
            .start()
    }
    piece = null
})

pickimage.addEventListener('change', (e) => {
    IMAGE = e.target.value
    reset()
})

const boardconfig = document.querySelector('select[name=boardconfig]')
boardconfig.addEventListener('change', (e) => {
    const dims = e.target.value.split('x')
    ROWS = dims[0]
    COLS = dims[1]
    if (COLS * ROWS > 15) {
        RADIUS = 15
    } else if (COLS * ROWS > 12) {
        RADIUS = 20
    } else if (COLS * ROWS > 8) {
        RADIUS = 25
    } else {
        RADIUS = 30
    }
    reset()
})

const resetpuzzle = document.querySelector('button[name=resetpuzzle]')
resetpuzzle.addEventListener('click', (e) => {
    reset()
})

const shufflepuzzle = document.querySelector('button[name=shufflepuzzle]')
shufflepuzzle.addEventListener('click', (e) => {
    const localPadding = 300
    const localTop = Math.max(board.image.height + 50, canvas.height / 2);
    const localBottom = canvas.height - localPadding;
    const localLeft = 0;
    const localRight = canvas.width - localPadding;

    let randomPosition = [];
    let currentPosition = [];

    for (let i = 0; i < board.pieces.length; i++) {
        let piecePos = board.posByIndex(i);
        let localX = piecePos.x * board.pw;
        let localY = piecePos.y * board.ph;
        randomPosition.push({
            x: localLeft + Math.random() * (localRight - localLeft - board.pw),
            y: localTop + Math.random() * (localBottom - localTop - board.ph)
        });
        currentPosition.push({ x: board.x + localX, y: board.y + localY });
    }
    for (let i = 0; i < board.pieces.length; i++) {
        let piece = board.pieces[i];
        new TWEEN.Tween(currentPosition[i])
            .to(randomPosition[i], 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                piece.x = currentPosition[i].x - board.x;
                piece.y = currentPosition[i].y - board.y;
                piece.z = i + 10;
            })
            .onComplete(() => {
                piece.z = 0;
            })
            .start();
    }
});

let deltaTime = 0
let fpsDeltaTime = 0
let fpsDeltaLimit = 1000 / FPS
const render = (time) => {
    deltaTime = time - deltaTime
    fpsDeltaTime += deltaTime
    
    if (fpsDeltaTime >= fpsDeltaLimit) {
        TWEEN.update(time)
        if (board) board.render(ctx)
        
        fpsDeltaTime = 0
    }
    
    deltaTime = time
    requestAnimationFrame(render)
}

const reset = () => {
    image = new Image()
    image.src = IMAGE
    image.addEventListener('load', (e) => {
        let ratio = image.width / image.height
        let width = image.width
        let height = image.height
        
        if (image.width > image.height) {
            width = width > MAX_WIDTH ? MAX_WIDTH : width
            height = width / ratio
        } else {
            height = height > MAX_HEIGHT ? MAX_HEIGHT : height
            width = height * ratio
        }
        image.width = width
        image.height = height
        
        canvas.width = app.clientWidth
        canvas.height = app.clientHeight
        
        board = new Board(ROWS, COLS, image, OFFSET, OFFSET, RADIUS)
    })
}
const init = (event) => {
    reset()    
    render(0)
}
document.addEventListener('DOMContentLoaded', init)

const resize = (event) => {
    canvas.width = app.clientWidth
    canvas.height = app.clientHeight
}

let resizeTimeout = null
window.addEventListener('resize', (e) => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
        resize(e)
    }, 100)
})
class Piece {
    constructor(bx, by, width, height) {
        this.x = 0
        this.y = 0
        this.z = 0
        this.w = width
        this.h = height
        this.img = null
        this.mask = null
        this.bx = bx
        this.by = by
        this.isHover = false
        this.index = 0
    }
    isNearToPlace() {
        const distance = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))

        if (distance < 50) 
            return true
        
        return false
    }
    getMask() { return this.mask(this.x, this.y) }
    set image(v) { this.img = v }
    get image() { return this.img }
    hover() { 
        this.isHover = true 
        this.z = 10
    }
    unhover() { 
        this.isHover = false 
        this.z = 0
    }
    render(ctx) {
        ctx.save()

        let mask = this.getMask()
        ctx.strokeStyle = 'gold'
        ctx.lineWidth = 5
        ctx.lineCap = 'round'
        ctx.stroke(mask)
        ctx.clip(mask, 'evenodd')
        
        ctx.drawImage(this.image, 
            this.x + this.bx,
            this.y + this.by, 
            this.image.width, this.image.height)

        if (this.isHover) {
            ctx.fillStyle = 'rgba(255, 230, 0, .25)'
            ctx.fill(mask)
        }

        ctx.restore()
    }
}
//
class Board {
    constructor(rows, cols, image, x = 0, y = 0, radius = 20) {
        this.r = rows
        this.c = cols
        this.x = (canvas.width - image.width) / 2;
        this.y = (canvas.height - image.height) / 8;
        this.image = image
        this.pw = image.width / cols
        this.ph = image.height / rows
        this.pieces = []
        this.rad = radius
        
        for (let y = 0; y < this.r; y++) {
            for (let x = 0; x < this.c; x++) {
                let piece = new Piece(this.x, this.y, this.pw, this.ph)
                piece.image = this.image
                piece.index = this.index(x, y)
                piece.mask = this.mask(x, y, this.radius)
                this.pieces.push(piece)
            }
        }
    }
    get piecesByZAsc() { return [...this.pieces].sort((a, b) => a.z - b.z) }
    get piecesByZDesc() { return [...this.pieces].sort((a, b) => b.z - a.z) }
    get radius() { return this.rad }
    set radius(v) {
        this.rad = v
        this.updateMasks()
    }
    index(x, y) { return x + y * this.c }
    posByIndex(index) {
        return {
            x : index % this.c,
            y : Math.floor(index / this.c)
        }
    }
    check() {
        let counter = 0
        
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].index != counter
                || this.pieces[i].x != 0
                || this.pieces[i].y != 0) return false
            counter++
        }
        
        return true
    }
    updateMasks() {
        for (let y = 0; y < this.r; y++) {
            for (let x = 0; x < this.c; x++) {
                this.pieces[this.index(x, y)].mask = this.mask(x, y, this.radius)
            }
        }
    }
    unhoverPieces() {
        for (let i = 0; i < this.pieces.length; i++)
            this.pieces[i].unhover()
    }
    pieceByPos(ctx, x, y) {
        const pieces = this.piecesByZDesc

        for (let i = 0; i < pieces.length; i++)
            if (ctx.isPointInPath(pieces[i].getMask(), x, y, 'nonzero'))
                return pieces[i]

        return null
    }
    render(ctx) {
        ctx.save()
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        const pieces = this.piecesByZAsc
        if (pieces.length > 0) {
            ctx.fillStyle = 'rgb(221, 250, 182)'
            ctx.rect(this.x, this.y, this.image.width, this.image.height)
            ctx.fill()
            
            for (let i = 0; i < pieces.length; i++)
                pieces[i].render(ctx)
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height)
        }

        ctx.restore()
    }
    mask(x, y, radius) {
        return (px, py) => {
            let m = new Path2D()
            m.moveTo(px + this.x + x * this.pw, py + this.y + y * this.ph)
            if (y == 0) {
                m.lineTo(px + this.x + (x + 1) * this.pw, py + this.y + y * this.ph)
            } else {
                m.lineTo(px + this.x + (x + .5) * this.pw - radius, py + this.y + y * this.ph)
                m.arc(px + this.x + (x + .5) * this.pw, py + this.y + y * this.ph, radius, Math.PI, 0, true)
                m.lineTo(px + this.x + (x + 1) * this.pw, py + this.y + y * this.ph)
            }
            if (x == this.c - 1) {
                m.lineTo(px + this.x + (x + 1) * this.pw, py + this.y + (y + 1) * this.ph)
            } else {
                m.lineTo(px + this.x + (x + 1) * this.pw, py + this.y + (y + .5) * this.ph - radius)
                m.arc(px + this.x + (x + 1) * this.pw, py + this.y + (y + .5) * this.ph, radius, -Math.PI/2, Math.PI/2, false)
                m.lineTo(px + this.x + (x + 1) * this.pw, py + this.y + (y + 1) * this.ph)
            }
            if (y == this.r - 1) {
                m.lineTo(px + this.x + x * this.pw, py + this.y + (y + 1) * this.ph)
            } else {
                m.lineTo(px + this.x + (x + .5) * this.pw + radius, py + this.y + (y + 1) * this.ph)
                m.arc(px + this.x + (x + .5) * this.pw, py + this.y + (y + 1) * this.ph, radius, 0, Math.PI, false)
                m.lineTo(px + this.x + x * this.pw, py + this.y + (y + 1) * this.ph)
            }
            if (x == 0) {
                m.lineTo(px + this.x + x * this.pw, py + this.y + y * this.ph)
            } else {
                m.lineTo(px + this.x + x * this.pw, py + this.y + (y + .5) * this.ph + radius)
                m.arc(px + this.x + x * this.pw, py + this.y + (y + .5) * this.ph, radius, Math.PI/2, -Math.PI/2, true)
                m.lineTo(px + this.x + x * this.pw, py + this.y + y * this.ph)
            }
    
            return m
        }
    }
}
