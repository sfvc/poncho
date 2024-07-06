function gameStart() {
  // Acá anda agregando todas las imagenes de los logos, Agustin. Todo esta bindeado a la carpeta de "memorize". Estas señoras no me pasaron los logos a tiempo asi que te toca cambiarlas jsjs
  const cards = [
    "1200px-Catedral_Basílica_Nuestra_Señora_del_Valle,_Catamarca.jpg", 
    "fundacion.webp", 
    "Jumeal-800x445.jpg", 
    "plaza-25-de-mayo-catamarca-capital.webp", 
    "plaza-vientos.jpg", 
    "poncho.jpg", 
    "poncho2024.webp", 
    "Procesión-de-la-Virgen-del-Valle-Catamarca_-1.jpg"
  ];
  const cardList = cards.concat(cards);

  // Shuffle list of cards
  shuffle(cardList);

  // Place cardList in deck
  const deck = document.querySelector('.deck');
  const temp_deck = document.createDocumentFragment();

  deck.innerHTML = "";
  for (let j = 0; j < cardList.length; j++) {
    let li = document.createElement('li');
    li.classList = 'card';
    li.setAttribute('data-card', cardList[j]);

    let frontImg = document.createElement('img');
    frontImg.src = `../images/memorize/${cardList[j]}`;
    frontImg.alt = cardList[j];
    frontImg.classList.add('front');

    let backDiv = document.createElement('div');
    backDiv.classList.add('back');

    li.appendChild(frontImg);
    li.appendChild(backDiv);
    temp_deck.appendChild(li);
  }
  deck.appendChild(temp_deck);

  // Show all cards for 5 seconds
  showAllCards();
}

// @description Shuffle function from Fisher-Yates (aka Knuth-shuffle).
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// @description Game loads on window loads
window.onload = gameStart;

// @description Load logic after creating cards
setTimeout(cardLogic, 2000);

// Acá podes cambiar el tiempo de "visibilidad" de las cards, Agustin. Tenes que cambiar el de card logic (arriba) y el de showAllCards (abajo)

function showAllCards() {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    card.classList.add('open', 'show');
    card.querySelector('.back').style.display = 'none';
    card.querySelector('.front').style.display = 'block';
  });

  setTimeout(() => {
    allCards.forEach(card => {
      card.classList.remove('open', 'show');
      card.querySelector('.back').style.display = 'block';
      card.querySelector('.front').style.display = 'none';
    });
  }, 2000);
}

/*=================
\ Card flip method \
=================*/

// @description Temporary card' list for matching
let openCards = [];
// @description To avoid the opening of third card
let cardLock = false;

