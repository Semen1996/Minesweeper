const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');

const canvasTime = document.querySelector('.canvasTime');
const contextTime = canvasTime.getContext('2d');

let sprite;
let gameStart = false;

const xCells = 16;
const yCells = 16;
let nBombs = 40;
let nFlags = nBombs;
const dx = 34;
const dy = 34;
canvas.width = dx*xCells;
canvas.height = dy*yCells;

let smileVar = 0;
const dwSmile = 26*2;
const dhSmile = 26*2;
const dwNumber = 13*2;
const dhNumber = 23*2;
canvasTime.width = dx*xCells;
canvasTime.height = 70;

let sec0 = 0;
let sec1 = 0;
let sec2 = 0;

let blocks = [];
for(let i = 0; i < xCells; i++ ) {
  let row = Array();
  for(let j = 0; j < yCells; j++) {
    row.push({number: 0, show: 0});
  }
  blocks.push(row);
}

// Заполняем массив пустыми клетками
function initial() {
  sec0 = 0;
  sec1 = 0;
  sec2 = 0;

  nFlags = 40;
  gameStart = false;
  blocks = blocks.map(column => {
    return column.map(block => {
      return {number: 0, show: 0};
    });
  });
}

// Расчет соседей
function neighbors(i, j) {
  if(i >= 0 && i < xCells && j >= 0 && j < yCells) {
    if(blocks[i][j].number !== 9) {
      blocks[i][j].number++;
    }
  }
}

// Ф-ция, отмечающая соседним клеткам, что там рядом бомба
function nearBomb(i, j) {
  neighbors(i, j-1);
  neighbors(i, j+1);
  neighbors(i-1, j);
  neighbors(i+1, j);

  neighbors(i-1, j-1);
  neighbors(i-1, j+1);
  neighbors(i+1, j-1);
  neighbors(i+1, j+1);
}

// Ф-ция генерирующая бомбы
function generateBombs(xStart, yStart) {
  const startMove = xStart*yCells + yStart;
  const countCells = xCells*yCells - 1;

  const min = 0;
  const max = countCells - 1;

  let bombs = [];

  while(bombs.length < nBombs) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if(bombs.some(bomb => bomb === randomNumber) || startMove === randomNumber) continue;
    bombs.push(randomNumber);
  }

  bombs.forEach(bomb => {
    const i = Math.floor(bomb/yCells);
    const j =  bomb%yCells
    blocks[i][j].number = 9;
    nearBomb(i,j);
  }); 
}

// Функция, заполняющая ячейки бомбами и числами
function start(xStart, yStart) {
  generateBombs(xStart, yStart);
  gameStart = true;
}

// Загружаем картинку
function loadImage(src) {
  return new Promise((res) => {
    const img = new Image();
    img.src = src;
    img.onload = () => res(img);
  }); 
}

// Ф-ция, загружающая спрайт
async function loadSprite() {
  sprite = await loadImage('sprite.png');
}

// Рисуем разные элементы картинок
const cell = (i, j) => context.drawImage(sprite, 0*17, 50, 17, 17, i*dx, j*dy, dx, dy);
const emptyCell = (i, j) => context.drawImage(sprite, 1*17, 50, 17, 17, i*dx, j*dy, dx, dy);
const bomb = (i, j) => context.drawImage(sprite, 5*17, 50, 17, 17, i*dx, j*dy, dx, dy);
const bombActive = (i, j) => context.drawImage(sprite, 6*17, 50, 17, 17, i*dx, j*dy, dx, dy);
const number = (i, j, number) => context.drawImage(sprite, (number - 1)*17, 67, 17, 17, i*dx, j*dy, dx, dy);
const flag = (i, j) => context.drawImage(sprite, 2*17, 50, 17, 17, i*dx, j*dy, dx, dy);
const question = (i, j) => context.drawImage(sprite, 3*17, 50, 17, 17, i*dx, j*dy, dx, dy);
const nonBomb = (i, j) => context.drawImage(sprite, 7*17, 50, 17, 17, i*dx, j*dy, dx, dy);
const smile = (v) => contextTime.drawImage(sprite, v*26 + v, 24, 26, 26, 0.5*canvasTime.width - 0.5*dwSmile, 0.5*canvasTime.height - 0.5*dhSmile, dwSmile, dhSmile);
const timeNumber = (num, pos) => {
  if(num === 0) {
    contextTime.drawImage(sprite, 9*13 + 9, 0, 13, 23, canvasTime.width - (1.5*dwNumber + pos*dwNumber), 0.5*canvasTime.height - 0.5*dhNumber, dwNumber, dhNumber);
    return;
  }
  contextTime.drawImage(sprite, (num - 1)*13 + (num - 1), 0, 13, 23, canvasTime.width - (1.5*dwNumber  + pos*dwNumber), 0.5*canvasTime.height - 0.5*dhNumber, dwNumber, dhNumber);
};

