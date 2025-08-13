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
