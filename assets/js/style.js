/***  Variables ***/
const intro = document.querySelector(".intro");
const button = document.getElementById("play");
const gameDiv = document.querySelector(".game");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const categoriesDiv = document.getElementById("categories");
const alphaDiv = document.getElementById("alpha");
const livesDiv = document.getElementById("lives");
let wordToGuess;
let correctAnswers;

let lives;
const categories = {
  villes: ["londre", "tokyo", "paris", "bruxelles", "berlin", "amsterdam"],
  pays: ["portugal", "suisse", "pologne", "liechtenstein", "allemagne", "belgique", "canada", "japon", "luxembourg"],
  marque: ["samsung", "huawei", "xiaomi", "amazon", "disney", "ubuntu"],
  bd : ["asterix", "scrameustache", "spirou et fantasio"],
  chanteur : ["jacques brel", "lady gaga", "madonna", "lorie", "jonhy halliday"],
  animaux : ["dauphin", "chevaux", "lion", "jaguar", "ours", "koala"]
};

const alpha = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

/*** Event Listeners ***/
button.addEventListener("click", gameStart);

/*** Functions ***/
function gameStart() {
  setDefault();

  // Pick a category
  const cat = Object.keys(categories);
  let catContent = "<ul id='cat-list'>";
  cat.forEach(element => {
    catContent += `
    <li>${element}</li>
    `;
  });
  catContent += "</ul>";
  categoriesDiv.innerHTML = `<p>Choisis une catégorie :</p> ${catContent}`;
}

function setDefault() {
  // Set Default values / definitions
  lives = 10;
  correctAnswers = 0;

  categoriesDiv.addEventListener("click", pickCat); // Set event delegation
  alphaDiv.addEventListener("click", clickedGuess); // Set event delegation

  alphaDiv.innerHTML = "";
  livesDiv.innerText = "";

  canvas.style.display = "none";
  ctx.clearRect(0, 0, 400, 250);

  gameDiv.style.display = "block";
  button.style.visibility = "hidden";
}

function draw(toX, toY, lineX, lineY, round = false) {
  ctx.strokeStyle = "#fff";
  ctx.beginPath();

  if (round) {
    ctx.arc(toX, toY, lineX, lineY, 2 * Math.PI); // Head
  } else {
    ctx.moveTo(toX, toY);
    ctx.lineTo(lineX, lineY);
  }

  ctx.stroke();
}

function pickCat(e) {
  let li = e.target;
  if (li.tagName === "LI") {
    let chosenCat = li.innerText;
    let guess = categories[li.innerHTML];

    categoriesDiv.removeEventListener("click", pickCat);
    displayPicked(guess, chosenCat);
  }
}

function displayPicked(guess, chosenCat) {
  // Get a random word from chosen category array
  let random = Math.floor(Math.random() * guess.length);
  wordToGuess = guess[random];

  console.log(wordToGuess);

  // Loop through the word and show the number of letters to guess
  let content = `<p> ${chosenCat} </p><ul>`;
  for (let i = 0; i < wordToGuess.length; i++) {
    content += `<li>_</li>`;
  }
  content += "</ul>";

  categoriesDiv.innerHTML = content;

  // Show canvas and number of lives
  canvas.style.display = "block";
  livesDiv.innerText = ` Il te reste ${lives} chance`;

  // Display the letters to choose
  displayAlpha();
}

function displayAlpha() {
  let content = `<ul>`;

  for (let i = 0; i < alpha.length; i++) {
    content += `<li> ${alpha[i]} </li>`;
  }
  content += `</ul>`;
  alphaDiv.innerHTML = content;
}

function clickedGuess(e) {
  let li = e.target;

  // When a letter is clicked add class and check if it was a correct guess or not
  if (li.tagName === "LI" && !li.classList.contains("clicked")) {
    li.classList.add("clicked");
    let letter = li.innerText;
    check(letter, wordToGuess);
  }
}

function check(letter, wordToGuess) {
  letter = letter.toString().toLowerCase();
  wordToGuess = wordToGuess.toString().toLowerCase();
  let totalToWin = wordToGuess.length;

  // Loop through the word and check if it has the selected letter
  for (let i = 0; i < wordToGuess.length; i++) {
    if (wordToGuess[i] === letter) {
      let correctLi = categoriesDiv.getElementsByTagName("li")[i];
      correctLi.innerText = letter;
      correctAnswers++;
    }
  }

  // Check if the selected letter exists in the word, if not, decrease the number of lives left and draw on canvas
  if (wordToGuess.indexOf(letter) < 0) {
    lives--;
    livesDiv.innerText = ` Il te reste ${lives} chances`;
    drawHangMan(lives);
    if (lives === 0) endGame("perdu");
  }

  if (correctAnswers === totalToWin) endGame("gagné");
}

/** improve code **/
function drawHangMan(lives) {
  switch (lives) {
    case 9:
      draw(100, 150, 100, 10);
      break;
    case 8:
      draw(90, 145, 250, 145);
      break;
    case 7:
      draw(100, 20, 200, 20);
      break;
    case 6:
      draw(200, 20, 200, 30);
      break;
    case 5:
      draw(200, 37, 8, 0, true);
      break;
    case 4:
      draw(200, 45, 200, 80);
      break;
    case 3:
      draw(200, 80, 190, 110);
      break;
    case 2:
      draw(200, 80, 210, 110);
      break;
    case 1:
      draw(200, 50, 190, 80);
      break;
    case 0:
      draw(200, 50, 210, 80);
      break;
  }
}

function endGame(txt) {
  txt === "winner"
    ? (livesDiv.innerText = `Génial ! Tu as gagné.`)
    : (livesDiv.innerText = `Tu as perdu !`);

  button.innerText = "Un nouveau jeu ?";
  button.style.visibility = "visible";

  alphaDiv.removeEventListener("click", clickedGuess);
}