// Ф-ция, которая отрисовывает минное поле
function drawMinefield() {
  blocks.forEach((column, i) => {
    column.forEach((block, j) => {
      if(block.show === 1) {
        if(block.number === 10) {
          bombActive(i, j);
          return;
        }
        if(block.number === 9) {
          bomb(i, j);
          return;
        }
        if(block.number) {
          number(i, j, block.number);
        }
        if(!block.number) {
          emptyCell(i, j);
        }
      } else if(block.show === 2) {
          question(i, j);
      } else if(block.show === 3) {
          flag(i, j);
      } else if(block.show === 4) {
        nonBomb(i, j);
      } else {
          cell(i, j);
      }
    });
  });
}

// Ф-ция, которая отрисовывает смайлик
function drawSmile() {
    smile(smileVar);
}

// Ф-ция, которая отрисовывает кол-во оставшихся мин
function drawCountMine() {
  const arr = nFlags.toString().split('');


  if(arr.length === 1) {
    timeNumber(0, 19);
    timeNumber(0, 18);
    timeNumber(Number(arr[0]), 17);
  } else {
    timeNumber(0, 19);
    timeNumber(Number(arr[0]), 18);
    timeNumber(Number(arr[1]), 17);
  }
}

// Ф-ция, которая отрисовывает таймер
function drawTimer() {
  timeNumber(sec0, 0);
  timeNumber(sec1, 1);
  timeNumber(sec2, 2);

  sec0++;
  if(sec0 > 9) {
    sec0 = 0;
    sec1++;
  }

  if(sec1 > 9) {
    sec1 = 0;
    sec2++;
  }

  if(sec2 > 9) {
    sec2 = 0;
  }
}

function draw() {
  drawMinefield();
  drawSmile();
  drawCountMine();
}

// Вызываем для начала работы основные функции
initial();
loadSprite();
setInterval(draw, 25);
setTimeout(drawTimer, 25);
setInterval(drawTimer, 1000);

// Навешиваем слушателей
canvasTime.addEventListener('mousedown', (evt) => {
    const x = Math.floor((evt.clientX - (17 + 4 + 4 + 0.5*canvasTime.width - 0.5*dwSmile))/(dwSmile));
    const y = Math.floor((evt.clientY- (17 + 4 + 4 +  0.5*canvasTime.height - 0.5*dhSmile))/dhSmile);

    if(!x && !y) {
      smileVar = 1;
    }
});

canvasTime.addEventListener('mouseup', (evt) => {
  const x = Math.floor((evt.clientX - (17 + 4 + 4 + 0.5*canvasTime.width - 0.5*dwSmile))/(dwSmile));
  const y = Math.floor((evt.clientY- (17 + 4 + 4 +  0.5*canvasTime.height - 0.5*dhSmile))/dhSmile);

  if(!x && !y) {
    smileVar = 0;
    initial();
  }
});


canvas.addEventListener('click', (evt) => {
  const x = Math.floor((evt.clientX - (17 + 4))/dx);
  const y = Math.floor((evt.clientY- (17 + 70 + 4 + 4 + 17  + 4))/dy);

  if(!gameStart) {
    start(x, y);
  }

  if(blocks[x][y].show === 0) {
    showBlock(x, y);

    if(blocks[x][y].number === 9) {
      blocks[x][y].number = 10;
      smileVar = 4;
      blocks.forEach(column => {
        column.forEach(block => {
          if(block.number === 9 && block.show === 0) block.show = 1;
          if(block.number !== 9 && block.show === 3) block.show = 4;
        });
      });
    };
  }
});

canvas.addEventListener('contextmenu', (evt) => {
  evt.preventDefault();
  const x = Math.floor((evt.clientX - (17  + 4))/dx);
  const y = Math.floor((evt.clientY- (17 + 70 + 4 + 4 + 17  + 4))/dy);

  if(blocks[x][y].show === 0) {
    blocks[x][y].show = 3;

    nFlags--;

    let n = 0;
    blocks.forEach(column => {
      column.forEach(block => (block.number === 9 && block.show === 3) && n++);
    });

    if(n === nBombs) {
      smileVar = 3;
    }

  } else if(blocks[x][y].show === 3) {
    blocks[x][y].show = 2;
    nFlags++;
  } else if (blocks[x][y].show === 2) {
    blocks[x][y].show = 0;
  }
});

// Ф-ция, показывающая блоки
function showBlock(x, y) {
  blocks[x][y].show = 1;
  if (blocks[x][y].number) {
    return;
  }

  checkZero(x, y-1);
  checkZero(x, y+1);
  checkZero(x-1, y);
  checkZero(x+1, y);
}

// Ф-ция, которая открывает следующую ячейку, если она пустая
function checkZero(x, y) {
  if(x >= 0 && x < xCells && y >= 0 && y < yCells) {
    if(!blocks[x][y].show) {
      showBlock(x, y);
    }
  }
}