const audioResources = {
  timeout: new Audio("./assets/timeout.mp3"),
  countdown: new Audio("./assets/countdown.mp3"),
  coneOne: new Audio("./assets/cone1.mp3"),
  coneTwo: new Audio("./assets/cone2.mp3"),
  coneThree: new Audio("./assets/cone3.mp3"),
  coneFour: new Audio("./assets/cone4.mp3"),
};

// Obtener elementos del DOM
const cones = new Array(4)
  .fill(0)
  .map((_, i) => document.getElementById(`cone-${i + 1}`));

const initialDiv = document.getElementById("initial-div");
const timeInput = document.getElementById("time-input");
const intervalInput = document.getElementById("interval-input");
const startButton = document.getElementById("start-button");
const startCountdown = document.getElementById("start-countdown");
const runningDiv = document.getElementById("running-div");
const timerElement = document.getElementById("timer");
const stopButton = document.getElementById("stop-button");

// Definir variables
let currentConeIndex = null;
let currentTime;
let timeIntervalId;
let coneIntervalId;

// Inicializar valores
const startCountdownSeconds = 3;
timeInput.value = 6;
intervalInput.value = 2;
startButton.onclick = start;
stopButton.onclick = () => stop(false);

async function start() {
  // Se esconde el menu inicial
  initialDiv.classList.add("hide");
  // Se muestra la cuenta atrás inicial
  startCountdown.classList.remove("hide");

  // Se espera la cuenta atrás inicial
  await startCountdownFunction();

  // Se esconde la cuentra atrás inicial
  startCountdown.classList.add("hide");
  // Se muestra el menu activo
  runningDiv.classList.remove("hide");
  // Se muestra el valor correcto para el timer
  currentTime = timeInput.value;
  timerElement.innerHTML = currentTime;

  // Se hace el primer cambio de cono
  changeCone();

  // Se inicia la cuentra atrás principal
  timeIntervalId = setInterval(function () {
    currentTime -= 1;
    if (currentTime === 0) {
      audioResources.timeout.play();
      stop(true);
    } else if (currentTime < 4) {
      audioResources.countdown.play();
    }
    timerElement.innerHTML = currentTime;
  }, 1000);

  // Se inician los cambios de cono
  coneIntervalId = setInterval(changeCone, intervalInput.value * 1000);
}

async function startCountdownFunction() {
  return await new Promise(function (resolve) {
    let count = startCountdownSeconds;
    const interval = setInterval(function () {
      count -= 1;
      startCountdown.innerHTML = count;
      if (count === 0) {
        resolve();
        clearInterval(interval);
      }
    }, 1000);
  });
}

function stop(withDelay) {
  startCountdown.innerHTML = startCountdownSeconds;
  clearInterval(timeIntervalId);
  clearInterval(coneIntervalId);
  setTimeout(
    function () {
      runningDiv.classList.add("hide");
      initialDiv.classList.remove("hide");
      currentTime = null;
    },
    withDelay ? 1000 : 0
  );
}

function changeCone() {
  const newConeIndex = Math.floor(Math.random() * cones.length);
  // Cambiar si el nuevo index es diferente al anterior
  if (newConeIndex !== currentConeIndex) {
    currentConeIndex !== null &&
      cones[currentConeIndex].classList.remove("cone-highlight");
    cones[newConeIndex].classList.add("cone-highlight");
  }
  switch (newConeIndex + 1) {
    case 1:
      audioResources.coneOne.play();
      break;
    case 2:
      audioResources.coneTwo.play();
      break;
    case 3:
      audioResources.coneThree.play();
      break;
    case 4:
      audioResources.coneFour.play();
      break;
  }

  currentConeIndex = newConeIndex;
}
