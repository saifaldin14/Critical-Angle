// call on the canvas
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var wood = document.getElementById("wood");
var pat = c.createPattern(wood, "repeat");
let img = new Image();
img.src = './assets/bg.jpg';

function setup() {
    canvas.height = 625;
    canvas.width = 625;
}
setup();

img.addEventListener("load", () => {
    c.save()
    c.globalCompositeOperation='destination-over'
    c.drawImage(img, 0, 0, 600, 600);
    c.restore();
})

const drawImage = () => {
    c.save()
    c.globalCompositeOperation='destination-over'
    c.drawImage(img, 0, 0, 600, 600);
    c.restore();
}
drawImage();


const drawRamp = (angle) => {
    angle = (angle + 1) % 360;

    c.save();
    c.translate(570, 570);
    c.rotate(angle * Math.PI / 180);
    c.translate(-570, -570);

    c.beginPath();
    //c.moveTo(-750, 0);
    c.moveTo(570, 570);
    c.lineWidth = 20;
    //c.lineTo(0, 0);
    c.lineTo(50, 570);
    c.translate(0, 570);
    c.strokeStyle=pat;
    c.stroke();
    c.restore();
}

function drawBase() {
    c.save()
    c.beginPath();
    c.rotate(0 * Math.PI / 180);
    c.moveTo(570, 570);
    c.lineWidth = 30;
    c.lineTo(50, 570);
    c.strokeStyle=pat;
    c.stroke();
    c.restore();
}
drawBase();

const drawLine = (x1, y1, x2, y2) => {
    c.save();
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineWidth = 5;
    c.lineTo(x2, y2);
    c.stroke();
    c.restore();
}

function genRand(min, max, decimalPlaces) {
    var rand = Math.random()*(max-min) + min;
    var power = Math.pow(100, decimalPlaces);
    return Math.floor(rand*power) / power;
}

//var currX = -730;
var currX = 90;
var currY = 507;

var criticalAngle = genRand(19.5, 20.5, 1);
var currAngle = 0;
var activeDown = false;
var massMsg = "m1";

function setTheta1() {
    var massLabel = document.getElementById('mass-label');
    criticalAngle = genRand(19.5, 20.5, 1);
    massLabel.innerHTML = "M1: 400.00";
    massMsg = "m1";
    changeButtonColor();
    resetRamp();
}

function setTheta2() {
    var massLabel = document.getElementById('mass-label');
    criticalAngle = genRand(20.5, 21.5, 1);
    massLabel.innerHTML = "M2: 800.00";
    massMsg = "m2";
    changeButtonColor();
    resetRamp();
}

const rectangle = (posX, posY, angle) => {
    c.save();

    c.save();
    c.translate(570, 570);
    c.rotate(angle * Math.PI / 180);
    c.translate(-570, -570);

    c.beginPath();
    c.fillStyle = "#668cff";
    c.fillRect(posX, posY, 80, 50);
    c.fillStyle = "white";
    c.font = "15pt sans-serif";
    c.textAlign="center";
    c.textBaseline = "middle";
    c.fillText(massMsg, posX+(80/2),posY+(50/2));
    c.stroke();
    c.restore();
}

function downwardStart() {
    currX = 90;
    currY = 507;

    c.clearRect(0, 0, 700, 700);
    //const currAngle = 45;
    drawRamp(currAngle);
    drawBase();
    rectangle(currX, currY, currAngle);
    changeButtonColor();
    //rectangle(weightPositionX, linePositionY2, 0); //Draw weights box
}
downwardStart();

function startAnim() {
    var newAngle = document.getElementById('add_theta').valueAsNumber;
    var thetaLabel = document.getElementById('thetaLabel');
    currAngle = newAngle;

    c.clearRect(0, 0, 700, 700);
    drawRamp(currAngle);
    drawBase();
    drawImage();
    rectangle(currX, currY, currAngle);

    if (currAngle >= criticalAngle) {
        activeDown = true;
        downRamp();
    }
    //document.getElementById('add_theta').value = '';
    thetaLabel.innerHTML = currAngle.toFixed(2);
}

function downRamp() {
    if (activeDown) {
        c.clearRect(0, 0, 700, 700);
        drawImage();
        drawBase();
        drawRamp(currAngle);
        currX += 5;
        console.log(currX);
        if (currX < 470) {
            rectangle(currX, currY, currAngle);
            drawImage();
        }
        else {
            currX = 470
            rectangle(currX, 507, currAngle);
            activeDown = false;
        }
        requestAnimationFrame(downRamp);
    }
}

function resetPosition() {
    activeDown = false;
    currAngle = 0;
    thetaLabel.innerHTML = currAngle.toFixed(2);
    currY = 507;
    currX = 90;

    c.clearRect(0, 0, 700, 700);
    drawImage();
    drawRamp(currAngle);
    rectangle(currX, currY, currAngle);
    drawBase();
    document.getElementById('add_theta').value = '';
}

function resetRamp() {
    if (massMsg == "m1")
        criticalAngle = genRand(19.5, 20.5, 0);
    else if (massMsg == "m2")
        criticalAngle = genRand(20.5, 21.5, 0);
    changeButtonColor();
    resetPosition();
}

function changeButtonColor () {
    if (massMsg == "m1") {
        document.getElementById("submit_button1").className = 'btn btn-danger';
        document.getElementById("submit_button2").className = 'btn btn-success';
    } else if (massMsg == "m2") {
        document.getElementById("submit_button1").className = 'btn btn-success';
        document.getElementById("submit_button2").className = 'btn btn-danger';
    }
}
