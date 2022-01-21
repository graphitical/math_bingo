const defaultEquations = "f(x), g(x), \\frac{\\partial u}{\\partial t} = \\Delta u, \\sum_{n=1}^{\\infty} 2^{-n} = 1, x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}, \\frac{d}{dx} f(x), a^2 + b^2 = c^2, E=mc^2, i=-\\sqrt{i}, \\int_a^b f'(x) dx = f(b) - f(a), F_G = G\\frac{m_1*m_2}{r^2}, G_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}, \\Delta S \\ge 0, 0, \\nabla \\cdot D = \\rho_V, \\nabla \\cdot B = 0, \\nabla \\times E = -\\frac{\\partial B}{\\partial t}, \\nabla \\times H = \\frac{\\partial D}{\\partial t} + J, e^{i\\pi} + 1 = 0, log(xy) = log(x) + log(y), \\frac{df}{dt} = \\lim_{h \\to 0} \\frac{f(t+h) - f(t)}{h}, F - E + V = 2, \\Phi(x) = \\frac{1}{\\sqrt{2\\pi\\sigma}}e^{\\frac{(x-\\mu)^2}{2\\sigma^2}}, \\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}, \\rho\\Big(\\frac{\\partial v}{\\partial t} + v  \\cdot \\nabla v\\Big)=-\\nabla p + \\nabla \\cdot T + f, \\hat{H}\\Psi = E\\Psi";
let equations = [];
let init = true;

const BINGO = 'BINGO';
// const f = '\\(';
// const b = '\\)';
const f = '$';
const b = '$';

// Listener for adding equations
const input = document.getElementById('eq-input');
// input.addEventListener('input', updateValue);
input.addEventListener('keyup', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addEquation(e.target.value);
  }
}, false);

function updateValue(e){
  const eq = e.target.value;
  // console.log(eq);
  let t = document.getElementById('eq-preview');
  t.innerHTML = 'Preview: ' + '\\(' + eq + '\\)'; // parens here b/c we want it inline
  MathJax.typeset();
}

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

