let levelColor = {};
let goldPoint = "0,0";
let level = 1;
let timer = 15;
let timerStarted = false;
let gameOver = false;
let mistake = 0;
let helpCount = 0;

const elementTimer = document.getElementById("timer");
const elementHelp = document.getElementById("help");
const elementScore = document.getElementById("score");
const elementMistake = document.getElementById("mistake");
const elementOverlayResult = document.getElementsByClassName("overlay-result-parent")[0];
const elementScoreResult = document.getElementById("score_result");
const elementMistakeResult = document.getElementById("mistake_result");
const elementAnimal_name = document.getElementsByClassName("animal_name")[0];
const elementAnimal_img = document.getElementsByClassName("animal_img")[0];
const elementAnimal_desc = document.getElementsByClassName("animal_desc")[0];
const elementNewGame = document.getElementsByClassName("big-button")[0];
const elementShareResult = document.getElementsByClassName("big-button")[1];
const tableData = document.getElementById("table_data");

function generateCellColor(cell, i, j) {
  if (goldPoint === `${i},${j}`) {
    cell.style.backgroundColor = levelColor.goldColor;
    return true;
  } else
    cell.style.backgroundColor = levelColor.color;
  return false;
}

function generateWidth() {
  if (level === 1)
    return 2;
  else {
    const result = (level / 3) + 2;
    if (result > 7)
      return 7;
    else return result;
  }
}


/*
1 2*2
2 3*3
3 3*3
4 4*4
5 4*4
 */

const levelUp = () => {
  if (gameOver)
    return;
  if (!timerStarted) {
    setupTime();
    timerStarted = true;
  } else {
    timer += 3;
  }
  level++;
  elementScore.innerText = level + "";
  generateLevelColor();
  generateGrid(generateWidth(), true);
};


const generateGrid = (width, initialGoldPoint) => {
  const gridContainer = document.getElementsByClassName("gridContainer")[0];
  gridContainer.innerText = "";
  if (initialGoldPoint)
    goldPoint = `${generateRandNumber(width)},${generateRandNumber(width)}`;
  for (let i = 0; i < width; i++) {
    const row = document.createElement("div");
    row.classList.add("gridRow");
    gridContainer.appendChild(row);
    for (let j = 0; j < width; j++) {
      const cell = document.createElement("div");
      cell.classList.add("gridCell");
      const isGoldCell = generateCellColor(cell, i, j);
      if (isGoldCell)
        cell.onclick = levelUp;
      else
        cell.onclick = () => {
          timer -= 2;
          mistake++;
          elementMistake.innerText = mistake + "";
        };
      row.appendChild(cell);
    }
  }
};

const generateRandNumber = (range) => {
  return Math.floor((Math.random() * range));
};

const generateDiffColor = () => {
  if (level < 5)
    return 30 - (level * 2);
  else
    return 30 - (level * 1.5);
};

const generateLevelColor = () => {
  const R = generateRandNumber(120);
  const G = generateRandNumber(120);
  const B = generateRandNumber(120);
  const color = `rgb(${R},${G},${B})`;
  const tolerance = generateDiffColor();
  const goldColor = `rgb(${R - tolerance},${G + tolerance},${B + tolerance})`;
  levelColor.color = color;
  levelColor.goldColor = goldColor;
};

const convertRgbToArray = (rgb) => {
  rgb = rgb.replace("rgb(", "").replace(")", "");
  return rgb.split(",");
};

const updateLevelColor = () => {
  const rgb = convertRgbToArray(levelColor.color);
  const R = rgb[0];
  const G = rgb[1];
  const B = rgb[2];
  console.log(rgb);
  const color = `rgb(${parseInt(R)},${parseInt(G)},${parseInt(B)})`;
  const goldColor = `rgb(${parseInt(R) - 25},${parseInt(G) + 25},${parseInt(B) + 25})`;
  levelColor.color = color;
  levelColor.goldColor = goldColor;
};

function initializeResultPage(result) {
  elementOverlayResult.style.display = "initial";
  elementScoreResult.innerText = level + "";
  elementMistakeResult.innerText = mistake + "";
  elementAnimal_name.innerText = result.name;
  elementAnimal_img.src = result.img;
  elementAnimal_desc.innerText = result.desc;
}

function finishGame() {
  gameOver = true;
  timerStarted = false;
  let result;
  for (let i = 0; i < levels.length; i++) {
    if (level < levels[i].range) {
      result = levels[i];
      break;
    }
  }
  initializeResultPage(result);
  if (level > 5)
    setupTime(sendScoreToServer, 1000)
}

function sendScoreToServer() {
  const nickname = localStorage.getItem("nikename") || prompt("یک نام برای خود بنویسید");
  if (!nickname)
    return;
  localStorage.setItem("nikename", nickname);
  fetch("http://unique-game.ir/course_app/api/ScoreController.php?action=insert" +
    "&nickName=" + nickname + "&score=" + level + "&mistake=" + mistake + "&help=" + helpCount)
    .then(res => {
      return res.json()
    }).then(json => {
    if (json.status === "ok") {
      alert("امتیاز شما برای سرور ارسال شد");
      loadScores()
    } else {
      alert("امتیاز شما برای سرور ارسال نشد حاجی")
    }
  })
    .catch(err => {
      console.log(err)
    })
}


function loadScores() {
  fetch("http://unique-game.ir/course_app/api/ScoreController.php?action=read")
    .then(res => res.json())
    .then(json => {
      console.log(json);
      json.forEach(item => {
        const tr = document.createElement("tr");
        const td_name = document.createElement("td");
        td_name.innerText = item.nickName;
        const td_score = document.createElement("td");
        td_score.innerText = item.score;
        const td_mistake = document.createElement("td");
        td_mistake.innerText = item.mistake;
        const td_help = document.createElement("td");
        td_help.innerText = item.help;
        const td_sum = document.createElement("td");
        td_sum.innerText = item.sum;
        tr.appendChild(td_name);
        tr.appendChild(td_score);
        tr.appendChild(td_mistake);
        tr.appendChild(td_help);
        tr.appendChild(td_sum);
        tableData.appendChild(tr)
      })
    }).catch(err => {
    console.log(err)
  })
}

const setupTime = () => {
  const intervalId = setInterval(() => {
    timer -= 0.1;
    if (timer < 0) {
      finishGame();
      return clearInterval(intervalId);
    }
    elementTimer.innerText = Math.floor(timer * 10) / 10 + "";
  }, 100);
};

generateLevelColor();
generateGrid(2, true);
loadScores();

elementHelp.onclick = () => {
  if (gameOver || !timerStarted)
    return;
  timer -= 7;
  helpCount++;
  updateLevelColor();
  generateGrid(generateWidth(), false);
};

elementNewGame.onclick = () => {
  elementOverlayResult.style.display = "none";
  level = 1;
  timer = 15;
  generateLevelColor();
  generateGrid(generateWidth(), true);
  elementScore.innerText = 0 + "";
  elementMistake.innerText = 0 + "";
  elementTimer.innerText = 15 + "";
  gameOver = false;
};

elementShareResult.onclick = () => {
  window.location.assign(`https://t.me/share/url?url={http://unique-game.ir}&text={من تو چالش بینایی شرکت کردم و نتیجه کار شد موش کور}`);
};


