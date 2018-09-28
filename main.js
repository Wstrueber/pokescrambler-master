const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
const input = document.getElementById('guess');
const form = document.querySelector('#form');
const pTag = document.getElementById('word-to-guess');
const pointsTag = document.getElementById('currentPoints');
const skipButton = document.getElementById('skip');
const hintButton = document.getElementById('hint');
const hintSprite = document.getElementById('hintSprite');
const pokemonArray = [];
const spriteArray = [];
let currentPoints = 0;
let selectedWord;
let selectedPokemon;

fetch(apiUrl)
  .then(response => response.json())
  .then(({ results }) => {
    results.map(pokemon => pokemonArray.push(pokemon));
  })
  .then(_ => {
    selectedWord = selectWord(pokemonArray.slice(0, 150));
    pTag.innerHTML = scrambleWord(selectedWord);
  })
  .catch(e => console.error(e));

pointsTag.innerHTML = currentPoints.toString();

function checkPoints() {
  if (currentPoints > 10) {
    skipButton.disabled = false;
  } else {
    skipButton.disabled = true;
  }
}

function selectWord(array) {
  let a = array[Math.floor(Math.random() * array.length)];
  selectedPokemon = a;
  return a.name;
}

function scrambleWord(word) {
  return word
    .split('')
    .shuffle()
    .join('');
}

function refresh() {
  pTag.innerHTML = scrambleWord(selectedWord);
  pointsTag.innerHTML = currentPoints.toString();
  input.value = '';
  checkPoints();
  hintButton.disabled = false;
  if (hintSprite.firstChild) hintSprite.removeChild(hintSprite.firstChild);
}

function skipWord() {
  if (currentPoints > 10) {
    selectedWord = selectWord(pokemonArray);
    currentPoints -= 10;
    refresh();
  }
}

function giveHint() {
  hintButton.disabled = true;
  fetch(selectedPokemon.url)
    .then(response => response.json())
    .then(({ sprites }) => {
      if (sprites.front_default) return sprites.front_default;
      else {
        return 'pokeball.png';
      }
    })
    .then(x => {
      let img = document.createElement('img');
      img.src = x;
      img.style = 'width: 100%';
      hintSprite.appendChild(img);
    })
    .catch(e => console.log(e));
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (input.value === selectedWord) {
    currentPoints +=
      selectedWord.length > 6 ? selectedWord.length * 2 : selectedWord.length;
    selectedWord = selectWord(pokemonArray);
    refresh();
  }
});
