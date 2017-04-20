var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 100;
var ctx = canvas.getContext('2d');
var circleStartX;
var circleStartY;
var obsticles = [];
var player = new Victor(canvas.width / 2, canvas.height / 2);
var mouse = new Victor(0,0);
var forceCoeff = 2000;
var distExp = 5;
var distFalloffCoeff = 10;
var distFalloffExp = 5;
var vision = 100;

function drawCircle(x, y, r, fill, border) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = border;
    ctx.stroke();
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

document.getElementById('controls').addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        forceCoeff = +document.getElementById('forceCoeff').value;
        distExp = +document.getElementById('distExp').value;
        distFalloffCoeff = +document.getElementById('distFalloffCoeff').value;
        distFalloffExp = +document.getElementById('distFalloffExp').value;
    }
});

document.getElementById('forceCoeff').value = forceCoeff;
document.getElementById('distExp').value = distExp;
document.getElementById('distFalloffCoeff').value = distFalloffCoeff;
document.getElementById('distFalloffExp').value = distFalloffExp;

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
});

canvas.addEventListener('mousedown', function(e) {
    circleStartX = e.clientX - canvas.offsetLeft;
    circleStartY = e.clientY - canvas.offsetTop;
});

canvas.addEventListener('mouseup', function(e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    var radius = distance(circleStartX, circleStartY, x, y);
    if (radius < 10) {
        radius = 10;
    }
    obsticles.push({
        v: new Victor(circleStartX, circleStartY),
        r: radius,
        fill: 'green',
        border: '003300'
    });
    drawCircle(circleStartX, circleStartY, radius, 'green', '#003300');
    circleStartX = null;
    circleStartY = null;
});

function update(delta) {
    if (player.distance(mouse) < 5) return;
    // calculate forces
    // start with twords mouse
    var force = new Victor.fromObject(mouse).subtract(player).normalize().multiplyScalar(delta);
    // add repultion forces for each object
    for (var i = 0; i < obsticles.length; i++) {
        var obj = obsticles[i];
        var dist = player.distance(obj.v);
        if (dist < vision) {
            force.add(new Victor.fromObject(player).subtract(obj.v).normalize()
                .multiplyScalar(forceCoeff * Math.pow(obj.r,distExp)).divideScalar(distFalloffCoeff * Math.pow(dist, distFalloffExp)));
        }
    }
    player.add(force);
    if (player.x < 0) { player.x = 0; }
    if (player.y < 0) { player.y = 0; }
    if (player.x > canvas.width) { player.x = canvas.width; }
    if (player.y > canvas.height) { player.y = canvas.height; }
}

function render() {
    for (var i = 0; i < obsticles.length; i++) {
        var obj = obsticles[i];
        drawCircle(obj.v.x, obj.v.y, obj.r, obj.fill, obj.border);
    }
    // draw the moving object
    drawCircle(player.x, player.y, 10, 'red', 'black');
    drawCircle(player.x, player.y, vision, null, 'black');
    window.requestAnimationFrame(main);
}

function getRnd(min, max) {
    return Math.random() * (max - min + 1) + min;
}

// setup forceCoeff random map
for (var i = 0; i < 30; i++) {
    obsticles.push({
        v: new Victor(getRnd(30, canvas.width - 30), getRnd(30, canvas.height - 30)),
        r: 10, //getRnd(10, 30),
        fill: 'green',
        border: '003300'
    });
}

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    update(delta / 20); // larger denominator is slower movement
    render();

    then = now;
};

// Let's play this game!
var then = Date.now();
window.requestAnimationFrame(main);