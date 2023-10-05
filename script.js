const audioFolder = "./audio";

//try this later: https://freesound.org/docs/api/
const playButton = document.querySelector("#play-button");
const stopButton = document.querySelector("#stop-button");
const bpmInput = document.querySelector("#bpm-input");
const allAudioFiles = [];
const table0 = document.querySelector("#table-0")
table0.style.width = '100%'

let inputArray = [];
let audioArray = [];
let timesToPlayArray = [];

let tableRows = [];
let tableCells = [];

//fill allAudioFiles:
for (let i = 0; i < 3; i ++) {
  allAudioFiles.push(new Audio(`${audioFolder}/${i}.wav`))
}

let activeAudioFiles = [...allAudioFiles];

for (let i = 0; i < 3; i++) {
  inputArray.push(document.querySelector(`#input-${i}`));
}

for (let i = 0; i < inputArray.length; i ++) {
  tableRows.push(`table-row-${i}`)
}


function createTableCells() {
  table0.innerHTML = "";
  for (let i = 0; i < inputArray.length; i ++) {
    const row = table0.insertRow(i)
    for (let j = 0; j < inputArray[i].value; j ++) {
      const cell = row.insertCell(j);
      cell.setAttribute("id", `row${i}cell${j}`);
      cell.innerHTML = j + 1;
      cell.style.display = "inline-block"
       cell.style.width = `${90 / inputArray[i].value}%`
    }
  }
}
createTableCells();
function findActiveAudio() {
  for (let i = 0; i < inputArray.length; i ++) {
    if (inputArray[i].value === 0) {
      activeAudioFiles[i] = '';
    }
  }
}

let inputArrayValues = inputArray.map((e) => e.value).filter((e) => e > 0);
const findGCD = (a, b) => (b == 0 ? a : findGCD(b, a % b));
const findLCM = (a, b) => (a / findGCD(a, b)) * b;
let rhythmGCD = (Math.max(...inputArrayValues), Math.min(...inputArrayValues));
let rhythmLCM = (Math.max(...inputArrayValues), Math.min(...inputArrayValues));

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


let playEnabled = false;
let bpm = Number(bpmInput.value);
let seconds = (1000 * 60) / bpm;
let i = 0;

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
  playEnabled = false;
  i = 0;
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
  logAll();
}

function logAll() {
  console.log("Table Cells:")
  console.log(tableCells)
  console.log("Input Array:")
  console.log(inputArray)
  console.log("Input Values:");
  console.log(...inputArray.map((e) => e.value));
  console.log("inputArrayValues:")
  console.log(inputArrayValues)
  console.log(`rhythmGCD: ${rhythmGCD}`);
  console.log(`rhythmLCM: ${rhythmLCM}`);
  console.log(`timesToPlayArray: ${timesToPlayArray}`);
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

// function loopAudio() {

//   if (playEnabled) {
//     audioArray = [];

//     for (let j = 0; j < timesToPlayArray.length; j++) {
//       if (i % timesToPlayArray[j] === 0) {
//         const cell = document.querySelector(`#row${j}cell${0}`)
//         audioArray.push(activeAudioFiles[j].cloneNode());
//         cell.style.backgroundColor = 'blue'
//       } else {
//         const cell = document.querySelector(`#row${j}cell${0}`)
//         cell.style.backgroundColor = 'white'
//       }
//     }
//     playAudio(audioArray);
//     setTimeout(function () {
//       i++;
//       loopAudio();
//     }, elementTime);
//   }
// }
function loopAudio() {
  if (playEnabled) {
      audioArray = [];

      for (let j = 0; j < timesToPlayArray.length; j++) {
          for (let k = 0; k < inputArray[j].value; k++) {
              const resetCell = document.querySelector(`#row${j}cell${k}`);
              if (resetCell) {
                  resetCell.style.backgroundColor = 'white';
              }
          }
        
          let currentCellIndex = Math.floor(i / timesToPlayArray[j]) % inputArray[j].value;

          if (i % timesToPlayArray[j] === 0) {
              const cell = document.querySelector(`#row${j}cell${currentCellIndex}`);
              if (cell) {
                  audioArray.push(activeAudioFiles[j].cloneNode());
                  cell.style.backgroundColor = 'blue';
              }
          }
      }

      playAudio(audioArray);

      setTimeout(function () {
          i++;
          loopAudio();
      }, elementTime);
  }
}