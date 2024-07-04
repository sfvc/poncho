const puzzleConfig = {
    size: { width: 640, height: 480 },
    pieceCount: { x: 3, y: 2 }
};

const difficulties = [
    { x: 3, y: 2, name: "Fácil" },
    { x: 5, y: 4, name: "Intermedio" },
    { x: 7, y: 6, name: "Difícil" }
];

let currentDifficulty = 0;

const state = {
    pieces: [],
    dragStartPosition: { x: 0, y: 0 },
    draggedPiece: null,
    image: ''
};

const updateDifficultyLevel = () => {
    document.getElementById('difficultyLevel').innerText = `${difficulties[currentDifficulty].name}`;
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
    document.ontouchend = null;
    document.ontouchmove = null;
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
    document.onmouseup = stopDrag;
    document.onmousemove = drag;
    document.ontouchend = stopDrag;
    document.ontouchmove = drag;
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
    // Lista de imágenes disponibles en la carpeta ../images/
    const images = [
        "ahorcadoLogo.jpeg",
        "Default_Creame_un_logo_para_el_juego_del_ahorcado.jpeg",
        "Default_Creame_un_logo_para_el_juego_del_memorize.jpeg",
        "Designer (17).jpeg",
        "Designer (18).jpeg",
        "Dique-El-Jumeal-SFVC-Turismo-Catamarca.jpeg",
        "geometry-night.png",
        "La-Alameda-SFVC-Paseo-General-Navarro.jpeg",
        "La-Gruta-SFVC-virgen-del-valle-Catamarca.jpeg",
        "logo-sfvc-travel-1.webp",
        "memorizeLogo.jpeg",
        "preguntasLogo.jpeg",
        "sfvcFavicon.webp",
        "tatetiLogo.jpeg"
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    state.image = `url(../images/${randomImage})`;
    document.querySelector('.puzzleBackground').style.backgroundImage = state.image;

    const puzzle = document.querySelector('.puzzle');
    puzzle.style.width = puzzleConfig.size.width + 'px';
    puzzle.style.height = puzzleConfig.size.height + 'px';

    const pieces = createPuzzlePieces();
    puzzle.append(...pieces.map((piece) => piece.elem));
    pieces.sort(() => Math.random() > 0.5);
    pieces.forEach((piece) => {
        const p = piece;
        if (window.innerWidth <= 768) {
            piece.elem.style.position = 'relative'; // Cambiamos a posición relativa para que se apilen debajo
            piece.elem.style.left = '0px';
            piece.elem.style.top = '0px';
        } else {
            piece.elem.style.position = 'absolute'; // Aseguramos que la posición sea absoluta en pantallas grandes
            piece.elem.style.left = puzzleConfig.size.width + puzzleConfig.size.width * Math.random() + 'px';
            piece.elem.style.top = puzzleConfig.size.height * Math.random() + 'px';
        }
        piece.elem.onmousedown = (event) => startDrag(p, event);
        piece.elem.ontouchstart = (event) => startDrag(p, event);
    });
    state.pieces = pieces;
    updateDifficultyLevel();
};

const increaseDifficulty = () => {
    currentDifficulty = (currentDifficulty + 1) % difficulties.length;
    puzzleConfig.pieceCount = difficulties[currentDifficulty];
    state.pieces.forEach((piece) => {
        piece.elem.remove();
    });
    initBoard();
};

initBoard();

document.querySelector('#newGame').onclick = () => {
    state.pieces.forEach((piece) => {
        piece.elem.remove();
    });
    initBoard();
};

document.querySelector('#increaseDifficulty').onclick = increaseDifficulty;
