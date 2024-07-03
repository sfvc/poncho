window.onload = function () {

  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'];
  
  var categories;         // Array of topics
  var chosenCategory;     // Selected category
  var getHint;            // Word getHint
  var word;               // Selected word
  var guess;              // Guess
  var geusses = [];       // Stored guesses
  var lives;              // Lives
  var counter;            // Count correct guesses
  var space;              // Number of spaces in word '-'

  // Get elements
  var showLives = document.getElementById("mylives");
  var showCatagory = document.getElementById("scatagory");
  var getHint = document.getElementById("hint");
  var showClue = document.getElementById("clue");

  // Create alphabet ul
  var buttons = function () {
    myButtons = document.getElementById('buttons');
    letters = document.createElement('ul');

    for (var i = 0; i < alphabet.length; i++) {
      letters.id = 'alphabet';
      list = document.createElement('li');
      list.id = 'letter';
      list.innerHTML = alphabet[i];
      check();
      myButtons.appendChild(letters);
      letters.appendChild(list);
    }
  }
    
  // Select Category
  var selectCat = function () {
    if (chosenCategory === categories[0]) {
      catagoryName.innerHTML = "La categoría elegida es Departamentos";
    } else if (chosenCategory === categories[1]) {
      catagoryName.innerHTML = "La categoría elegida es Sitios Históricos";
    } else if (chosenCategory === categories[2]) {
      catagoryName.innerHTML = "La categoría elegida es Comidas Típicas";
    }
  }

  // Create guesses ul
  var result = function () {
    wordHolder = document.getElementById('hold');
    correct = document.createElement('ul');

    for (var i = 0; i < word.length; i++) {
      correct.setAttribute('id', 'my-word');
      guess = document.createElement('li');
      guess.setAttribute('class', 'guess');
      if (word[i] === "-") {
        guess.innerHTML = "-";
        space = 1;
      } else {
        guess.innerHTML = "_";
      }

      geusses.push(guess);
      wordHolder.appendChild(correct);
      correct.appendChild(guess);
    }
  }
  
  // Show lives and handle game over
  var comments = function () {
    showLives.innerHTML = "Tienes " + lives + " vidas";
    if (lives < 1) {
      showLives.innerHTML = "Fin del juego";
      revealWord();
      disableAlphabet();
    }
    for (var i = 0; i < geusses.length; i++) {
      if (counter + space === geusses.length) {
        showLives.innerHTML = "¡Ganaste!";
      }
    }
  }

  // Reveal the word when game is over
  var revealWord = function() {
    for (var i = 0; i < word.length; i++) {
      geusses[i].innerHTML = word[i];
    }
  }

  // Disable the alphabet buttons when game is over
  var disableAlphabet = function() {
    var alphabetButtons = document.querySelectorAll('#alphabet li');
    alphabetButtons.forEach(function(button) {
      button.onclick = null;
      button.setAttribute('class', 'disabled');
    });
  }

  // Animate man
  var animate = function () {
    var drawMe = lives ;
    drawArray[drawMe]();
  }
  
  // Hangman
  var canvas = function(){
    myStickman = document.getElementById("stickman");
    context = myStickman.getContext('2d');
    context.beginPath();
    context.strokeStyle = "#000";
    context.lineWidth = 2;
  };
  
  var head = function(){
    myStickman = document.getElementById("stickman");
    context = myStickman.getContext('2d');
    context.beginPath();
    context.arc(60, 25, 10, 0, Math.PI*2, true);
    context.stroke();
  }
    
  var draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke(); 
  }

  var frame1 = function() {
    draw (0, 150, 150, 150);
  };
  
  var frame2 = function() {
    draw (10, 0, 10, 600);
  };
  
  var frame3 = function() {
    draw (0, 5, 70, 5);
  };
  
  var frame4 = function() {
    draw (60, 5, 60, 15);
  };
  
  var torso = function() {
    draw (60, 36, 60, 70);
  };
  
  var rightArm = function() {
    draw (60, 46, 100, 50);
  };
  
  var leftArm = function() {
    draw (60, 46, 20, 50);
  };
  
  var rightLeg = function() {
    draw (60, 70, 100, 100);
  };
  
  var leftLeg = function() {
    draw (60, 70, 20, 100);
  };
  
  drawArray = [rightLeg, leftLeg, rightArm, leftArm, torso, head, frame4, frame3, frame2, frame1]; 

  // OnClick Function
  var check = function () {
    list.onclick = function () {
      var geuss = (this.innerHTML);
      this.setAttribute("class", "active");
      this.onclick = null;
      for (var i = 0; i < word.length; i++) {
        if (word[i] === geuss) {
          geusses[i].innerHTML = geuss;
          counter += 1;
        } 
      }
      var j = (word.indexOf(geuss));
      if (j === -1) {
        lives -= 1;
        comments();
        animate();
      } else {
        comments();
      }
    }
  }
  
  // Play
  var play = function () {
    categories = [
        ["capital", "valle-viejo", "fray-mamerto-esquiu", "belén", "tinogasta"],
        ["la-gruta", "la-catedral", "piedra-blanca", "quebrada-de-moreira", "el-shincal"],
        ["empanadas", "locro", "tamales", "humita", "cabrito"]
    ];

    chosenCategory = categories[Math.floor(Math.random() * categories.length)];
    word = chosenCategory[Math.floor(Math.random() * chosenCategory.length)];
    word = word.replace(/\s/g, "-");
    console.log(word);
    buttons();

    geusses = [];
    lives = 10;
    counter = 0;
    space = 0;
    result();
    comments();
    selectCat();
    canvas();
  }

  play();
  
  // Hint
  hint.onclick = function() {
    hints = [
        ["Capital de Catamarca", "Departamento cercano a la capital", "Departamento conocido por su producción de aceitunas", "Famoso por su arqueología", "Conocido por sus viñedos"],
        ["Santuario religioso", "Principal iglesia de la provincia", "Lugar histórico en Piedra Blanca", "Quebrada famosa por sus petroglifos", "Ruinas incas"],
        ["Plato tradicional argentino", "Guiso típico", "Envuelto en hoja de maíz", "Plato a base de maíz", "Carne de cabrito"]
    ];

    var catagoryIndex = categories.indexOf(chosenCategory);
    var hintIndex = chosenCategory.indexOf(word);
    showClue.innerHTML = "Pista: " + hints[catagoryIndex][hintIndex];
  };

  // Reset
  document.getElementById('reset').onclick = function() {
    correct.parentNode.removeChild(correct);
    letters.parentNode.removeChild(letters);
    showClue.innerHTML = "";
    context.clearRect(0, 0, 400, 400);
    play();
  }
}
