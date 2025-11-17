const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = 50;
let y = 50;
let speedX = 3;
let speedY = 3;
let radius = 20;
let raquetax = 0;
let raquetay = canvas.height - 10;
let raquetaWidth = 80; // ancho de la raqueta
let raquetaSpeed = 5;  // velocidad inicial de la raqueta
let vidas = 5;

// Control de teclas para PC
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
});

// --- CONTROL TÁCTIL POR LADO DE PANTALLA ---
canvas.addEventListener("touchstart", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touchX = e.touches[0].clientX - rect.left;

  if (touchX < canvas.width / 2) {
    // lado izquierdo
    leftPressed = true;
    rightPressed = false;
  } else {
    // lado derecho
    rightPressed = true;
    leftPressed = false;
  }

  e.preventDefault();
});

canvas.addEventListener("touchend", () => {
  leftPressed = false;
  rightPressed = false;
});

function draw() {
  // bola
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  // raqueta
  ctx.fillStyle = "blue";
  ctx.fillRect(raquetax, raquetay, raquetaWidth, 10);

  // marcador centrado en ambos ejes
  ctx.font = "50px Arial";
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.textBaseline = "middle";
  const texto = `Vidas: ${vidas}`;
  const textWidth = ctx.measureText(texto).width;
  const posX = (canvas.width - textWidth) / 2;
  const posY = canvas.height / 2;
  ctx.fillText(texto, posX, posY);
}

function update() {
  x += speedX;
  if (x + radius > canvas.width || x - radius < 0) {
    speedX *= -1;
    speedX *= 1.1;
    raquetaSpeed *= 1.05;
  }

  y += speedY;
  if (y - radius < 0) {
    speedY *= -1;
    speedY *= 1.1;
    raquetaSpeed *= 1.05;
  }

  // 🚀 Movimiento fluido con teclado o táctil
  if (rightPressed && raquetax + raquetaWidth < canvas.width) {
    raquetax += raquetaSpeed;
  }
  if (leftPressed && raquetax > 0) {
    raquetax -= raquetaSpeed;
  }

  // 🚀 Colisión con la raqueta
  if (y + radius >= raquetay && x >= raquetax && x <= raquetax + raquetaWidth) {
    speedY *= -1;
    y = raquetay - radius;
    speedY *= 1.1;
    raquetaSpeed *= 1.05;
  }

  // 🚨 Si la bola toca el suelo (pierdes una vida)
  if (y + radius > canvas.height) {
    vidas--;
    x = 50;
    y = 50;
    speedX = 3;
    speedY = 3;
    raquetaSpeed = 5;
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (vidas > 0) {
    update();
    draw();
    requestAnimationFrame(loop);
  } else {
    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.textBaseline = "middle";
    const texto = "Game Over";
    const textWidth = ctx.measureText(texto).width;
    ctx.fillText(texto, (canvas.width - textWidth) / 2, canvas.height / 2);
  }
}

loop();
