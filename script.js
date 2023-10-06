const audioFolder = "./audio";
const playButton = document.querySelector("#play-button");
const stopButton = document.querySelector("#stop-button");
const bpmInput = document.querySelector("#bpm-input");
const allAudioFiles = [];
const table0 = document.querySelector("#table-0")

const backgroundColor = "white"
const mouseOverColor = "yellow"
const lightupColor = "blue"

table0.style.width = '90%'

let inputArray = [];
let lastLitCell = Array(inputArray.length).fill(null);

let audioArray = [];
let timesToPlayArray = [];

let tableRows = [];
let tableCells = [];

//fill allAudioFiles:
for (let i = 0; i < 3; i++) {
  allAudioFiles.push(new Audio(`${audioFolder}/${i}.wav`))
}

let activeAudioFiles = [...allAudioFiles];

for (let i = 0; i < 3; i++) {
  inputArray.push(document.querySelector(`#input-${i}`));
}

for (let i = 0; i < inputArray.length; i++) {
  tableRows.push(`table-row-${i}`)
}

let inputArrayValues = inputArray.map((e) => e.value).filter((e) => e > 0);
const findGCD = (a, b) => (b == 0 ? a : findGCD(b, a % b));
const findLCM = (a, b) => (a / findGCD(a, b)) * b;
let rhythmGCD = Number(Math.max(...inputArrayValues), Math.min(...inputArrayValues));
let rhythmLCM = Number(Math.max(...inputArrayValues), Math.min(...inputArrayValues));

function findTheGCD() {
  rhythmGCD = (Math.max(...inputArrayValues), Math.min(...inputArrayValues));
  for (let i = 0; i < inputArrayValues.length; i++) {
    rhythmGCD = findGCD(rhythmGCD, inputArrayValues[i]);
  }
}
findTheGCD();

function findTheLCM() {
  rhythmLCM = (Math.max(...inputArrayValues), Math.min(...inputArrayValues));
  for (let i = 0; i < inputArrayValues.length; i++) {
    rhythmLCM = findLCM(rhythmLCM, inputArrayValues[i]);
  }
}
findTheLCM();

function createTableCells() {
  table0.innerHTML = "";

  for (let i = 0; i < inputArray.length; i++) {
    const row = table0.insertRow(i);
    let numberCounter = 1;

    for (let j = 0; j < rhythmLCM; j++) {
      const cell = row.insertCell(j);
      cell.setAttribute("id", `row${i}cell${j}`);

      if (inputArray[i].value > 0 && j % (rhythmLCM / inputArray[i].value) === 0) {
        cell.innerHTML = numberCounter;
                numberCounter++;
      } else {
        cell.innerHTML = "_"
      }

      cell.style.display = "inline-block";
      cell.style.width = `${Math.floor(100 / rhythmLCM)}%`;
    }
  }
}


createTableCells();

function findActiveAudio() {
  for (let i = 0; i < inputArray.length; i++) {
    if (inputArray[i].value === 0) {
      activeAudioFiles[i] = '';
    }
  }
}

let playEnabled = false;
let bpm = Number(bpmInput.value);
let seconds = (1000 * 60) / bpm;

function findTimesToPlay() {
  timesToPlayArray = [];
  for (let i = 0; i < inputArray.length; i++) {
    if (inputArray[i].value > 0) {
      timesToPlayArray.push(rhythmLCM / inputArray[i].value);
    } else {
      timesToPlayArray.push(0)
    }
  }
}
findTimesToPlay();

let totalArrayTime = seconds * 4;
let elementTime = totalArrayTime / rhythmLCM;

function playAudio(audio) {
  for (const sound of audio) {
    sound.play();
  }
}

playButton.addEventListener("click", function () {
  setValues();
  playEnabled = playEnabled === true ? false : true;
  loopAudio();
});

stopButton.addEventListener("click", function () {
  setValues();
  playEnabled = false;
  additionalMarks = [];
  cellCounter = 0;
});

function setValues() {
  bpm = Number(bpmInput.value);
  if (bpm > 300) bpm = 300;
  seconds = (1000 * 60) / bpm;
  inputArrayValues = inputArray.map((e) => e.value).filter((e) => e > 0);
  findTheGCD();
  findTheLCM();
  findTimesToPlay();
  totalArrayTime = seconds * 4;
  elementTime = totalArrayTime / rhythmLCM;
  createTableCells();
  findActiveAudio();
  findCells();
  addCellEventListeners();
  logAll();
}

function logAll() {
}
logAll();

bpmInput.addEventListener("keyup", function () {
  setValues();
});

for (let i = 0; i < inputArray.length; i++) {
  inputArray[i].addEventListener("keyup", function () {
    setValues();
  });
}

let allCells = [];
function findCells() {
  allCells = [];
  for (let i = 0; i < inputArrayValues.length; i++) {
    for (let j = 0; j < rhythmLCM; j++) {
      allCells.push(document.querySelector(`#row${i}cell${j % rhythmLCM}`))
    }
  }
}
findCells();

let additionalMarks = [];
function addCellEventListeners() {
  for (const e of allCells) {
    e.addEventListener("click", function () {
      const text = e.attributes[0].textContent;
             if (!additionalMarks.includes(text)) {
        additionalMarks.push(text);
              } else {
        const removalIndex = additionalMarks.findIndex(e => e === text);
        additionalMarks.splice(removalIndex, 1)
      }
    })
    e.addEventListener("mouseover", function () {
      e.style.backgroundColor = mouseOverColor;
    })
    e.addEventListener("mouseout", function () {
      e.style.backgroundColor = backgroundColor;
    })
  }
}
addCellEventListeners();

let cellCounter = 0;
function loopAudio() {
  if (playEnabled) {
    audioArray = [];

    for (let j = 0; j < timesToPlayArray.length; j++) {
      if (lastLitCell[j]) {
        lastLitCell[j].style.backgroundColor = backgroundColor;
        lastLitCell[j] = null;
      }
      let playCell = false;
      if (cellCounter % timesToPlayArray[j] === 0) {
        playCell = true;
      }

      if (additionalMarks.includes(`row${j}cell${cellCounter}`)) {
        playCell = playCell === true ? false : true;
      }

        const cell = document.querySelector(`#row${j}cell${cellCounter}`);
        if (playCell) {
          audioArray.push(activeAudioFiles[j].cloneNode());
          cell.style.backgroundColor = lightupColor;
          lastLitCell[j] = cell;
        }
    }

    playAudio(audioArray);
    setTimeout(function () {
      cellCounter++;
      if (cellCounter >= rhythmLCM) cellCounter = 0;
      loopAudio();
    }, elementTime);
  }
}