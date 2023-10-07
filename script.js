const audioFolder = "./audio";
const playButton = document.querySelector("#play-button");
const stopButton = document.querySelector("#stop-button");
const bpmInput = document.querySelector("#bpm-input");
let allAudioFiles = [];
const table0 = document.querySelector("#table-0");

const backgroundColor = "white";
const lightupColor = "blue";
const selectedColor = "lightblue";

const maxInstruments = 4;
const minInstruments = 1;

const numOfInstrumentsSelector = document.querySelector("#number-of-instruments");
let numberOfInstruments = Number(numOfInstrumentsSelector.value);

table0.style.width = "90%";

let inputArray = [];

let audioArray = [];
let timesToPlayArray = [];

let additionalMarks = [];
let activeAudioFiles = [];
let allCells = [];


function prepAudioArray() {
  allAudioFiles = [];
for (let i = 0; i < numberOfInstruments; i++) {
  allAudioFiles.push(new Audio(`${audioFolder}/${i}.wav`));
}
activeAudioFiles = [...allAudioFiles];
}
prepAudioArray();


function createInputs() {
  inputArray = [];
  const parent = document.getElementById("p1");
  parent.innerHTML = 'Poly Rhythm: ';
for (let i = 0; i < numberOfInstruments; i++) {
  const input = document.createElement("input");
  input.setAttribute("type", "number")
  input.setAttribute("id", `input-${i}`)
  let valueSet = 1;
  switch (i) {
    case 0: valueSet = 4;
    break;
    case 1: valueSet = 3;
    break;
    case 2: valueSet = 6;
    break;
    default: valueSet = 1;
  }
  input.setAttribute("value", valueSet)
  console.log(input)
  parent.appendChild(input);
  inputArray.push(document.querySelector(`#input-${i}`));
}
}
createInputs();

numOfInstrumentsSelector.addEventListener("change", function() {
  numberOfInstruments = numOfInstrumentsSelector.value;
  // if (numberOfInstruments)
  createInputs();
  setValues()
  // createTableCells();
  prepAudioArray();
  // updateColors();
})

numOfInstrumentsSelector.addEventListener("keyup", function() {
  numberOfInstruments = numOfInstrumentsSelector.value;
  createInputs();
  setValues()
  // createTableCells();
  prepAudioArray();
  // updateColors();
})


let inputArrayValues = inputArray.map((e) => e.value).filter((e) => e > 0);
const findGCD = (a, b) => (b == 0 ? a : findGCD(b, a % b));
const findLCM = (a, b) => (a / findGCD(a, b)) * b;
let rhythmGCD = Number(
  Math.max(...inputArrayValues),
  Math.min(...inputArrayValues)
);
let rhythmLCM = Number(
  Math.max(...inputArrayValues),
  Math.min(...inputArrayValues)
);

function determineNumberOfInstruments() {
  numberOfInstruments = numOfInstrumentsSelector.value;
  if (numberOfInstruments < minInstruments) numberOfInstruments = minInstruments;
  if (numberOfInstruments > maxInstruments) numberOfInstruments = maxInstruments;
}

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

      if (
        inputArray[i].value > 0 &&
        j % (rhythmLCM / inputArray[i].value) === 0
      ) {
        cell.innerHTML = numberCounter;
        additionalMarks.push(`row${i}cell${j}`);
        numberCounter++;
      } else {
        cell.innerHTML = "_";
      }

      cell.style.display = "inline-block";
      cell.style.width = `${Math.floor(90 / rhythmLCM)}%`;
    }
  }
}

createTableCells();

function findActiveAudio() {
  for (let i = 0; i < inputArray.length; i++) {
    if (inputArray[i].value === 0) {
      activeAudioFiles[i] = "";
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
      timesToPlayArray.push(0);
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
  // additionalMarks = [];
  setValues();
  playEnabled = playEnabled === true ? false : true;
  cellCounter = 0;
  loopAudio();
});

stopButton.addEventListener("click", function () {
  setValues();
  playEnabled = false;
  // additionalMarks = [];
  cellCounter = 0;
});

function setValues() {
  additionalMarks = [];
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
  addOutline();
  addCellEventListeners();
  updateColors();
}

bpmInput.addEventListener("keyup", function () {
  playEnabled = false;
  setValues();
  playEnabled = true;
});

for (let i = 0; i < inputArray.length; i++) {
  inputArray[i].addEventListener("keyup", function () {
    setValues();
  });
}

function findCells() {
  allCells = [];
  for (let i = 0; i < inputArrayValues.length; i++) {
    for (let j = 0; j < rhythmLCM; j++) {
      allCells.push(document.querySelector(`#row${i}cell${j % rhythmLCM}`));
    }
  }
}
findCells();

function addOutline() {
  for (const cell of allCells) {
    cell.style.border = "solid 2px white";
    cell.style.borderWidth = "medium"
  }
}

addOutline();

function addCellEventListeners() {
  for (const e of allCells) {
    e.addEventListener("click", function () {
      const text = e.attributes[0].textContent;
      if (!additionalMarks.includes(text)) {
        additionalMarks.push(text);
        e.style.backgroundColor = selectedColor;
        e.originalColor = selectedColor;
      } else {
        const removalIndex = additionalMarks.findIndex((e) => e === text);
        additionalMarks.splice(removalIndex, 1);
        e.style.backgroundColor = backgroundColor;
        e.originalColor = backgroundColor;
      }
    });

    e.addEventListener("mouseover", function () {
      e.style.border = "solid 2px black";
      e.style.borderWidth = "medium"
    });

    e.addEventListener("mouseout", function () {
      e.style.border = "solid 2px white"
      e.style.borderWidth = "medium"
    });
  }
}
addCellEventListeners();

let cellCounter = 0;

function updateColors() {
  for (let k = 0; k < allCells.length; k++) {
    const cell = document.querySelector(`#${allCells[k].id}`);
    if (additionalMarks.includes(cell.id)) {
      cell.style.backgroundColor = selectedColor;
    } else {
      cell.style.backgroundColor = backgroundColor;
    }
  }
}
updateColors();

function loopAudio() {
  if (playEnabled) {
    audioArray = [];

    updateColors();

    for (let j = 0; j < timesToPlayArray.length; j++) {
      let playCell = false;
      const cellName = `row${j}cell${cellCounter}`;

      if (additionalMarks.includes(cellName)) {
        playCell = true;
      }

      const cell = document.querySelector(`#${cellName}`);
      if (playCell) {
          cell.style.backgroundColor = lightupColor;
        let audioClone = activeAudioFiles[j].cloneNode();

        audioArray.push(audioClone);
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
