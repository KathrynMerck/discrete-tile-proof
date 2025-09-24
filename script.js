//<![CDATA[
let playButton = document.getElementById("playButton");
let pauseButton = document.getElementById("pause");
let time = 70;
let gX;
let x;
let fadeOp;
let scale;

let fadeInt;
let delayInt;
let revFadeInt;
let divOp;
let growInt;
let revZoomInt;
let divFadeInInt;
let divFadeOutInt;
let shrinkTimeout;
let downButton = document.getElementById("download");

function tileFull() {
  gX = parseInt(document.getElementById("xVal").value);
  x = parseInt(document.getElementById("xVal").value);
  let current = document.getElementById("current");
  current.setAttributeNS(null, "href", "#g" + x);
  fadeOp = 1;
  divOp = 0;
  scale = 1;
  deletePrev();
  recurAlg(x);
}

function recurAlg(x) {
  let defs = document.getElementById("defs");
  if (x == 1) {
    return;
  }
  recurAlg(x - 1);
  const twoPow = Math.pow(2, x);
  const gLess = document.getElementById("g" + (x - 1));
  const group = document.createElementNS('http://www.w3.org/2000/svg', "g");
  group.id = "g" + x;
  group.setAttributeNS(null, "class", "gen");

  const newGroup = [];
  const xVals = [-300, -600, 0, 600, -600];
  const yVals = [300, -600, 0, 600, 600];
  const rotation = [0, -90, 0, 90, 0];
  for (let i = 0; i < 5; i++) {

    newGroup[i] = document.createElementNS('http://www.w3.org/2000/svg', "use");
    newGroup[i].setAttributeNS(null, "href", "#g" + (x - 1));
    newGroup[i].setAttributeNS(null, "x", xVals[i]);
    newGroup[i].setAttributeNS(null, "y", yVals[i]);
    newGroup[i].setAttributeNS(null, "transform", "rotate(" + rotation[i] + ")");
    newGroup[i].setAttributeNS(null, "id", "elt:" + x + ":" + i);
    group.appendChild(newGroup[i]);
  }
  if (x == 2 && overlay.checked == true) {
    let cols = document.createElementNS('http://www.w3.org/2000/svg', "use");
    cols.setAttributeNS(null, "href", "#colors");
    cols.setAttributeNS(null, "x", "0");
    cols.setAttributeNS(null, "y", "0");
    cols.setAttributeNS(null, "id", "col2");
    group.appendChild(cols);
  }
  /*newGroup[4] = document.createElementNS('http://www.w3.org/2000/svg', "use");
  newGroup[4].setAttributeNS(null, "href", "#g1");
  newGroup[4].setAttributeNS(null, "x", xVals[4]);
  newGroup[4].setAttributeNS(null, "y", yVals[4]);
  newGroup[4].setAttributeNS(null, "transform", "rotate(" + rotation[4] + ") scale(" + Math.pow(0.5, x - 2) + ")");
  console.log(Math.pow(0.5, x - 2));*/
  //group.appendChild(newGroup[4]);
  group.setAttributeNS(null, "transform", "scale(0.5)");

  defs.appendChild(group);

}

function zoooom() {
  let expand = document.getElementById("expand");
  if (x == 1) {
    delayInt = window.setInterval(delay, time);
    window.clearInterval(growInt);
    return;
  }
  if (scale <= 2) {
    scale += 0.02;
    expand.setAttributeNS(null, "transform", "matrix(" + scale + ", 0, 0, " + scale + ", " + (700 * (1 - scale)) + ", " + (100 * (1 - scale)) + ")");
  } else {
    fadeInt = window.setInterval(fade, time * 1.5);
    window.clearInterval(growInt);
  }
}

function revZoooom() {
  let expand = document.getElementById("expand");
  if (x >= gX) {
    //delayInt = window.setInterval(delay, time);
    window.clearInterval(revZoomInt);

    divFadeOutInt = window.setInterval(divFadeOut, time);
    return;
  }
  if (scale >= .5) {
    scale -= 0.02;
    expand.setAttributeNS(null, "transform", "matrix(" + scale + ", 0, 0, " + scale + ", " + (700 * (1 - scale)) + ", " + (100 * (1 - scale)) + ")");
  } else {
    x++;
    fadeOp = 0;
    chartReset();
    if (x <= gX)
      revFadeInt = window.setInterval(revFade, time * 1.5);
    window.clearInterval(revZoomInt);

  }
}
function fade() {
  let fadeElts = [document.getElementById("elt:" + x + ":" + 0),
  document.getElementById("elt:" + x + ":" + 1),
  document.getElementById("elt:" + x + ":" + 3),
  document.getElementById("elt:" + x + ":" + 4)];

  let divider = document.getElementById("divider");
  let i;
  for (i = 0; i < 4; i++) {
    fadeElts[i].setAttributeNS(null, "opacity", fadeOp);
    divider.setAttributeNS(null, "opacity", fadeOp);
  }
  fadeOp -= 0.2;
  if (fadeOp <= 0) {
    x--;
    window.clearInterval(fadeInt);
    fadeOp = 1;
    chartReset();
    growInt = window.setInterval(zoooom, time);
  }
}

