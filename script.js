const player = document.getElementById("player");
const world = document.getElementById("world");

let cenaAtual = 0;
let andando = false;

const titles = document.querySelectorAll('.cascade-js');

titles.forEach((el, i) => {
  setTimeout(() => {
    el.classList.add('show');
  }, i * 400);
});

function tocarMusicaInicial() {
  const audio = document.getElementById("meuAudio");
audio.muted = true;   
  audio.play().then(() => {
    audio.muted = false;
    audio.volume = 0.10; // volume 5%
  });
}

function tocarMusicaFinal() {
  const audio = document.getElementById("meuAudioFinal");
const inicial = document.getElementById("meuAudio");
   inicial.pause();      // garante que o outro áudio pare
  inicial.currentTime = 0;
audio.muted = true;   
  audio.play().then(() => {
    audio.muted = false;
    audio.volume = 0.10; // volume 5%
  });
}

function avancarCena() {
  if (andando) return; // trava clique se já estiver andando
  andando = true;

  andarAteFim(() => {
    cenaAtual++;
    mudarCena();
    player.style.left = "50px"; // volta pro início
    andando = false;
  });
}

function andarAteFim(callback) {
  andando = true;
  let posX = parseInt(player.style.left) || 50;
  const limite = window.innerWidth - 100; // limite antes da borda

  const animacao = setInterval(() => {
    posX += 50;
    player.style.left = posX + "px";

    if (posX >= limite) {
      clearInterval(animacao);
      andando = false;
      callback();
    }
  }, 16); // ~60fps
}

function mudarCena() {
  world.style.transform = `translateX(-${cenaAtual * 100}vw)`;
}
// --- Fogos de artifício ---
const PARTICLES_PER_FIREWORK = 150;
const BASE_PARTICLE_SPEED = 0.6;
const FIREWORK_LIFESPAN = 600;
const PARTICLE_INITIAL_SPEED = 4.5;
const GRAVITY = 9.8;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let particles = [];

const updateCanvasSize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener("resize", updateCanvasSize);
updateCanvasSize();

class Particle {
  constructor(x, y, r=255, g=50, b=50, speed=1, isFixedSpeed=false){
    this.x = x;
    this.y = y;
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = 0.05;
    this.radius = 1 + Math.random();
    this.angle = Math.random() * 2 * Math.PI;
    this.speed = Math.random() * speed + 0.1;
    this.velocityX = Math.cos(this.angle) * this.speed;
    this.velocityY = Math.sin(this.angle) * this.speed;
    this.startTime = Date.now();
    this.duration = Math.random()*300 + FIREWORK_LIFESPAN;
    this.dampening = 30;
    if(isFixedSpeed){
      this.velocityX = Math.cos(this.angle) * speed;
      this.velocityY = Math.sin(this.angle) * speed;
    }
    this.initialVelocityX = this.velocityX;
    this.initialVelocityY = this.velocityY;
  }

  animate(){
    const elapsed = Date.now() - this.startTime;
    if(elapsed <= 200){
      this.x += this.initialVelocityX * PARTICLE_INITIAL_SPEED;
      this.y += this.initialVelocityY * PARTICLE_INITIAL_SPEED;
      this.alpha += 0.01;
    } else {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.alpha = Math.min(this.alpha + 0.03, 1);
    }
    this.velocityY += GRAVITY / 1000;
    if(elapsed >= this.duration){
      this.velocityX -= this.velocityX / this.dampening;
      this.velocityY -= this.velocityY / this.dampening;
    }
    if(elapsed >= this.duration*2){
      this.alpha -= 0.02;
    }
  }

  render(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${this.red+50}, ${this.green+50}, ${this.blue+50}, 1)`;
    ctx.fill();
  }
}

const createFirework = (x = canvas.width/2, y = canvas.height/2) => {
  const colors = [
    [255, 0, 100], // pink
    [255, 255, 0], // yellow
    [255, 140, 0], // orange
    [200, 0, 255], // purple
    [0, 255, 255]  // cyan
  ];
  const [r, g, b] = colors[Math.floor(Math.random()*colors.length)];

  let speed = Math.random()*2 + BASE_PARTICLE_SPEED;
  let maxSpeed = speed;

  for(let i=0;i<PARTICLES_PER_FIREWORK;i++){
    particles.push(new Particle(x,y,r,g,b,speed));
    maxSpeed = speed > maxSpeed ? speed : maxSpeed;
  }
  for(let i=0;i<40;i++){
    particles.push(new Particle(x,y,r,g,b,maxSpeed,true));
  }
}

const loop = () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=particles.length-1;i>=0;i--){
    particles[i].animate();
    particles[i].render();
    if(particles[i].y>canvas.height || particles[i].x<0 || particles[i].x>canvas.width || particles[i].alpha<=0){
      particles.splice(i,1);
    }
  }
  requestAnimationFrame(loop);
};
loop();

// --- Confetti via canvas-confetti ---
function startConfetti() {
  const duration = 3000; // 3 segundos
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(() => {
    confetti({
      ...defaults,
      particleCount: 30,
      origin: { x: Math.random(), y: Math.random() * 0.5 }, // dentro da tela
      colors: ['#ff6ec4','#7873f5','#f9ca24','#00cec9','#ff7675']
    });
  }, 200);

  setTimeout(() =>  clearInterval(interval), duration);
}

// --- Botão SIM dispara fogos e confetti ---
function clicar () {
  avancarCena()
  const fireworkInterval = setInterval(() => {
    createFirework(Math.random()*canvas.width, Math.random()*canvas.height);
  }, 300);
  setTimeout(() => clearInterval(fireworkInterval), 3000);

  iniciarAlbum()
  startConfetti();
}

const fotosAlbum = [
  '/assets/imgs/foto1.jpg',
'/assets/imgs/foto2.jpg',
'/assets/imgs/foto3.jpg',
'/assets/imgs/foto4.jpg',
'/assets/imgs/foto5.jpg',
'/assets/imgs/foto6.jpg',
'/assets/imgs/foto7.jpg',
'/assets/imgs/foto8.jpg',
'/assets/imgs/foto9.jpg',
'/assets/imgs/foto10.jpg',
'/assets/imgs/foto11.jpg',
'/assets/imgs/foto12.jpg',
];

let idxAlbum = 0;
let timerAlbum = null;

function preloadAlbum() {
  fotosAlbum.forEach(src => { const im = new Image(); im.src = src; });
}
preloadAlbum();

function iniciarAlbum() {
  const img = document.getElementById("album-img");
  if (!img) return;

  // reinicia
  idxAlbum = 0;
  img.classList.remove("show");
  img.src = fotosAlbum[idxAlbum];
  requestAnimationFrame(() => img.classList.add("show"));

  // limpa intervalos anteriores (se houver)
  if (timerAlbum) clearInterval(timerAlbum);

  // troca automática a cada 3s
  timerAlbum = setInterval(() => {
    idxAlbum = (idxAlbum + 1) % fotosAlbum.length;
    img.classList.remove("show");
    // pequeno delay para suavizar o fade
    setTimeout(() => {
      img.src = fotosAlbum[idxAlbum];
      img.classList.add("show");
    }, 120);
  }, 3000);
}

