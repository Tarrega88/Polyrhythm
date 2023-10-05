const audioFolder = './audio';
//try this later: https://freesound.org/docs/api/
const playButton = document.querySelector("#play-button")
const stopButton = document.querySelector("#stop-button")
const bpmInput = document.querySelector("#bpm-input")
const input1 = document.querySelector("#input-1")
const input2 = document.querySelector("#input-2")

//let slowestSound = Math.min(Number(input2.value), Number(input1.value))

let audioArray = [];

let playEnabled = false;
let bpm = 60;
let seconds = 1000 * 60 / bpm;
let i = 0;

const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b
let gcdDefault = gcd(input2.value, input1.value);
let lcmDefault = lcm(input2.value, input1.value);

let timesToPlayLowest = lcmDefault / input1.value 
let timesToPlayHighest = lcmDefault / input2.value;
let totalArrayTime = seconds * Math.max(input1.value, input2.value);
let elementTime = totalArrayTime / lcmDefault;


function high() {
  const audio2 = new Audio(`${audioFolder}/2.wav`)
  audio2.play();
}

function low() {
  const audio1 = new Audio(`${audioFolder}/1.wav`)
  audio1.play();
}

function both() {
  const audio1 = new Audio(`${audioFolder}/1.wav`)
  const audio2 = new Audio(`${audioFolder}/2.wav`)
  audio1.play();
  audio2.play();
}

playButton.addEventListener("click", function() {
  if (input2.value > 0 && input1.value > 0) {
  playEnabled = true;
    loopAudio();
  }
})

stopButton.addEventListener("click", function() {
  playEnabled = false;
  i = 0;
})

function setValues() {
  bpm = Number(bpmInput.value)
  if (bpm > 300) bpm = 300;
  seconds = 1000 * 60 / bpm;
  gcdDefault = gcd(input2.value, input1.value)
  lcmDefault = lcm(input2.value, input1.value)
  timesToPlayHighest = lcmDefault / input2.value 
  timesToPlayLowest = lcmDefault / input1.value
  totalArrayTime = seconds * Math.max(input1.value, input2.value);
  elementTime = totalArrayTime / lcmDefault;
}

bpmInput.addEventListener("keyup", function() {
  setValues()
  // bpm = Number(bpmInput.value)
  // if (bpm > 280) bpm = 280;
  // seconds = 1000 * 60 / bpm;
})

input2.addEventListener("keyup", function() {
  setValues()
})

input1.addEventListener("keyup", function() {
  //slowestSound = Math.min(Number(input2.value), Number(input1.value))
  setValues()
})

function loopAudio() {
  switch(true) {
    case i % timesToPlayHighest === 0 && i % timesToPlayLowest === 0 : both(); console.log("BOTH")
    break;
    case i % timesToPlayHighest === 0 : high(); console.log("HIGH")
    break;
    case i % timesToPlayLowest === 0 : low(); console.log("LOW")
    break;
    // default: console.log("silence : ]")
  }
  if (playEnabled) {
      setTimeout(function() {
        i ++;
        loopAudio();
      }, elementTime)
    }
}