function gameStart() {
  const cards = [
    "bse.png", 
    "centrocard.png", 
    "nacion.png", 
    "galicia.png", 
    "macro.png", 
    "naranja.png", 
    "santander.png", 
    "sol.png"
  ];
  const cardList = cards.concat(cards);

  shuffle(cardList);

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

  showAllCards();
}

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

window.onload = gameStart;

setTimeout(cardLogic, 2000);

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

let openCards = [];
let cardLock = false;

function cardLogic() {
  var allCards = document.querySelectorAll('.card');

  allCards.forEach(card => card.addEventListener('click', event => {
    event.preventDefault();
    if (!timerState) {
      timeCounter();
      timerState = true;
    }
    openCards.push(card);
    if (cardLock) {
      return true;
    }
    card.classList.add('open', 'show', 'disabled');
    card.querySelector('.back').style.display = 'none';
    card.querySelector('.front').style.display = 'block';
    if (openCards.length == 2) {
      check();
      movesCounter();
    }
  }));

  function check() {
    const checking = openCards[0].dataset.card === openCards[1].dataset.card;
    checking ? matchCards() : unMatchCards();
  };

  function matchCards() {
    openCards.forEach(openCard => {
      openCard.classList.add('open', 'show', 'match', 'disabled');
    });
    openCards = [];
  }

  function unMatchCards() {
    openCards.forEach(openCard => {
      openCard.classList.add('wrong');
    });

    cardLock = true;
    setTimeout(() => {
      openCards.forEach(openCard => {
        openCard.classList.remove('open', 'show', 'wrong', 'disabled');
        openCard.querySelector('.back').style.display = 'block';
        openCard.querySelector('.front').style.display = 'none';
      });

      cardLock = false;
      openCards = [];
    }, 1000);
  }

  const moves = document.querySelector('.moves');
  let allMoves = 0;

  function movesCounter() {
    allMoves++;
    allMoves == 1 ? moves.innerText = `${allMoves} Movimiento` : moves.innerText = `${allMoves} Movimientos`;

    if (allMoves >= moveLimit) {
      loseGame("Has superado el límite de movimientos permitidos.");
    }
    starsCounter(allMoves);
    checkWin();
  }

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
  
      if (minutes >= timeLimitMinutes) {
        loseGame("Has alcanzado el límite de tiempo permitido.");
      }
    }, 1000);
  }

  function loseGame(message) {
    stopTimer();
    swal.fire({
      title: "¡Juego perdido!",
      text: message,
      icon: "error"
    }).then(() => {
      location.reload();
    });
  }

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
    swal.fire({
      title: "¿Estás seguro de reiniciar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, reiniciar",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    });
  });

  function winPopup() {
    stopTimer();
    document.querySelector('.final_timer').innerText = timer.innerText;
    document.querySelector(".final_moves").innerText = allMoves;
    const popupBox = document.querySelector(".overlay");
    popupBox.classList.add("show");
    document.querySelector(".replay").addEventListener("click", () => {
      location.reload();
    });
  }
}