function cardLogic() {
  var allCards = document.querySelectorAll('.card');

  allCards.forEach(card => card.addEventListener('click', event => {
    event.preventDefault();
    // Initialize the timer on first click
    if (!timerState) {
      timeCounter();
      timerState = true;
    }
    // Add cards into temporary stack
    openCards.push(card);
    if (cardLock) {
      return true;
    }
    // Disable event trigger on cards having 'open', 'show' and 'match' classes
    card.classList.add('open', 'show', 'disabled');
    card.querySelector('.back').style.display = 'none'; // Hide the back
    card.querySelector('.front').style.display = 'block'; // Show the front
    if (openCards.length == 2) {
      // Check the card similarity
      check();
      // Add a move count on opening card pair
      movesCounter();
    }
  }));

  function check() {
    const checking = openCards[0].dataset.card === openCards[1].dataset.card;
    checking ? matchCards() : unMatchCards();
  };

  // When cards match
  function matchCards() {
    openCards.forEach(openCard => {
      openCard.classList.add('open', 'show', 'match', 'disabled');
    });
    openCards = [];
  }

  // When cards do not match
  function unMatchCards() {
    openCards.forEach(openCard => {
      openCard.classList.add('wrong');
    });

    // Lock wrong cards except first two until flipped back
    cardLock = true;
    setTimeout(() => {
      openCards.forEach(openCard => {
        openCard.classList.remove('open', 'show', 'wrong', 'disabled');
        openCard.querySelector('.back').style.display = 'block'; // Show the back
        openCard.querySelector('.front').style.display = 'none'; // Hide the front
      });

      // Unlock card clicking method
      cardLock = false;
      openCards = [];
    }, 1000);
  }

  // Moves Counter
  const moves = document.querySelector('.moves');
  let allMoves = 0;

  function movesCounter() {
    allMoves++;
    // Update moves display
    allMoves == 1 ? moves.innerText = `${allMoves} Movimiento` : moves.innerText = `${allMoves} Movimientos`;
    
    // Check if move limit reached
    if (allMoves >= moveLimit) {
      loseGame("Has superado el límite de movimientos permitidos.");
    }
    starsCounter(allMoves);
    checkWin();
  }

  // Stars rating
  const stars = document.querySelector('.stars');
  const popupMsg = document.querySelector(".popupMsg");
  const popupStars = document.querySelector(".final_stars");
  const prize = document.querySelector(".prize");

  let loosingStar = () => {
    stars.parentNode.style.animation = "jello 0.7s ease";
    setTimeout(() => {
      stars.parentNode.style.animation = 'none';
    }, 1000);
  }

  let starsCounter = allMoves => {
    if (allMoves > 25) {
      prize.innerHTML = `<i class="fa fa-3x fa-gift"></i>`;
    }

    switch (allMoves) {
      case 11:
        stars.children[2].children[0].classList.remove('fa-star');
        stars.children[2].children[0].classList.add('fa-star-o');
        loosingStar();
        popupMsg.innerText = "¡Bien hecho!";
        popupStars.children[2].remove();
        prize.innerHTML = `<i class="fa fa-3x fa-trophy"></i>`;
        break;
      case 16:
        stars.children[1].children[0].classList.remove('fa-star');
        stars.children[1].children[0].classList.add('fa-star-o');
        loosingStar();
        popupMsg.innerText = "!No está mal!";
        popupStars.children[1].remove();
        prize.innerHTML = `<i class="fa fa-3x fa-trophy"></i>`;
        break;
      case 21:
        stars.children[0].children[0].classList.remove('fa-star');
        stars.children[0].children[0].classList.add('fa-star-o');
        loosingStar();
        popupMsg.innerText = "!Intentalo de nuevo!";
        popupStars.children[0].remove();
        prize.innerHTML = `<i class="fa fa-3x fa-gift"></i>`;
        break;
    }
  }

  // TODO: Hacer que puedas jugar directamente cuando fallas o se acaba el tiempo, Agustin (en verdad esto me quedaba a mi pero pasaron cositas jsjs. No es algo super importante, pero si podes pintarla para que no quede tan choto, mandale cumbia)

  // Timer
  const timer = document.querySelector('.timer');
  let minutes = 0;
  let seconds = 0;
  let timerSettings;
  let timerState = false;
  const moveLimit = 21;
  const timeLimitMinutes = 1;

  function timeCounter() {
    timerSettings = setInterval(() => {
      seconds++;
      if (seconds == 40) {
        seconds = 0;
        minutes++;
      }
      timer.innerText = timeFormat(seconds, minutes);
  
      // Check if time limit reached
      if (minutes >= timeLimitMinutes) {
        loseGame("Has alcanzado el límite de tiempo permitido.");
      }
    }, 1000);
  }

  function loseGame(message) {
    stopTimer();
    // Display losing message or handle game over logic
    alert(message);
    // Optionally, reset the game here or prompt user to restart
  }
  
  // Function to stop the timer
  function stopTimer() {
    clearInterval(timerSettings);
    timerState = false;
  }

  let timeFormat = (ss, mm) => {
    ss = seconds < 10 ? `0${seconds}` : seconds;
    mm = minutes < 10 ? `0${minutes}` : minutes;
    return `${mm}:${ss}`;
  };

  function checkWin() {
    let pairedCards = document.querySelectorAll('.match');
    if (pairedCards.length === 16) {
      winPopup();
    }
  }

  const restart = document.querySelector('.restart');

  restart.addEventListener('click', () => {
    const restartBox = confirm("¿Estás seguro de reiniciar?");
    if (restartBox) {
      document.location.reload();
    }
  });

  function winPopup() {
    stopTimer();
    document.querySelector('.final_timer').innerText = timer.innerText;
    document.querySelector(".final_moves").innerText = allMoves;
    const popupBox = document.querySelector(".overlay");
    popupBox.classList.add("show");
    document.querySelector(".replay").addEventListener("click", () => {
      window.location.reload(true);
    });
  }
}
