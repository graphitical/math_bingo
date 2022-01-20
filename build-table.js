let mountains = [
  { name: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
  { name: "Monte Falterona", height: 1654, place: "Parco Foreste Casentinesi" },
  { name: "Poggio Scali", height: 1520, place: "Parco Foreste Casentinesi" },
  { name: "Pratomagno", height: 1592, place: "Parco Foreste Casentinesi" },
  { name: "Monte Amiata", height: 1738, place: "Siena" }
];


const defaultEquations = "f(x), g(x), \\frac{\\partial u}{\\partial t} = \\Delta u, \\sum_{n=1}^{\\infty} 2^{-n} = 1, x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}, \\frac{d}{dx} f(x), a^2 + b^2 = c^2, E=mc^2, i=-\\sqrt{i}, \\int_a^b f'(x) dx = f(b) - f(a), F_G = G\\frac{m_1*m_2}{r^2}, G_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}, \\Delta S \\ge 0, 0, \\nabla \\cdot D = \\rho_V, \\nabla \\cdot B = 0, \\nabla \\times E = -\\frac{\\partial B}{\\partial t}, \\nabla \\times H = \\frac{\\partial D}{\\partial t} + J, e^{i\\pi} + 1 = 0, log(xy) = log(x) + log(y), \\frac{df}{dt} = \\lim_{h \\to 0} \\frac{f(t+h) - f(t)}{h}, F - E + V = 2, \\Phi(x) = \\frac{1}{\\sqrt{2\\pi\\sigma}}e^{\\frac{(x-\\mu)^2}{2\\sigma^2}}, \\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}, \\rho\\Big(\\frac{\\partial v}{\\partial t} + v \\cdot \\nabla v\\Big)=-\\nabla p + \\nabla \\cdot T + f, \\hat{H}\\Psi = E\\Psi";
let newEquations = [];
let init = true;

const BINGO = "BINGO";
const f = "\\[";
const b = "\\]";

function generateTableHead(table) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let i = 0; i < 5; i++) {
    let th = document.createElement('th');
    let text = document.createTextNode(BINGO[i]);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function buildTable(data) {
  clearBingoTable();
  let table = document.getElementById('bingo-table');
  const numRows = BINGO.length;
  const numCols = BINGO.length;
  // console.log(numRows);
  // console.log(numCols);
  let shuffled_data = shuffle(data);
  for( let currRow = 0; currRow < numRows; currRow++) {
    let row = table.insertRow();
    for (let currCol = 0; currCol < numCols; currCol++) {
      let cell = row.insertCell();
      if (currRow == 2 && currCol == 2) {
        let text = document.createTextNode(f+"FREE"+b);
        cell.appendChild(text);
        continue;
      }
      let text = document.createTextNode(f + shuffled_data[currCol + currRow*5] + b);
      cell.appendChild(text);
    }
  }
  generateTableHead(table);
  if (!init) {MathJax.typeset();}
  init = false;
}

function clearBingoTable() {
  let table = document.getElementById('bingo-table');
  [...table.children].forEach(c => table.removeChild(c));
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function shuffleEquations() {
  equations = shuffle(equations);
  buildTable(table, equations)
  MathJax.typeset();
}

function addEquation(text) {
  if (!text) return;

  newEquations.push(text);
  console.log(newEquations);
  let equationList = document.getElementById("equation-list");
  let row = equationList.insertRow();
  let raw_text = row.insertCell();
  raw_text.innerHTML = text;
  let format_text = row.insertCell();
  format_text.innerHTML = f + text + b;
  let del_btn = document.createElement('input');
  del_btn.type = "button";
  del_btn.className = "del-btn";
  del_btn.value = "-";
  del_btn.onclick = (function(text) {return function() { deleteEquation(text);}})(text);
  let td = row.insertCell();
  td.appendChild(del_btn);
  MathJax.typeset();
}

function deleteEquation(text) {
  if (!text) return;

  console.log(newEquations);
  const index = newEquations.indexOf(text);
  if ( index > -1 ) { newEquations.splice(index, 1)};
  console.log(newEquations);
  let equationList = document.getElementById("equation-list");
  equationList.deleteRow(index+1); // +1 so we don't delete header, prolly a better way to do this
}

function clearEquations() {
  // console.log(newEquations)
  let equationList = document.getElementById("equation-list");
  const nrows = equationList.rows.length;
  for ( let i = 1; i < nrows; i++) {
    equationList.deleteRow(1);
  }
  newEquations = [];
  // console.log(newEquations)
}

let equations = shuffle(defaultEquations.split(","));
buildTable(equations);
