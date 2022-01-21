// https://docs.mathjax.org/en/latest/web/configuration.html
window.MathJax = {
  tex: {
    inlineMath: [['$','$'], ['\\(', '\\)']]
  },
  svg: {
    scale: 1.0
  }
};

(function () {
  var script = document.createElement('script');
  // script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
  script.async = true;
  document.head.appendChild(script);
})();