function revFade() {
  let fadeElts = [document.getElementById("elt:" + x + ":" + 0),
  document.getElementById("elt:" + x + ":" + 1),
  document.getElementById("elt:" + x + ":" + 3),
  document.getElementById("elt:" + x + ":" + 4)];
  let divider = document.getElementById("divider");
  let i;
  for (i = 0; i < 4; i++) {
    fadeElts[i].setAttributeNS(null, "opacity", fadeOp);
    //divider.setAttributeNS(null, "opacity", fadeOp);
  }

  fadeOp += 0.2;
  if (fadeOp >= 1.1) {
    window.clearInterval(revFadeInt);
    revZoomInt = window.setInterval(revZoooom, time);
  }
}


function chartReset() {
  let expand = document.getElementById("expand");
  let current = document.getElementById("current");
  let divider = document.getElementById("divider");
  current.setAttributeNS(null, "href", "#g" + x);
  expand.setAttributeNS(null, "transform", "matrix(1, 0, 0, 1, 0, 0)");
  divider.setAttributeNS(null, "opacity", 1);
  scale = 1;
}

let delayCounter = 0;
function delay() {
  delayCounter += 1;
  if (delayCounter >= 10) {
    console.log(":]");
    revZoomInt = window.setInterval(revZoooom, time);
    clearInterval(delayInt);
  }
}
function divFadeIn() {
  document.getElementById("divider").setAttributeNS(null, "opacity", divOp);
  divOp += 0.1;
  if (divOp > 1.1) {
    clearInterval(divFadeInInt);
  }
}

function divFadeOut() {
  document.getElementById("divider").setAttributeNS(null, "opacity", divOp);
  divOp -= 0.1;
  if (divOp <= 0) {
    clearInterval(divFadeOutInt);
  }
}

function deletePrev() {
  console.log("I am Going to ");
  olds = document.getElementsByClassName("gen");
  let i;
  while (olds[0]) {
    console.log(olds.length + "!");
    olds[0].parentNode.removeChild(olds[0]);
  }

  window.clearInterval(growInt);
  window.clearInterval(revZoomInt);
}

playButton.addEventListener("click", tileFull);
playButton.addEventListener("click", function() {
  shrinkTimeout = setTimeout(function() { growInt = window.setInterval(zoooom, time); }, 2000);
  setTimeout(function() { divFadeInInt = window.setInterval(divFadeIn, time); }, 1000);
});
pauseButton.addEventListener("click", function() {
  window.clearInterval(growInt);
  window.clearInterval(revZoomInt);
  clearTimeout(shrinkTimeout);
});

function download() {
  let test = document.getElementById("test");
  let svg = document.getElementById("chart");
  let imageText = '<svg version="1.1" width="800" height="800" style="border: 2px solid black;" xmlns="http://www.w3.org/2000/svg">' + svg.innerHTML + "</svg>";
  const link = document.createElement("a");
  const blob = new Blob([imageText], {
    type: "image/svg+xml",
  });
  link.href = URL.createObjectURL(blob);
  link.download = "chart.svg";
  link.click();
  URL.revokeObjectURL(link.href);

}

downButton.addEventListener("click", download);

//]]>

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//not chart related

const speedLab = document.getElementById("speedLab");
const speedData = document.getElementById("speed");
const color = document.getElementById("globalColor");
const stroke = document.getElementById("globalStroke");
const overlay = document.getElementById("overlay");
function updateSpeed() {
  speedLab.innerText = speed.value;
  time = speedData.value;
}

function updateColor() {
  document.getElementById("tile").style.fill = color.value;
  document.getElementById("divider").style.stroke = color.value;
}
function updateStroke() {
  document.getElementById("tile").style.stroke = stroke.value;
}

speedData.addEventListener("input", updateSpeed);
color.addEventListener("input", updateColor);
stroke.addEventListener("input", updateStroke);
//overlay.addEventListener("change", )