function buildTable(shuffleEqs=true) {
  // console.log('build')
  let eqs = shuffleEqs ? shuffle(equations) : equations;

  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      const n = j+i*5;
      const sq = 'sq' + (n+1);
      // console.log(sq);

      let el = document.getElementById(sq);
      // console.log(el)
      const eq = eqs[n];
      let text = f+'x'+b;
      if (eq) {
        text = f+eq+b;
      }
      if(i==2 && j==2) text = f+'\\text{FREE}'+b;
      el.innerHTML = text;
    }
  }
  try{
    MathJax.typeset();
  } catch(e) {
    console.log(e)
  }
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(input) {
  let array = [...input];
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

function addEquation(text) {
  if (!text) return;

  equations.push(text);
  let equationList = document.getElementById('eq-list');
  let row = equationList.insertRow();
  let format_text = row.insertCell();
  format_text.innerHTML = f + text + b;
  let del_btn = document.createElement('input');
  del_btn.type = 'button';
  del_btn.className = 'del-btn';
  del_btn.value = 'x';
  del_btn.onclick = (function(text) {return function() { deleteEquation(text);}})(text);
  let td = row.insertCell();
  td.appendChild(del_btn);
  buildTable();
}

function deleteEquation(text) {
  const ridx = equations.indexOf(text);
  console.log('Delete',equations[ridx])
  if ( ridx > -1 ) { equations.splice(ridx, 1)};
  document.getElementById('eq-list').deleteRow(ridx+1);
  buildTable();
}

function clearEquations() {
  let clear = confirm("You are about to delete all your equations. This cannot be undone.\n\nAre you sure??")
  if (!clear) return;

  console.log('Clear all equations');
  let eqList = document.getElementById('eq-list');
  const nr = eqList.rows.length;
  for (let i=1; i<nr; ++i) {
    eqList.deleteRow(1);
  }
  equations=[];
  buildTable();
}

function saveTable() {
  const element = document.getElementById('bingo-table');
  console.log('Exporting table...')
  const ns = 25;
  async function process() {
    for(let i=0; i<ns; i++) {
      // console.log('i',i)
      let cell = document.getElementById('sq'+(i+1));
      let svg = cell.getElementsByTagName('svg')[0];
      let r = svg.getBoundingClientRect();
      SVGToImage({
        svg: svg,
        width: r.width,
        height: r.height,
        outputFormat: 'blob'
      }).then(function(blob){
        let img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        cell.innerHTML='';
        cell.appendChild(img);
      }).catch(function(err){
        console.log(err);
      })
    }
    await sleep(1000);
    html2canvas(document.getElementById('bingo-table')).then(function(canvas) {
      let url = canvas.toDataURL('image/png');
      let a = document.createElement('a');
      a.download = 'card.png';
      a.href = url;
      a.textContent = 'Download card';
      a.click();
    });
    await sleep(1000);
  }
  process();
  // rebuild
  buildTable();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Simple function that converts a plain SVG string or SVG DOM Node into an image with custom dimensions.
 * 
 * @param {Object} settings The configuration object to override the default settings.
 * @see https://ourcodeworld.com/articles/read/1456/how-to-convert-a-plain-svg-string-or-svg-node-to-an-image-png-or-jpeg-in-the-browser-with-javascript
 * @returns {Promise}
 */
function SVGToImage(settings){
    let _settings = {
        svg: null,
        // Usually all SVG have transparency, so PNG is the way to go by default
        mimetype: 'image/png',
        quality: 0.92,
        width: 'auto',
        height: 'auto',
        outputFormat: 'base64'
    };

    // Override default settings
    for (let key in settings) { _settings[key] = settings[key]; }

    return new Promise(function(resolve, reject){
        let svgNode;
        // Create SVG Node if a plain string has been provided
        if(typeof(_settings.svg) == 'string'){
            // Create a non-visible node to render the SVG string
            let SVGContainer = document.createElement('div');
            SVGContainer.style.display = 'none';
            SVGContainer.innerHTML = _settings.svg;
            svgNode = SVGContainer.firstElementChild;
        }else{
            svgNode = _settings.svg;
        }
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d'); 

        let svgXml = new XMLSerializer().serializeToString(svgNode);
        // let svgBase64 = 'data:image/svg+xml;base64,' + btoa(svgXml);
        // HOTFIX for broken btoa pipeline
        // https://stackoverflow.com/questions/67145804/svg-to-canvas-with-html-symbol
        let svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgXml)));

        const image = new Image();
        image.onload = function(){
            let finalWidth, finalHeight;

            // Calculate width if set to auto and the height is specified (to preserve aspect ratio)
            if(_settings.width === 'auto' && _settings.height !== 'auto'){
                finalWidth = (this.width / this.height) * _settings.height;
            // Use image original width
            }else if(_settings.width === 'auto'){
                finalWidth = this.naturalWidth;
            // Use custom width
            }else{
                finalWidth = _settings.width;
            }

            // Calculate height if set to auto and the width is specified (to preserve aspect ratio)
            if(_settings.height === 'auto' && _settings.width !== 'auto'){
                finalHeight = (this.height / this.width) * _settings.width;
            // Use image original height
            }else if(_settings.height === 'auto'){
                finalHeight = this.naturalHeight;
            // Use custom height
            }else{
                finalHeight = _settings.height;
            }

            // Define the canvas intrinsic size
            canvas.width = finalWidth;
            canvas.height = finalHeight;

            // Render image in the canvas
            context.drawImage(this, 0, 0, finalWidth, finalHeight);

            if(_settings.outputFormat == 'blob'){
                // Fulfill and return the Blob image
                canvas.toBlob(function(blob){
                    resolve(blob);
                }, _settings.mimetype, _settings.quality);
            }else{
                // Fullfil and Return the Base64 image
                resolve(canvas.toDataURL(_settings.mimetype, _settings.quality));
            }
        };

        // Load the SVG in Base64 to the image
        image.src = svgBase64;
    });
}

// Start of code
// Load up default equations
// for (let eq of defaultEquations.split(',')) {
//   addEquation(eq);
//   console.log(eq)
// }
// Build table
buildTable();

