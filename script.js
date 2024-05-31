"use strict";

const dspMsg = document.querySelector("#dsp-msg");
const checkGuess = document.querySelector("#check-guess");
let userInput = document.querySelector("#user-input");
const attemptsElement = document.querySelector("#attempt-left");
const newGame = document.querySelector("#new-game");
const hintBtn = document.querySelector("#get-hint");
const hintDisplay = document.getElementById('hint-disp');
const errorMessage = document.querySelector('#error-message');

const minNumber = 1;
const maxNumber = 100;
let targetNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
let attempts = 0;
let maxAttempts = 3;

let gameInProgress = false; 
newGame.disabled = true; 
let gameWon = false; 
let gameLost = false; 
let currentHint = "";

console.log(targetNumber);

const quirkyMessages = [
  "Looks like guessing isn't your style!",
  "Guessing games are hard, aren't they?",
  "The number was right there!", 
  "Better luck next time.",
  "Guessing is tough work, huh?"
];

const congratulatoryMessages = [
  "wow ! You're a guessmaster!",
  "Impressive! You guessed it right!",
  "congratulation! You got it!",
  "You did it! Well done!",
  "kudos! You're a guessing pro!"
];

function getRandomMessage(messagesArray) {
  const randomArrayIndex = Math.floor(Math.random() * messagesArray.length);
  return messagesArray[randomArrayIndex];
}

hintBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentHint === "") {
    currentHint = generateHint(targetNumber);
  }
  hintDisplay.textContent = currentHint;
});

function generateHint(number) {
  let hint = "";
  if (number % 2 === 0) {
    hint += "The target number is even. ";
  } else {
    hint += "The target number is odd. ";
  }

  if (isPrime(number)) {
    hint += "It's also a prime number.";
  } else {
    hint += "It's not a prime number.";
  }
  return hint;
}

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

checkGuess.addEventListener('click', (e) => {
  e.preventDefault();
  if (!gameInProgress) {
    gameInProgress = true;
    newGame.disabled = true;
  }

  userInput = parseInt(document.querySelector("#user-input").value);

  if (isNaN(userInput) || userInput < minNumber || userInput > maxNumber) {
    errorMessage.textContent = `Please enter a number between ${minNumber} and ${maxNumber}.`;
    errorMessage.style.display = 'block';
    return;
  } else {
    errorMessage.style.display = 'none';
  }

  attempts++;
  let attemptsLeft = maxAttempts - attempts;

  if (userInput === targetNumber) {
    gameWon = true;
    dspMsg.textContent = `${getRandomMessage(congratulatoryMessages)} You guessed the correct number "${targetNumber}" in ${attempts} attempt(s).`;
    document.querySelector("#check-guess").disabled = true;
    disableGame();
  } else if (attempts === maxAttempts) {
    gameLost = true;
    dspMsg.textContent = `${getRandomMessage(quirkyMessages)} The correct number was ${targetNumber}.`;
    document.querySelector("#check-guess").disabled = true;
    disableGame();
  } else if (userInput < targetNumber) {
    dspMsg.textContent = "Too low! Try again.";
  } else {
    dspMsg.textContent = "Too high! Try again.";
  }

  if (Math.abs(userInput - targetNumber) <= 5) {
    dspMsg.textContent += " You were so close!";
  }

  attemptsElement.textContent = `Attempts left: ${attemptsLeft}`;

  if ((gameWon || gameLost) && attempts === maxAttempts && userInput === targetNumber) {
    dspMsg.textContent = `${getRandomMessage(congratulatoryMessages)} You guessed the correct number "${targetNumber}" in ${attempts} attempt(s).`;
  }

  document.querySelector("#user-input").value = "";
});

newGame.addEventListener('click', (e) => {
  console.log("New game button clicked");
  e.preventDefault();
  resetGame();
});

function resetGame() {
  attempts = 0;
  targetNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  console.log(targetNumber);
  gameInProgress = false;
  newGame.disabled = true;
  document.querySelector("#check-guess").disabled = false;
  document.querySelector("#user-input").value = "";
  dspMsg.textContent = `New game started! Guess a number between ${minNumber} and ${maxNumber}.`;
  hintDisplay.textContent = '';
  currentHint = "";
  attemptsElement.textContent = `Attempts left: ${maxAttempts}`;
  errorMessage.style.display = 'none';
}

function disableGame() {
  gameInProgress = false;
  newGame.disabled = false;
}

userInput.setAttribute("type", "number");
userInput.setAttribute("min", minNumber);
userInput.setAttribute("max", maxNumber);

userInput.addEventListener('input', (e) => {
  let value = userInput.value;
  userInput.value = value.replace(/[^0-9]/g, '');
});