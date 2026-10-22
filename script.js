
const GOAL_CANS = 20;
const GAME_TIME = 30;

let currentCans = 0;
let timeLeft = GAME_TIME;
let gameActive = false;
let spawnInterval;
let timerInterval;

const grid = document.querySelector('.game-grid');
const cansDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const achievements = document.getElementById('achievements');
const startButton = document.getElementById('start-game');

// Load the best score saved in the browser.
let bestScore = Number(localStorage.getItem('waterQuestBest')) || 0;

const bestScoreDisplay = document.getElementById('best-score');

// Display the saved best score when the page loads.
bestScoreDisplay.textContent = bestScore;

// Create the 3x3 game grid.
function createGrid() {
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Place a water can in a random cell.
function spawnWaterCan() {
  if (!gameActive) return;

  const cells = document.querySelectorAll('.grid-cell');

  // Remove the previous can.
  cells.forEach(cell => {
    cell.innerHTML = '';
  });

  // Choose a random cell.
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  randomCell.innerHTML = `
    <div class="water-can-wrapper" role="button"
         aria-label="Collect water can">
      <div class="water-can"></div>
    </div>
  `;
}

// Start or restart the game.
function startGame() {
  if (gameActive) return;

  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  currentCans = 0;
  timeLeft = GAME_TIME;
  gameActive = true;

  cansDisplay.textContent = currentCans;
  timerDisplay.textContent = timeLeft;
  achievements.textContent = 'Go! Collect 20 water cans!';
  startButton.textContent = 'Restart Game';

  createGrid();
  spawnWaterCan();

  spawnInterval = setInterval(spawnWaterCan, 1000);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

// Check for clicks on water cans.
grid.addEventListener('click', event => {
  const can = event.target.closest('.water-can-wrapper');

  if (!gameActive || !can) return;

  currentCans++;
cansDisplay.textContent = currentCans;

// Update the best score if the current score is higher.
if (currentCans > bestScore) {
  bestScore = currentCans;

  // Update the display.
  bestScoreDisplay.textContent = bestScore;

  // Save the best score for future visits.
  localStorage.setItem('waterQuestBest', bestScore);
}

  // Show feedback at milestones.
  if (currentCans === 5) {
    achievements.textContent = 'Great start! 5 cans collected!';
  } else if (currentCans === 10) {
    achievements.textContent = 'Amazing! You collected 10 cans!';
  }

  if (currentCans >= GOAL_CANS) {
    endGame(true);
  } else {
    // Remove the collected can.
    can.remove();

    achievements.textContent =
      currentCans >= 10
        ? `Amazing! ${currentCans} cans collected!`
        : `Nice work! ${currentCans} cans collected!`;
  }
});

// End the game and display the result.
function endGame(won) {
  gameActive = false;

  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  // Remove any remaining cans.
  document.querySelectorAll('.water-can-wrapper').forEach(can => {
    can.remove();
  });

  if (won) {
    achievements.textContent =
      'You did it! All 20 water cans collected!';
  } else {
    achievements.textContent =
      `Time is up! You collected ${currentCans} cans. Try again!`;
  }

  startButton.textContent = 'Play Again';
}

// Connect the start button to the game.
startButton.addEventListener('click', startGame);

// Set up the grid when the page loads.
createGrid();
