// TODO: funca pero a la vez no el rompe cabezas. Lo mejor va a ser que lo veas en la tele y ahi pruebes. Agustin. Porque supuestmente ya quedo configurado el touch y todo, pero las cards todavia hacen lo que le sale del orto


// Acá podes cambiar el tamaño del rompecabezas, y tambien las fichas
const puzzleConfig = {
    size: { width: 640, height: 480 },
    pieceCount: { x: 3, y: 2 }
};

const state = {
    pieces: [],
    dragStartPosition: { x: 0, y: 0 },
    draggedPiece: null,
    image: ''
};

const stopDrag = () => {
    const distance = Math.sqrt(
        Math.pow(
            state.draggedPiece.targetPosition.x - parseInt(state.draggedPiece.elem.style.left),
            2
        ) +
        Math.pow(state.draggedPiece.targetPosition.y - parseInt(state.draggedPiece.elem.style.top), 2)
    );
    if (distance < 50) {
        state.draggedPiece.elem.style.left = state.draggedPiece.targetPosition.x + 'px';
        state.draggedPiece.elem.style.top = state.draggedPiece.targetPosition.y + 'px';
        state.draggedPiece.elem.style.pointerEvents = 'none';
        state.draggedPiece.elem.style.zIndex = 0;

        checkCompletion();
    }
    state.draggedPiece = null;
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
};

const drag = (event) => {
    event.preventDefault();
    const touch = event.touches ? event.touches[0] : event;
    const diffX = state.dragStartPosition.x - touch.clientX;
    const diffY = state.dragStartPosition.y - touch.clientY;
    state.dragStartPosition.x = touch.clientX;
    state.dragStartPosition.y = touch.clientY;
    state.draggedPiece.elem.style.top = state.draggedPiece.elem.offsetTop - diffY + 'px';
    state.draggedPiece.elem.style.left = state.draggedPiece.elem.offsetLeft - diffX + 'px';
};

const startDrag = (piece, event) => {
    state.draggedPiece = piece;
    event.preventDefault();
    const touch = event.touches ? event.touches[0] : event;
    state.dragStartPosition.x = touch.clientX;
    state.dragStartPosition.y = touch.clientY;
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
};

const createPuzzlePieces = () =>
    Array.from({ length: puzzleConfig.pieceCount.x * puzzleConfig.pieceCount.y }).map((_, index) => {
        const elem = document.createElement('div');
        elem.classList.add('elem');
        elem.style.width = puzzleConfig.size.width / puzzleConfig.pieceCount.x + 'px';
        elem.style.height = puzzleConfig.size.height / puzzleConfig.pieceCount.y + 'px';
        elem.style.backgroundImage = state.image;
        elem.style.backgroundPosition = `-${(index % puzzleConfig.pieceCount.x) * (puzzleConfig.size.width / puzzleConfig.pieceCount.x)
            }px -${Math.floor(index / puzzleConfig.pieceCount.x) *
            (puzzleConfig.size.height / puzzleConfig.pieceCount.y)
            }px`;

        const row = Math.floor(index / puzzleConfig.pieceCount.x);
        elem.style.top = puzzleConfig.size.height + row * (puzzleConfig.size.height / puzzleConfig.pieceCount.y) + 'px';
        elem.style.left = (index % puzzleConfig.pieceCount.x) * (puzzleConfig.size.width / puzzleConfig.pieceCount.x) + 'px';

        return {
            elem,
            targetPosition: {
                x: (index % puzzleConfig.pieceCount.x) * (puzzleConfig.size.width / puzzleConfig.pieceCount.x),
                y: row * (puzzleConfig.size.height / puzzleConfig.pieceCount.y)
            },
            currentPosition: { x: 0, y: 0 }
        };
    });

const imagenes = [
    'Dique-El-Jumeal-SFVC-Turismo-Catamarca-14.webp',
    'La-Alameda-SFVC-Paseo-General-Navarro-Catamarca-LD-8.webp',
    'La-Gruta-SFVC-virgen-del-valle-Catamarca-6.webp'
    // Anda agregando acá las nuevas imagenes que te pasen, Agustin. Mandale el nombre y listo, ya queda vinculado todo a la ruta de "rompecabezas"
];

const initBoard = () => {
    const randomIndex = Math.floor(Math.random() * imagenes.length);
    const imageName = imagenes[randomIndex];

    state.image = `url(../images/rompecabezas/${imageName})`;
    document.querySelector('.puzzleBackground').style.backgroundImage = state.image;

    const puzzle = document.querySelector('.puzzle');
    puzzle.style.width = puzzleConfig.size.width + 'px';
    puzzle.style.height = puzzleConfig.size.height + 'px';

    const pieces = createPuzzlePieces();
    puzzle.append(...pieces.map((piece) => piece.elem));
    pieces.sort(() => Math.random() > 0.5);
    pieces.forEach((piece, index) => {
        const p = piece;
        if (window.innerWidth <= 768) {
            piece.elem.style.position = 'relative';
            piece.elem.style.left = '0px';
            piece.elem.style.top = '0px';
        } else {
            piece.elem.style.position = 'absolute';
            piece.elem.style.left = puzzleConfig.size.width + puzzleConfig.size.width * Math.random() + 'px';
            piece.elem.style.top = puzzleConfig.size.height * Math.random() + 'px';
        }
        piece.elem.onmousedown = (event) => startDrag(p, event);
        piece.elem.ontouchstart = (event) => startDrag(p, event);
        piece.currentPosition.x = index % puzzleConfig.pieceCount.x;
        piece.currentPosition.y = Math.floor(index / puzzleConfig.pieceCount.x);
    });
    state.pieces = pieces;
};

const checkCompletion = () => {
    const completed = state.pieces.every((piece) => {
        const currentX = parseInt(piece.elem.style.left) / (puzzleConfig.size.width / puzzleConfig.pieceCount.x);
        const currentY = parseInt(piece.elem.style.top) / (puzzleConfig.size.height / puzzleConfig.pieceCount.y);
        return (
            Math.abs(currentX - piece.currentPosition.x) < 1 &&
            Math.abs(currentY - piece.currentPosition.y) < 1
        );
    });

    if (completed) {
        alert('¡Felicitaciones! Has completado el rompecabezas.');
    }
};

initBoard();

document.querySelector('#newGame').onclick = () => {
    state.pieces.forEach((piece) => {
        piece.elem.remove();
    });
    initBoard();
};
