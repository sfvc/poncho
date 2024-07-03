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
    }
    state.draggedPiece = null;
    document.onmouseup = null;
    document.onmousemove = null;
};

const drag = (event) => {
    event.preventDefault();
    const diffX = state.dragStartPosition.x - event.clientX;
    const diffY = state.dragStartPosition.y - event.clientY;
    state.dragStartPosition.x = event.clientX;
    state.dragStartPosition.y = event.clientY;
    state.draggedPiece.elem.style.top = state.draggedPiece.elem.offsetTop - diffY + 'px';
    state.draggedPiece.elem.style.left = state.draggedPiece.elem.offsetLeft - diffX + 'px';
};

const startDrag = (piece, event) => {
    state.draggedPiece = piece;
    event.preventDefault();
    state.dragStartPosition.x = event.clientX;
    state.dragStartPosition.y = event.clientY;
    document.onmouseup = stopDrag;
    document.onmousemove = drag;
};

const createPuzzlePieces = () =>
    Array.from({ length: puzzleConfig.pieceCount.x * puzzleConfig.pieceCount.y }).map((_, index) => {
        const elem = document.createElement('div');
        elem.classList.add('elem');
        elem.style.width = puzzleConfig.size.width / puzzleConfig.pieceCount.x + 'px';
        elem.style.height = puzzleConfig.size.height / puzzleConfig.pieceCount.y + 'px';
        elem.style.backgroundImage = state.image;
        elem.style.backgroundPosition = `-${
            (index % puzzleConfig.pieceCount.x) * (puzzleConfig.size.width / puzzleConfig.pieceCount.x)
        }px -${
            Math.floor(index / puzzleConfig.pieceCount.x) *
            (puzzleConfig.size.height / puzzleConfig.pieceCount.y)
        }px`;

        return {
            elem,
            targetPosition: {
                x:
                    (index % puzzleConfig.pieceCount.x) *
                    (puzzleConfig.size.width / puzzleConfig.pieceCount.x),
                y:
                    Math.floor(index / puzzleConfig.pieceCount.x) *
                    (puzzleConfig.size.height / puzzleConfig.pieceCount.y)
            }
        };
    });

const initBoard = () => {
    state.image = `url(https://picsum.photos/${puzzleConfig.size.width}/${puzzleConfig.size.height}?random=${Math.random()})`;
    document.querySelector('.puzzleBackground').style.backgroundImage = state.image;

    const puzzle = document.querySelector('.puzzle');
    puzzle.style.width = puzzleConfig.size.width + 'px';
    puzzle.style.height = puzzleConfig.size.height + 'px';

    const pieces = createPuzzlePieces();
    puzzle.append(...pieces.map((piece) => piece.elem));
    pieces.sort(() => Math.random() > 0.5);
    pieces.forEach((piece) => {
        const p = piece;
        piece.elem.style.left = puzzleConfig.size.width + puzzleConfig.size.width * Math.random() + 'px';
        piece.elem.style.top = puzzleConfig.size.height * Math.random() + 'px';
        piece.elem.onmousedown = (event) => startDrag(p, event);
    });
    state.pieces = pieces;
};

initBoard();

document.querySelector('#newGame').onclick = () => {
    state.pieces.forEach((piece) => {
        piece.elem.remove();
    });
    initBoard();
};
